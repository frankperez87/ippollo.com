import {
  STR,
  SOUNDS,
  BREEDS,
  TITLES,
  FACTS,
  SPEED_TIERS,
  PRIV,
  type Lang,
} from './usePolloData'

type Consent = 'unknown' | 'granted' | 'denied'
type SpeedState = 'idle' | 'testing' | 'done'

interface Speed {
  state: SpeedState
  down: number | null
  up: number | null
  ping: number | null
}

const COOLDOWN_MS = 60000
const CLUCKS_PER_EGG = 12

// Non-reactive module-level handles (timers, dedupe guards) shared across the singleton.
let cooldownTimer: ReturnType<typeof setInterval> | null = null
let speedMsgTimer: ReturnType<typeof setInterval> | null = null
let bubbleTimer: ReturnType<typeof setTimeout> | null = null
let copyTimer: ReturnType<typeof setTimeout> | null = null
let bragTimer: ReturnType<typeof setTimeout> | null = null
let inited = false

declare global {
  interface Window {
    __loadGA__?: () => void
  }
}

export function usePollo() {
  // ---- shared reactive state (SSR-safe singletons) ----
  const lang = useState<Lang>('pollo-lang', () => 'en')
  const dark = useState<boolean>('pollo-dark', () => false)

  const ip = useState<string>('pollo-ip', () => '')
  const city = useState<string>('pollo-city', () => '')
  const country = useState<string>('pollo-country', () => '')
  const flag = useState<string>('pollo-flag', () => '')
  const isp = useState<string>('pollo-isp', () => '')
  const browserName = useState<string>('pollo-browser', () => 'Unknown')
  const osName = useState<string>('pollo-os', () => 'Unknown')
  const deviceType = useState<string>('pollo-devicetype', () => 'Desktop')
  const loading = useState<boolean>('pollo-loading', () => true)
  const isDemo = useState<boolean>('pollo-isdemo', () => false)

  const clucks = useState<number>('pollo-clucks', () => 0)
  const showBubble = useState<boolean>('pollo-bubble', () => false)
  const bubbleText = useState<string>('pollo-bubbletext', () => '')
  const factIndex = useState<number>('pollo-factindex', () => 0)
  const copied = useState<boolean>('pollo-copied', () => false)
  const bragged = useState<boolean>('pollo-bragged', () => false)

  const speed = useState<Speed>('pollo-speed', () => ({
    state: 'idle',
    down: null,
    up: null,
    ping: null,
  }))
  const speedDoneAt = useState<number>('pollo-speeddoneat', () => 0)
  const tick = useState<number>('pollo-tick', () => 0) // forces cooldown countdown recompute

  // live speed-test UI (high-frequency, kept out of the persisted result)
  const liveMbps = useState<string>('pollo-livembps', () => '0.0')
  const trackPct = useState<number>('pollo-trackpct', () => 0)
  const statusMsg = useState<string>('pollo-statusmsg', () => '…')

  const consent = useState<Consent>('pollo-consent', () => 'unknown')
  const showPrivacy = useState<boolean>('pollo-privacy', () => false)

  // ---- pure helpers ----
  function flagFromCode(cc: string): string {
    if (!cc || cc.length !== 2) return '🌍'
    try {
      return String.fromCodePoint(
        ...[...cc.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)),
      )
    } catch {
      return '🌍'
    }
  }

  function computeRating(ipStr: string, l: Lang) {
    const seed =
      String(ipStr)
        .split('')
        .reduce((a, c) => a + c.charCodeAt(0), 0) || 7
    const eggs = (seed % 5) + 1
    return {
      eggs,
      eggsText: eggs + ' / 5',
      breed: BREEDS[l][seed % BREEDS[l].length],
      title: TITLES[l][(seed * 7) % TITLES[l].length],
      freeRange: seed % 2 === 0,
    }
  }

  function fmtSpeed(v: number | null): string {
    if (v == null || !isFinite(v)) return '—'
    return v >= 100 ? String(Math.round(v)) : v.toFixed(1)
  }

  function tierFor(mbps: number | null, l: Lang) {
    const T = SPEED_TIERS
    let i: number
    if (mbps == null) i = 0
    else if (mbps < 3) i = 1
    else if (mbps < 25) i = 2
    else if (mbps < 100) i = 3
    else if (mbps < 500) i = 4
    else i = 5
    const t = T[i]
    return {
      emoji: t.emoji,
      label: t[l],
      sub: t[('sub_' + l) as 'sub_en' | 'sub_es'],
    }
  }

  // ---- computed view values ----
  const t = computed(() => STR[lang.value])

  const rating = computed(() => {
    const base = computeRating(ip.value || '0', lang.value)
    const bonus = Math.floor(clucks.value / CLUCKS_PER_EGG)
    const eggs = Math.min(5, base.eggs + bonus)
    return {
      eggs,
      eggsText: eggs + ' / 5',
      breed: base.breed,
      title: base.title,
      freeRange: base.freeRange,
    }
  })

  const ratingEggs = computed(() =>
    Array.from({ length: 5 }, (_, i) => ({
      op: i < rating.value.eggs ? '1' : '0.22',
      fil: i < rating.value.eggs ? 'none' : 'grayscale(1)',
    })),
  )

  const ratingProgress = computed(() => {
    const eggs = rating.value.eggs
    const maxed = eggs >= 5
    const toNext = maxed ? 0 : CLUCKS_PER_EGG - (clucks.value % CLUCKS_PER_EGG)
    return maxed ? t.value.maxPollo : `${toNext} ${t.value.toNextEgg}`
  })

  const locationText = computed(() => {
    if (city.value && country.value) return `${city.value}, ${country.value}`
    return (
      country.value ||
      (lang.value === 'es' ? 'En algún gallinero' : 'Somewhere in a coop')
    )
  })

  const fact = computed(
    () => FACTS[lang.value][factIndex.value % FACTS[lang.value].length],
  )

  const langLabel = computed(() => (lang.value === 'en' ? 'ES' : 'EN'))
  const darkLabel = computed(() => (dark.value ? '☀️' : '🌙'))

  const downText = computed(() => fmtSpeed(speed.value.down))
  const upText = computed(() => fmtSpeed(speed.value.up))
  const pingText = computed(() =>
    speed.value.ping == null ? '—' : String(Math.round(speed.value.ping)),
  )
  const speedTier = computed(() => tierFor(speed.value.down, lang.value))

  const copyLabel = computed(() => (copied.value ? t.value.copied : t.value.copy))
  const bragLabel = computed(() =>
    bragged.value ? t.value.bragged : t.value.copyBrag,
  )

  // cooldown — `tick` is a reactive dependency so the label re-renders each second
  const cooldownRemain = computed(() => {
    void tick.value
    return speedDoneAt.value
      ? Math.max(0, COOLDOWN_MS - (Date.now() - speedDoneAt.value))
      : 0
  })
  const cooling = computed(() => cooldownRemain.value > 0)
  const speedCountdownLabel = computed(() => {
    const secs = Math.ceil(cooldownRemain.value / 1000)
    const mm = Math.floor(secs / 60)
    const ss = secs % 60
    const clock = mm > 0 ? `${mm}:${String(ss).padStart(2, '0')}` : `${secs}s`
    return `${t.value.speedWait} ${clock}`
  })

  const privacySections = computed(() => PRIV[lang.value])

  // ---- clipboard ----
  function fallbackCopy(txt: string) {
    try {
      const ta = document.createElement('textarea')
      ta.value = txt
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.top = '-1000px'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      ta.setSelectionRange(0, txt.length)
      document.execCommand('copy')
      document.body.removeChild(ta)
    } catch {
      /* noop */
    }
  }
  function copyText(txt: string) {
    if (!txt) return
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).catch(() => fallbackCopy(txt))
        return
      }
    } catch {
      /* noop */
    }
    fallbackCopy(txt)
  }

  // ---- confetti (appends fixed-position particles to <body>) ----
  function spawnConfetti() {
    if (!import.meta.client) return
    const emojis = ['🐔', '🥚', '🍗', '🎉', '⭐', '🌽']
    const cols = ['#FFC02E', '#FF4B2B', '#3A2410', '#FFFFFF']
    const H = window.innerHeight
    for (let i = 0; i < 44; i++) {
      const d = document.createElement('div')
      const useEmoji = Math.random() > 0.45
      if (useEmoji) {
        d.textContent = emojis[Math.floor(Math.random() * emojis.length)]
        d.style.fontSize = 18 + Math.random() * 24 + 'px'
      } else {
        const s = 8 + Math.random() * 9
        d.style.width = s + 'px'
        d.style.height = s + 'px'
        d.style.background = cols[Math.floor(Math.random() * cols.length)]
        d.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px'
      }
      d.style.position = 'fixed'
      d.style.left = Math.random() * 100 + 'vw'
      d.style.top = '-50px'
      d.style.zIndex = '9999'
      d.style.pointerEvents = 'none'
      d.style.willChange = 'transform'
      document.body.appendChild(d)
      const x = (Math.random() * 2 - 1) * 240
      const rot = (Math.random() * 2 - 1) * 760
      const dur = 1500 + Math.random() * 1300
      const anim = d.animate(
        [
          { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
          {
            transform: `translate(${x}px,${H + 90}px) rotate(${rot}deg)`,
            opacity: 1,
            offset: 0.85,
          },
          {
            transform: `translate(${x}px,${H + 90}px) rotate(${rot}deg)`,
            opacity: 0,
          },
        ],
        { duration: dur, easing: 'cubic-bezier(.35,.15,.5,1)' },
      )
      anim.onfinish = () => d.remove()
    }
  }

  // ---- IP lookup (chain of free, HTTPS, CORS-enabled, no-key providers) ----
  async function fetchIp() {
    const providers: { url: string; map: (d: any) => any }[] = [
      {
        url: 'https://ipwho.is/',
        map: (d) =>
          d && d.success !== false && d.ip
            ? {
                ip: d.ip,
                city: d.city,
                country: d.country,
                cc: d.country_code,
                isp: d.connection && (d.connection.isp || d.connection.org),
              }
            : null,
      },
      {
        url: 'https://get.geojs.io/v1/ip/geo.json',
        map: (d) =>
          d && d.ip
            ? {
                ip: d.ip,
                city: d.city,
                country: d.country,
                cc: d.country_code,
                isp: d.organization_name || d.organization,
              }
            : null,
      },
      {
        url: 'https://ipapi.co/json/',
        map: (d) =>
          d && d.ip && !d.error
            ? {
                ip: d.ip,
                city: d.city,
                country: d.country_name,
                cc: d.country_code,
                isp: d.org,
              }
            : null,
      },
      {
        url: 'https://api.ipify.org?format=json',
        map: (d) => (d && d.ip ? { ip: d.ip } : null),
      },
    ]
    for (const p of providers) {
      try {
        const r = await fetch(p.url, { cache: 'no-store' })
        if (!r.ok) continue
        const d = await r.json()
        const m = p.map(d)
        if (m && m.ip) {
          ip.value = m.ip
          city.value = m.city || ''
          country.value = m.country || ''
          flag.value = m.cc ? flagFromCode(m.cc) : '🌍'
          isp.value =
            m.isp || (lang.value === 'es' ? 'Corral Misterioso' : 'Mystery Coop')
          loading.value = false
          isDemo.value = false
          return
        }
      } catch {
        /* try next provider */
      }
    }
    // Everything failed (offline / all blocked) → comedic demo
    ip.value = '203.0.113.42'
    flag.value = '🐔'
    city.value = 'Polloville'
    country.value = 'Cluckistan'
    isp.value = 'Free-Range Fiber Co.'
    loading.value = false
    isDemo.value = true
  }

  // ---- clucks ----
  function cluck() {
    const baseEggs = computeRating(ip.value || '0', lang.value).eggs
    const before = Math.min(5, baseEggs + Math.floor(clucks.value / CLUCKS_PER_EGG))
    const after = Math.min(
      5,
      baseEggs + Math.floor((clucks.value + 1) / CLUCKS_PER_EGG),
    )
    const leveled = after > before
    const newClucks = clucks.value + 1
    try {
      localStorage.setItem('ippollo-clucks', String(newClucks))
    } catch {
      /* noop */
    }
    if (leveled) spawnConfetti()
    return { newClucks, leveled }
  }

  function reactToChicken() {
    const { newClucks, leveled } = cluck()
    const snd = leveled
      ? STR[lang.value].levelUp
      : SOUNDS[Math.floor(Math.random() * SOUNDS.length)]
    clucks.value = newClucks
    showBubble.value = true
    bubbleText.value = snd
    if (bubbleTimer) clearTimeout(bubbleTimer)
    bubbleTimer = setTimeout(() => (showBubble.value = false), 1400)
    if (Math.random() > 0.65) spawnConfetti()
  }

  // ---- toggles ----
  function toggleLang() {
    const next: Lang = lang.value === 'en' ? 'es' : 'en'
    try {
      localStorage.setItem('ippollo-lang', next)
    } catch {
      /* noop */
    }
    lang.value = next
  }
  function toggleDark() {
    const next = !dark.value
    try {
      localStorage.setItem('ippollo-dark', next ? '1' : '0')
    } catch {
      /* noop */
    }
    dark.value = next
  }

  // ---- copy / brag ----
  function copyIp() {
    if (!ip.value) return
    copyText(ip.value)
    spawnConfetti()
    copied.value = true
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => (copied.value = false), 1600)
  }

  function rerollFact() {
    let n = factIndex.value
    const len = FACTS[lang.value].length
    if (len > 1) {
      while (n === factIndex.value) n = Math.floor(Math.random() * len)
    }
    const { newClucks, leveled } = cluck()
    factIndex.value = n
    clucks.value = newClucks
    showBubble.value = leveled
    bubbleText.value = leveled ? STR[lang.value].levelUp : ''
    if (leveled) {
      if (bubbleTimer) clearTimeout(bubbleTimer)
      bubbleTimer = setTimeout(() => (showBubble.value = false), 1400)
    }
  }

  function copyBrag() {
    const txt =
      lang.value === 'es'
        ? `🐔 Mi IP es ${ip.value} y saqué ${rating.value.eggsText} (${rating.value.title}) en ippollo.com. ¿Cuál es tu pollo? 🥚`
        : `🐔 My IP is ${ip.value} and I scored ${rating.value.eggsText} (${rating.value.title}) on ippollo.com. What's your pollo? 🥚`
    copyText(txt)
    spawnConfetti()
    bragged.value = true
    if (bragTimer) clearTimeout(bragTimer)
    bragTimer = setTimeout(() => (bragged.value = false), 1600)
  }

  // ---- consent + privacy ----
  function acceptConsent() {
    try {
      localStorage.setItem('ippollo-consent', 'granted')
    } catch {
      /* noop */
    }
    if (window.__loadGA__) window.__loadGA__()
    spawnConfetti()
    consent.value = 'granted'
  }
  function declineConsent() {
    try {
      localStorage.setItem('ippollo-consent', 'denied')
    } catch {
      /* noop */
    }
    consent.value = 'denied'
  }
  function reopenConsent() {
    consent.value = 'unknown'
  }
  function openPrivacy() {
    showPrivacy.value = true
  }
  function closePrivacy() {
    showPrivacy.value = false
  }

  // ---- speed test ----
  function startCooldown() {
    if (cooldownTimer) clearInterval(cooldownTimer)
    cooldownTimer = setInterval(() => {
      if (Date.now() - speedDoneAt.value >= COOLDOWN_MS) {
        if (cooldownTimer) clearInterval(cooldownTimer)
      }
      tick.value++
    }, 1000)
  }

  async function measurePing(): Promise<number | null> {
    const times: number[] = []
    for (let i = 0; i < 5; i++) {
      const t0 = performance.now()
      try {
        await fetch(
          'https://speed.cloudflare.com/__down?bytes=1&t=' + Math.random(),
          { cache: 'no-store' },
        )
      } catch {
        return null
      }
      times.push(performance.now() - t0)
    }
    times.sort((a, b) => a - b)
    return times[0]
  }

  async function measureDown(
    onProgress: (mbps: number, wall: number, max: number) => void,
  ): Promise<number | null> {
    // Cloudflare's __down caps request size, so loop fixed-size chunks over a
    // time budget, adapting chunk size to the measured rate. Each chunk retries
    // with backoff on transient failure; throughput is over ACTIVE transfer time.
    const t0 = performance.now()
    const budgetMs = 7000
    let received = 0
    let activeMs = 0
    let chunk = 4000000
    let fails = 0
    while (performance.now() - t0 < budgetMs) {
      const cs = performance.now()
      let len = 0
      let ok = false
      const ctrl = new AbortController()
      const to = setTimeout(() => {
        try {
          ctrl.abort()
        } catch {
          /* noop */
        }
      }, 9000)
      try {
        const r = await fetch(
          'https://speed.cloudflare.com/__down?bytes=' + chunk + '&t=' + Math.random(),
          { cache: 'no-store', signal: ctrl.signal },
        )
        if (!r.ok) throw new Error('HTTP ' + r.status)
        const b = await r.arrayBuffer()
        len = b.byteLength
        ok = true
      } catch {
        ok = false
      } finally {
        clearTimeout(to)
      }

      if (ok) {
        const cd = performance.now() - cs
        received += len
        activeMs += cd
        fails = 0
        const wall = (performance.now() - t0) / 1000
        const active = activeMs / 1000
        if (onProgress && active > 0)
          onProgress((received * 8) / active / 1e6, wall, budgetMs / 1000)
        if (cd > 0)
          chunk = Math.min(
            25000000,
            Math.max(2000000, Math.round((len / (cd / 1000)) * 1.0)),
          )
      } else {
        fails++
        if (fails >= 4) break
        chunk = Math.max(2000000, Math.round(chunk / 2))
        await new Promise((res) => setTimeout(res, 300))
      }
    }
    const active = activeMs / 1000
    if (received < 50000 || active <= 0) return null
    return (received * 8) / active / 1e6
  }

  async function measureUp(): Promise<number | null> {
    const bytes = 6000000
    const body = new Uint8Array(bytes)
    const ctrl = new AbortController()
    const to = setTimeout(() => {
      try {
        ctrl.abort()
      } catch {
        /* noop */
      }
    }, 9000)
    const t0 = performance.now()
    try {
      const r = await fetch('https://speed.cloudflare.com/__up', {
        method: 'POST',
        body,
        cache: 'no-store',
        signal: ctrl.signal,
      })
      if (!r.ok) throw new Error('HTTP ' + r.status)
    } catch {
      clearTimeout(to)
      return null
    } finally {
      clearTimeout(to)
    }
    const sec = (performance.now() - t0) / 1000
    if (sec <= 0) return null
    return (bytes * 8) / sec / 1e6
  }

  async function runSpeedTest() {
    if (speed.value.state === 'testing') return
    if (speedDoneAt.value && Date.now() - speedDoneAt.value < COOLDOWN_MS) return
    speed.value = { state: 'testing', down: null, up: null, ping: null }
    liveMbps.value = '0.0'
    trackPct.value = 0
    const msgs = STR[lang.value].speedMsgs
    let mi = 0
    statusMsg.value = msgs[0]
    if (speedMsgTimer) clearInterval(speedMsgTimer)
    speedMsgTimer = setInterval(() => {
      mi++
      statusMsg.value = msgs[mi % msgs.length]
    }, 1300)

    const ping = await measurePing()
    const down = await measureDown((mbps, el, max) => {
      liveMbps.value = mbps.toFixed(1)
      trackPct.value = Math.min(100, (el / max) * 100)
    })
    const up = await measureUp()
    if (speedMsgTimer) clearInterval(speedMsgTimer)

    const doneAt = Date.now()
    try {
      localStorage.setItem(
        'ippollo-speed',
        JSON.stringify({ down, up, ping, ts: doneAt }),
      )
    } catch {
      /* noop */
    }
    speed.value = { state: 'done', down, up, ping }
    speedDoneAt.value = doneAt
    startCooldown()
  }

  // ---- save card (canvas → 1080² PNG) ----
  async function saveCard() {
    const per = CLUCKS_PER_EGG
    const base = computeRating(ip.value || '0', lang.value)
    const eggs = Math.min(5, base.eggs + Math.floor(clucks.value / per))
    const W = 1080
    const H = 1080
    const c = document.createElement('canvas')
    c.width = W
    c.height = H
    const ctx = c.getContext('2d')
    if (!ctx) return
    try {
      await document.fonts.ready
    } catch {
      /* noop */
    }

    const g = ctx.createLinearGradient(0, 0, W, H)
    g.addColorStop(0, '#FFC02E')
    g.addColorStop(1, '#FF4B2B')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
    ctx.strokeStyle = '#3A2410'
    ctx.lineWidth = 20
    ctx.strokeRect(34, 34, W - 68, H - 68)
    ctx.textAlign = 'center'

    ctx.font = '300px serif'
    ctx.textBaseline = 'middle'
    ctx.fillText('🐔', W / 2, 250)

    ctx.fillStyle = '#ffffff'
    ctx.font = "700 36px 'Fredoka', sans-serif"
    ctx.shadowColor = 'rgba(0,0,0,0.3)'
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    ctx.fillText(
      (STR[lang.value].yourIp || 'YOUR IP, POLLO').toUpperCase(),
      W / 2,
      420,
    )

    ctx.font = "700 84px 'Space Mono', monospace"
    ctx.shadowOffsetX = 4
    ctx.shadowOffsetY = 4
    const ipStr = ip.value || '—'
    if (ctx.measureText(ipStr).width > W - 140)
      ctx.font = "700 56px 'Space Mono', monospace"
    ctx.fillText(ipStr, W / 2, 510)
    ctx.shadowColor = 'transparent'
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    ctx.font = '70px serif'
    const egW = 78
    const startX = W / 2 - (egW * 5) / 2 + egW / 2
    for (let i = 0; i < 5; i++) {
      ctx.globalAlpha = i < eggs ? 1 : 0.28
      ctx.fillText('🥚', startX + i * egW, 640)
    }
    ctx.globalAlpha = 1

    const pillW = 720
    const pillH = 150
    const pillX = (W - pillW) / 2
    const pillY = 710
    ctx.fillStyle = '#ffffff'
    if (ctx.roundRect) {
      ctx.beginPath()
      ctx.roundRect(pillX, pillY, pillW, pillH, 28)
      ctx.fill()
    } else {
      ctx.fillRect(pillX, pillY, pillW, pillH)
    }
    ctx.strokeStyle = '#3A2410'
    ctx.lineWidth = 6
    if (ctx.roundRect) ctx.stroke()
    ctx.fillStyle = '#3A2410'
    ctx.font = "700 52px 'Bungee', 'Fredoka', sans-serif"
    ctx.fillText(eggs + ' / 5', W / 2, pillY + 54)
    ctx.font = "600 32px 'Fredoka', sans-serif"
    ctx.fillText(base.title, W / 2, pillY + 106)

    ctx.fillStyle = '#ffffff'
    ctx.font = "500 26px 'Space Mono', monospace"
    ctx.fillText(base.breed, W / 2, 910)

    ctx.font = "400 40px 'Bungee', sans-serif"
    ctx.fillStyle = 'rgba(255,255,255,0.92)'
    ctx.fillText('ippollo.com', W / 2, 1000)

    const trigger = (blob: Blob | null) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'my-ippollo-card.png'
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 2000)
    }
    if (c.toBlob) c.toBlob(trigger, 'image/png')
    else trigger(null)
    spawnConfetti()
  }

  // ---- init (componentDidMount equivalent) — client only ----
  function init() {
    if (!import.meta.client || inited) return
    inited = true

    let l: Lang = 'en'
    try {
      const saved = localStorage.getItem('ippollo-lang')
      if (saved === 'en' || saved === 'es') l = saved
      else if ((navigator.language || '').toLowerCase().startsWith('es')) l = 'es'
    } catch {
      /* noop */
    }
    lang.value = l

    try {
      dark.value = localStorage.getItem('ippollo-dark') === '1'
    } catch {
      /* noop */
    }

    let c: Consent = 'unknown'
    try {
      const stored = localStorage.getItem('ippollo-consent')
      if (stored === 'granted' || stored === 'denied') c = stored
    } catch {
      /* noop */
    }
    consent.value = c
    if (c === 'granted' && window.__loadGA__) window.__loadGA__()

    try {
      const ck = parseInt(localStorage.getItem('ippollo-clucks') || '', 10)
      if (!isNaN(ck) && ck > 0) clucks.value = ck
    } catch {
      /* noop */
    }

    try {
      const sp = JSON.parse(localStorage.getItem('ippollo-speed') || 'null')
      if (sp && typeof sp.ts === 'number') {
        speed.value = { state: 'done', down: sp.down, up: sp.up, ping: sp.ping }
        speedDoneAt.value = sp.ts
      }
    } catch {
      /* noop */
    }

    const ua = navigator.userAgent || ''
    let b = 'Unknown'
    if (/Edg\//.test(ua)) b = 'Edge'
    else if (/OPR\/|Opera/.test(ua)) b = 'Opera'
    else if (/Chrome\//.test(ua)) b = 'Chrome'
    else if (/Firefox\//.test(ua)) b = 'Firefox'
    else if (/Safari\//.test(ua)) b = 'Safari'
    let os = 'Unknown'
    if (/Windows/.test(ua)) os = 'Windows'
    else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS'
    else if (/Mac OS X/.test(ua)) os = 'macOS'
    else if (/Android/.test(ua)) os = 'Android'
    else if (/Linux/.test(ua)) os = 'Linux'
    const mobile = /Mobi|Android|iPhone|iPad|iPod/.test(ua)
    browserName.value = b
    osName.value = os
    deviceType.value = mobile ? '📱 Mobile bird' : '🖥️ Desktop bird'

    factIndex.value = Math.floor(Math.random() * FACTS.en.length)
    if (typeof location !== 'undefined' && location.hash === '#privacy')
      showPrivacy.value = true

    if (speedDoneAt.value && Date.now() - speedDoneAt.value < COOLDOWN_MS)
      startCooldown()

    fetchIp()
  }

  function dispose() {
    if (cooldownTimer) clearInterval(cooldownTimer)
    if (speedMsgTimer) clearInterval(speedMsgTimer)
  }

  return {
    // state
    lang,
    dark,
    ip,
    isp,
    flag,
    browserName,
    osName,
    deviceType,
    loading,
    isDemo,
    clucks,
    showBubble,
    bubbleText,
    copied,
    bragged,
    speed,
    liveMbps,
    trackPct,
    statusMsg,
    consent,
    showPrivacy,
    // computed
    t,
    rating,
    ratingEggs,
    ratingProgress,
    locationText,
    fact,
    langLabel,
    darkLabel,
    downText,
    upText,
    pingText,
    speedTier,
    copyLabel,
    bragLabel,
    cooling,
    speedCountdownLabel,
    privacySections,
    // actions
    init,
    dispose,
    toggleLang,
    toggleDark,
    fetchIp,
    reactToChicken,
    copyIp,
    rerollFact,
    copyBrag,
    runSpeedTest,
    acceptConsent,
    declineConsent,
    reopenConsent,
    openPrivacy,
    closePrivacy,
    saveCard,
    spawnConfetti,
  }
}
