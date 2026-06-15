# IP Pollo 🐔

> What's your IP, pollo? — a static, absurd-maximalist parody of ipchicken.com.

Shows your public IP, rough location, ISP, device, a deeply unscientific **chicken rating**,
a real **speed test**, random pollo fortunes, a shareable brag card, EN/ES, dark mode, and
GDPR-friendly Google Analytics (Consent Mode v2). 100% static — no backend.

## Stack

- **Nuxt 4** — prerendered to a static site (`nuxt generate`).
- **Tailwind CSS v4** — via `@tailwindcss/vite`, CSS-first theme tokens in `app/assets/css/main.css`.
- **Netlify** — `netlify.toml` builds with `npm run generate`, publishes `.output/public`.

Every dynamic feature runs client-side: IP via a fallback chain of public APIs
(`ipwho.is` → `geojs.io` → `ipapi.co` → `ipify`, then a comedic demo IP), speed test via
`speed.cloudflare.com`. Nothing is stored server-side; preferences live in `localStorage`.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build (static)

```bash
npm run generate   # → .output/public  (deploy this folder)
npx serve .output/public   # preview the static output locally
```

## Configuration

- **Google Analytics** — Measurement ID `G-ZDWDGMS0G6`, wired in `nuxt.config.ts` behind
  Consent Mode v2. Loads only after the visitor accepts the cookie banner; IP is anonymized.
- **Social card URL** — `og:image`/`og:url` use `runtimeConfig.public.siteUrl`
  (default `https://ippollo.com`). The OG image needs an **absolute** URL, so if you deploy
  to a Netlify preview first, build with `NUXT_PUBLIC_SITE_URL=https://your-preview.netlify.app`
  or social previews won't render.

## Structure

```
app/
  app.vue                  # layout + <html> dark/lang binding + OG meta
  assets/css/main.css      # Tailwind import, theme tokens, dark palette, keyframes
  components/              # PolloHeader, HeroSection, IpCard, StatsGrid, FortuneCard,
                          #   SpeedTest, BragCard, PolloFooter, ConsentBanner, PrivacyModal, FloatingDecor
  composables/
    usePolloData.ts        # EN/ES strings, breeds, titles, facts, speed tiers, privacy copy
    usePollo.ts            # the store: IP lookup, rating, clucks, speed test, consent/GA, confetti, save-card
public/assets/            # favicon (32/512/apple-touch) + og-image (1200×630)
```
