<script setup lang="ts">
const { t, ip, rating, bragLabel, copyBrag, saveCard } = usePollo()
</script>

<template>
  <div class="mt-[34px]">
    <div class="mb-[14px] text-center font-body text-[13px] font-bold uppercase tracking-[2px] text-sub">
      {{ t.brag }}
    </div>
    <div
      class="relative mx-auto max-w-[560px] overflow-hidden rounded-[22px] border-4 border-ink bg-[linear-gradient(135deg,var(--yolk),var(--comb))] p-7 text-center shadow-[9px_9px_0_var(--ink)]"
    >
      <div class="text-[64px] leading-none">🐔</div>
      <div
        class="mt-1 font-body text-[14px] font-bold uppercase tracking-[1px] text-white [text-shadow:2px_2px_0_rgba(0,0,0,0.35)]"
      >
        {{ t.yourIp }}
      </div>
      <div
        class="my-[2px] mb-[10px] break-all font-mono text-[clamp(26px,6vw,40px)] font-bold text-white [text-shadow:3px_3px_0_rgba(0,0,0,0.35)]"
      >
        {{ ip }}
      </div>
      <div class="inline-block rounded-[14px] border-[3px] border-[#3A2410] bg-white px-4 py-[10px]">
        <span class="font-display text-[16px] text-[#3A2410]">{{ rating.eggsText }}</span>
        <span class="ml-2 font-body text-[15px] font-semibold text-[#3A2410]">{{ rating.title }}</span>
      </div>
      <div class="mt-4 flex flex-wrap justify-center gap-[10px]">
        <button
          type="button"
          class="cursor-pointer rounded-[14px] border-[3px] border-white bg-[#3A2410] px-[22px] py-3 font-body text-[16px] font-bold text-white"
          @click="copyBrag"
        >
          {{ bragLabel }}
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-[14px] border-[3px] border-[#3A2410] bg-white px-[22px] py-3 font-body text-[16px] font-bold text-[#3A2410]"
          @click="saveCard"
        >
          {{ t.saveCard }}
        </button>
      </div>
      <div class="mt-[14px] font-display text-[13px] tracking-[1px] text-white/85">ippollo.com</div>
    </div>
  </div>
</template>
