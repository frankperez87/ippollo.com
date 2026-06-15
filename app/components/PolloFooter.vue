<script setup lang="ts">
const { t, openPrivacy, reopenConsent } = usePollo()
</script>

<template>
  <footer
    class="mx-auto mt-12 max-w-[640px] text-center font-mono text-[12px] leading-[1.7] text-sub"
  >
    <div>{{ t.footer1 }}</div>
    <div class="mt-2">{{ t.footer2 }}</div>
    <div class="mt-4 flex flex-wrap justify-center gap-5">
      <button
        type="button"
        class="cursor-pointer border-none bg-transparent p-0 font-mono text-[12px] text-sub underline"
        @click="openPrivacy"
      >
        {{ t.privLink }}
      </button>
      <button
        type="button"
        class="cursor-pointer border-none bg-transparent p-0 font-mono text-[12px] text-sub underline"
        @click="reopenConsent"
      >
        {{ t.cookieLink }}
      </button>
    </div>
  </footer>
</template>
