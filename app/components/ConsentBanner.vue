<script setup lang="ts">
const { t, consent, openPrivacy, declineConsent, acceptConsent } = usePollo()
const showConsent = computed(() => consent.value === 'unknown')
</script>

<template>
  <div
    v-if="showConsent"
    class="fixed inset-x-[14px] bottom-[14px] z-[9000] mx-auto flex max-w-[760px] flex-wrap items-center gap-[14px] rounded-[18px] border-[3px] border-ink bg-card px-[18px] py-4 shadow-[6px_6px_0_var(--ink)]"
    style="animation: pollo-slidein 0.4s ease-out;"
  >
    <span class="text-[34px] leading-none">🍪</span>
    <div class="min-w-[230px] flex-1 font-body text-[14px] font-medium leading-[1.45] text-ink">
      <span>{{ t.consentText }}</span>
      <button
        type="button"
        class="cursor-pointer border-none bg-transparent pl-1 font-bold text-comb underline"
        @click="openPrivacy"
      >
        {{ t.consentLearn }}
      </button>
    </div>
    <div class="flex gap-2">
      <button
        type="button"
        class="cursor-pointer rounded-[12px] border-[2.5px] border-ink bg-transparent px-4 py-[10px] font-body text-[14px] font-bold text-ink"
        @click="declineConsent"
      >
        {{ t.consentNo }}
      </button>
      <button
        type="button"
        class="cursor-pointer rounded-[12px] border-[2.5px] border-ink bg-comb px-[18px] py-[10px] font-body text-[14px] font-bold text-white shadow-[3px_3px_0_var(--ink)]"
        @click="acceptConsent"
      >
        {{ t.consentYes }}
      </button>
    </div>
  </div>
</template>
