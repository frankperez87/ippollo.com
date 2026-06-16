<script setup lang="ts">
const pollo = usePollo()
const { dark, lang } = pollo

// Reactive <html> attributes: dark-mode class + active language.
useHead({
  htmlAttrs: {
    lang: () => lang.value,
    class: () => (dark.value ? 'dark' : ''),
  },
})

// Absolute URLs for social cards (override origin at generate time with NUXT_PUBLIC_SITE_URL).
const base = (useRuntimeConfig().public.siteUrl as string).replace(/\/+$/, '')
const ogImage = `${base}/assets/og-image.png`

useSeoMeta({
  description:
    "What's your IP, pollo? Instantly see your IP address, location, ISP and a deeply unscientific chicken rating. Plus a real speed test.",
  ogType: 'website',
  ogUrl: `${base}/`,
  ogTitle: "IP Pollo — What's your IP, pollo? 🐔",
  ogDescription:
    'See your IP, location, ISP and your official chicken rating. Cluck to level up. Run a speed test. Pure poultry chaos.',
  ogImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
  twitterTitle: "IP Pollo — What's your IP, pollo? 🐔",
  twitterDescription:
    'See your IP, location, ISP and your official chicken rating. Cluck to level up.',
  twitterImage: ogImage,
})

onMounted(() => pollo.init())
onBeforeUnmount(() => pollo.dispose())
</script>

<template>
  <div class="relative min-h-screen">
    <FloatingDecor />

    <div class="relative z-[2] mx-auto max-w-[980px] px-5 pb-[70px] pt-[22px]">
      <PolloHeader />

      <div class="mt-[18px] text-center">
        <HeroSection />
        <IpCard />
      </div>

      <StatsGrid />
      <FortuneCard />
      <SpeedTest />
      <CliCard />
      <BragCard />
      <PolloFooter />
    </div>

    <ConsentBanner />
    <PrivacyModal />
  </div>
</template>
