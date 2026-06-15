<script setup lang="ts">
const { t, showPrivacy, privacySections, closePrivacy } = usePollo()
</script>

<template>
  <div
    v-if="showPrivacy"
    class="fixed inset-0 z-[9500] flex items-start justify-center overflow-y-auto bg-[rgba(20,12,4,0.62)] px-4 py-6"
    @click="closePrivacy"
  >
    <div
      class="m-auto w-full max-w-[640px] rounded-[22px] border-4 border-ink bg-card px-[26px] pb-[30px] pt-[26px] shadow-[9px_9px_0_var(--ink)]"
      @click.stop
    >
      <div class="mb-[6px] flex items-center justify-between gap-3">
        <div class="flex items-center gap-[10px]">
          <span class="text-[30px]">🔒</span>
          <span class="font-display text-[clamp(18px,4vw,24px)] text-ink">{{ t.privTitle }}</span>
        </div>
        <button
          type="button"
          aria-label="Close"
          class="grid h-[34px] w-[34px] flex-shrink-0 cursor-pointer place-items-center rounded-full border-none bg-ink font-body text-[15px] font-bold text-card"
          @click="closePrivacy"
        >
          ✕
        </button>
      </div>
      <div class="mb-[18px] font-mono text-[12px] text-sub">{{ t.privUpdated }}</div>

      <div v-for="(sec, i) in privacySections" :key="i" class="mb-4">
        <div class="mb-1 font-body text-[16px] font-bold text-ink">{{ sec.h }}</div>
        <div class="font-body text-[14.5px] font-medium leading-[1.55] text-ink opacity-90 [text-wrap:pretty]">
          {{ sec.b }}
        </div>
      </div>

      <button
        type="button"
        class="mt-[6px] cursor-pointer rounded-[14px] border-[3px] border-ink bg-comb px-[22px] py-[11px] font-body text-[15px] font-bold text-white shadow-[4px_4px_0_var(--ink)]"
        @click="closePrivacy"
      >
        {{ t.privClose }}
      </button>
    </div>
  </div>
</template>
