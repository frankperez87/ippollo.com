import tailwindcss from '@tailwindcss/vite'

// IP Pollo — fully static site (nuxt generate → .output/public), deployed to Netlify.
// Every dynamic feature (IP lookup, speed test, analytics) runs client-side; no server runtime.
export default defineNuxtConfig({
  compatibilityDate: '2025-06-14',
  ssr: true, // prerender a static HTML shell so OG/meta tags exist for crawlers, then hydrate
  devtools: { enabled: false },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  // Static generation: single route, no crawling needed.
  nitro: {
    // Pin the static preset. On Netlify, Nitro otherwise auto-detects the
    // `netlify-static` preset, which emits to `dist` instead of `.output/public`
    // and breaks the configured publish dir. Forcing `static` keeps the output
    // at `.output/public` everywhere (local and CI).
    preset: 'static',
    prerender: {
      crawlLinks: false,
      routes: ['/'],
    },
  },

  // Override at generate time with NUXT_PUBLIC_SITE_URL=https://your-preview.netlify.app
  // so the absolute og:image/og:url point at wherever the site actually lives.
  runtimeConfig: {
    public: {
      siteUrl: 'https://ippollo.com',
      gaId: 'G-ZDWDGMS0G6',
      // A-only subdomain (no AAAA) that runs the same edge function, so the
      // browser can fetch a guaranteed-IPv4 headline from `${ipv4Url}/ip`.
      // The lookup fails soft, so the app still works before this DNS exists.
      // Set NUXT_PUBLIC_IPV4_URL='' to disable and just show the connecting IP.
      ipv4Url: 'https://ipv4.ippollo.com',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: "IP Pollo — What's your IP, pollo? 🐔",
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Bungee&family=Fredoka:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap',
        },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/assets/favicon-32.png' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/assets/favicon.png' },
        { rel: 'apple-touch-icon', href: '/assets/apple-touch-icon.png' },
      ],
      script: [
        {
          // Google Analytics with Consent Mode v2 — denied until the visitor accepts.
          // gtag('config') is only called later by window.__loadGA__() on consent.
          tagPosition: 'head',
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            window.gtag = gtag;
            gtag('consent', 'default', {
              ad_storage: 'denied',
              analytics_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });
            window.__GA_ID__ = 'G-ZDWDGMS0G6';
            window.__loadGA__ = function(){
              gtag('consent', 'update', { analytics_storage: 'granted' });
              if (window.__gaLoaded__) return;
              if (!window.__GA_ID__ || window.__GA_ID__.indexOf('XXXX') !== -1) return;
              window.__gaLoaded__ = true;
              var s = document.createElement('script');
              s.async = true;
              s.src = 'https://www.googletagmanager.com/gtag/js?id=' + window.__GA_ID__;
              document.head.appendChild(s);
              gtag('js', new Date());
              gtag('config', window.__GA_ID__, { anonymize_ip: true });
            };
          `,
        },
      ],
    },
  },
})
