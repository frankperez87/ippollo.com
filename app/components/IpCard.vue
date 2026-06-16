<script setup lang="ts">
const { t, loading, ip, isDemo, copyLabel, copyIp } = usePollo()
</script>

<template>
  <div
    class="mx-auto max-w-[680px] rounded-[22px] border-4 border-ink bg-card p-[clamp(20px,4vw,34px)] shadow-[9px_9px_0_var(--ink)]"
  >
    <div class="font-body text-[13px] font-bold uppercase tracking-[2px] text-sub">
      {{ t.yourIp }}
    </div>

    <div
      v-if="loading"
      class="pollo-ip-shimmer my-[10px] font-mono text-[clamp(34px,8vw,72px)] font-bold leading-none"
    >
      {{ t.clucking }}
    </div>
    <div
      v-else
      class="mb-[6px] mt-[10px] break-all font-mono text-[clamp(30px,7.5vw,68px)] font-bold leading-[1.05] text-ink"
    >
      {{ ip }}
    </div>

    <button
      type="button"
      class="mt-[6px] cursor-pointer rounded-[14px] border-[3px] border-ink bg-comb px-[26px] py-3 font-body text-[17px] font-bold text-white shadow-[5px_5px_0_var(--ink)]"
      @click="copyIp"
    >
      {{ copyLabel }}
    </button>

    <div v-if="isDemo" class="mt-3 font-mono text-[12px] text-sub">
      {{ t.demoNote }}
    </div>
  </div>
</template>
