<script setup lang="ts">
// Lazily-drifting barnyard emoji in the far background.
const decor = [
  { e: '🥚', style: 'left:4%; top:12%; font-size:54px; opacity:0.16; animation:pollo-float 7s ease-in-out infinite;' },
  { e: '🐔', style: 'right:6%; top:18%; font-size:72px; opacity:0.14; animation:pollo-float 9s ease-in-out infinite 0.6s;' },
  { e: '🍗', style: 'left:10%; top:62%; font-size:64px; opacity:0.12; animation:pollo-float 8s ease-in-out infinite 1.2s;' },
  { e: '🌽', style: 'right:9%; top:55%; font-size:48px; opacity:0.15; animation:pollo-float 6.5s ease-in-out infinite 0.3s;' },
  { e: '🥚', style: 'left:48%; top:80%; font-size:58px; opacity:0.1; animation:pollo-float 10s ease-in-out infinite 1.6s;' },
  { e: '⭐', style: 'right:40%; top:6%; font-size:40px; opacity:0.13; animation:pollo-float 7.5s ease-in-out infinite 0.9s;' },
]
</script>

<template>
  <div aria-hidden="true" class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
    <span
      v-for="(d, i) in decor"
      :key="i"
      class="absolute"
      :style="d.style"
    >{{ d.e }}</span>
  </div>
</template>
