// ifconfig.co-style CLI + JSON endpoint for IP Pollo.
//
// Runs on Netlify's edge so it can read the real client IP (`context.ip`) and
// geolocation (`context.geo`) without any third-party call. The browser app at
// `/` is left untouched: CLI clients (curl/wget/…) get the plain-text IP, while
// browsers fall through to the prerendered static page via `context.next()`.
//
// ASN/ISP aren't part of Netlify's edge geo, so /json and the asn/isp endpoints
// enrich server-side from a free, no-key provider (ipwho.is), fail-soft.
import type { Context } from '@netlify/edge-functions'

export const config = {
  path: [
    '/',
    '/json',
    '/ip',
    '/country',
    '/country-iso',
    '/city',
    '/region',
    '/timezone',
    '/coords',
    '/asn',
    '/asn-org',
    '/isp',
    '/ua',
  ],
}

const CORS = { 'access-control-allow-origin': '*' }

const text = (body: string, status = 200) =>
  new Response((body.endsWith('\n') ? body : body + '\n'), {
    status,
    headers: { 'content-type': 'text/plain; charset=utf-8', ...CORS },
  })

const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj, null, 2) + '\n', {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...CORS },
  })

// Match the first product token of the User-Agent against known CLI/programmatic
// clients (mirrors echoip, the engine behind ifconfig.co). PowerShell's UA also
// contains "Mozilla", so this is checked before the Accept-header fallback.
const CLI_UA =
  /^(curl|wget|httpie|xh|go-http-client|go\/|python-requests|fetch|libwww-perl|ddclient|mikrotik|powershell)/i

function isCli(request: Request): boolean {
  const ua = (request.headers.get('user-agent') || '').trim()
  if (!ua) return true // no UA → treat as programmatic
  if (CLI_UA.test(ua)) return true
  const accept = request.headers.get('accept') || ''
  // A real browser sends `Accept: text/html,...`. Anything that doesn't accept
  // HTML (and isn't a wildcard browser preflight) is treated as a CLI client.
  if (accept && !accept.includes('text/html') && !accept.includes('*/*')) return true
  return false
}

// ASN / ISP enrichment. Only called by /json, /asn, /asn-org, /isp so the hot
// paths (curl / and the geo-only fields) never pay for an upstream request.
async function enrich(ip: string): Promise<{
  asn: number | null
  asn_org: string | null
  isp: string | null
}> {
  const empty = { asn: null, asn_org: null, isp: null }
  if (!ip) return empty
  const ctrl = new AbortController()
  const to = setTimeout(() => ctrl.abort(), 1800)
  try {
    const r = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: ctrl.signal,
    })
    if (!r.ok) return empty
    const d = await r.json()
    if (!d || d.success === false || !d.connection) return empty
    const asnNum = Number(d.connection.asn)
    return {
      asn: Number.isFinite(asnNum) && asnNum > 0 ? asnNum : null,
      asn_org: d.connection.org || d.connection.isp || null,
      isp: d.connection.isp || d.connection.org || null,
    }
  } catch {
    return empty
  } finally {
    clearTimeout(to)
  }
}

// Parse a User-Agent header into ifconfig.co-style parts.
function parseUA(ua: string) {
  const raw_value = ua || ''
  let product = ''
  let version = ''
  let comment = ''
  const head = raw_value.match(/^([^/\s]+)(?:\/(\S+))?/)
  if (head) {
    product = head[1] || ''
    version = head[2] || ''
  }
  const c = raw_value.match(/\(([^)]*)\)/)
  if (c) comment = c[1]
  return { product, version, comment, raw_value }
}

// Expand an IPv6 string to its 8 hextet groups (handles `::`).
function expandV6(ip: string): string[] {
  const addr = ip.split('%')[0]
  const dbl = addr.includes('::')
  const [headStr, tailStr] = dbl ? addr.split('::') : [addr, null]
  const head = headStr ? headStr.split(':') : []
  const tail = tailStr ? tailStr.split(':') : []
  if (!dbl) return head
  const missing = 8 - head.length - tail.length
  if (missing < 0) return []
  return [...head, ...Array(missing).fill('0'), ...tail]
}

// The IP as a single integer (IPv4 = 32-bit, IPv6 = 128-bit) in decimal, as a
// string (so the 128-bit value survives). Returns null if it can't be parsed.
function ipDecimal(ip: string): string | null {
  if (!ip) return null
  try {
    if (ip.includes(':')) {
      const groups = expandV6(ip)
      if (groups.length !== 8) return null
      let n = 0n
      for (const g of groups) n = (n << 16n) + BigInt(parseInt(g || '0', 16))
      return n.toString()
    }
    const octets = ip.split('.')
    if (octets.length !== 4) return null
    let n = 0n
    for (const part of octets) {
      const x = Number(part)
      if (!Number.isInteger(x) || x < 0 || x > 255) return null
      n = (n << 8n) + BigInt(x)
    }
    return n.toString()
  } catch {
    return null
  }
}

export default async (request: Request, context: Context): Promise<Response | void> => {
  const { pathname } = new URL(request.url)
  const ip = context.ip
  const g = context.geo || {}
  const ua = request.headers.get('user-agent') || ''

  // Geo-only plain-text fields — zero upstream calls.
  switch (pathname) {
    case '/ip':
      return text(ip)
    case '/country':
      return text(g.country?.name ?? '')
    case '/country-iso':
      return text(g.country?.code ?? '')
    case '/city':
      return text(g.city ?? '')
    case '/region':
      return text(g.subdivision?.name ?? '')
    case '/timezone':
      return text(g.timezone ?? '')
    case '/coords':
      return text(`${g.latitude ?? ''},${g.longitude ?? ''}`)
    case '/ua':
      return text(ua)
  }

  // Endpoints that need ASN/ISP enrichment.
  if (pathname === '/json') {
    const extra = await enrich(ip)
    // A single connection only exposes one family. `ip` is whatever you
    // connected over; `ipv4`/`ipv6` label it. Hit v4.ippollo.com to force IPv4.
    const isV6 = ip.includes(':')
    const body = {
      ip,
      ip_decimal: '__IPDEC__', // placeholder → replaced with an unquoted number
      ipv4: isV6 ? null : ip,
      ipv6: isV6 ? ip : null,
      country: g.country?.name ?? null,
      country_iso: g.country?.code ?? null,
      region: g.subdivision?.name ?? null,
      region_code: g.subdivision?.code ?? null,
      city: g.city ?? null,
      postal_code: g.postalCode ?? null,
      latitude: g.latitude ?? null,
      longitude: g.longitude ?? null,
      timezone: g.timezone ?? null,
      user_agent: parseUA(ua),
      asn: extra.asn,
      asn_org: extra.asn_org,
      isp: extra.isp,
    }
    const s = JSON.stringify(body, null, 2).replace(
      '"__IPDEC__"',
      ipDecimal(ip) ?? 'null',
    )
    return new Response(s + '\n', {
      headers: { 'content-type': 'application/json; charset=utf-8', ...CORS },
    })
  }

  if (pathname === '/asn') {
    const { asn, asn_org } = await enrich(ip)
    return text(asn ? `AS${asn} ${asn_org ?? ''}`.trim() : (asn_org ?? ''))
  }
  if (pathname === '/asn-org') {
    const { asn_org } = await enrich(ip)
    return text(asn_org ?? '')
  }
  if (pathname === '/isp') {
    const { isp } = await enrich(ip)
    return text(isp ?? '')
  }

  // pathname === '/' → content negotiation.
  if (isCli(request)) return text(ip)
  return context.next() // browsers → existing prerendered static app
}
