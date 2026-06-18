<script setup lang="ts">
const {
  t,
  speed,
  liveMbps,
  trackPct,
  statusMsg,
  downText,
  upText,
  pingText,
  loadedLatencyText,
  jitterText,
  speedTier,
  cooling,
  speedCountdownLabel,
  runSpeedTest,
} = usePollo()

const isIdle = computed(() => speed.value.state === 'idle')
const isTesting = computed(() => speed.value.state === 'testing')
const isDone = computed(() => speed.value.state === 'done')
</script>

<template>
  <div
    class="mt-[18px] rounded-[18px] border-[3px] border-ink bg-card p-[22px] shadow-[6px_6px_0_var(--ink)]"
  >
    <!-- header -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-[10px]">
        <span class="text-[30px]">🏁</span>
        <span class="font-body text-[13px] font-bold uppercase tracking-[1.5px] text-sub">
          {{ t.speedTitle }}
        </span>
      </div>
      <template v-if="isDone">
        <button
          v-if="!cooling"
          type="button"
          class="cursor-pointer rounded-[12px] bg-ink px-[18px] py-[9px] font-body text-[14px] font-bold text-card"
          @click="runSpeedTest"
        >
          {{ t.speedAgain }}
        </button>
        <div
          v-else
          class="cursor-not-allowed rounded-[12px] border-2 border-sub bg-bg2 px-4 py-2 font-mono text-[13px] font-bold text-sub opacity-[0.85]"
        >
          {{ speedCountdownLabel }}
        </div>
      </template>
    </div>

    <!-- idle -->
    <div v-if="isIdle" class="px-0 pb-1 pt-4 text-center">
      <div class="mb-4 font-body text-[17px] font-medium text-ink [text-wrap:pretty]">
        {{ t.speedHint }}
      </div>
      <button
        type="button"
        class="cursor-pointer rounded-[14px] border-[3px] border-ink bg-comb px-[30px] py-[14px] font-display text-[18px] tracking-[0.5px] text-white shadow-[5px_5px_0_var(--ink)]"
        @click="runSpeedTest"
      >
        {{ t.speedBtn }}
      </button>
    </div>

    <!-- testing -->
    <div v-else-if="isTesting" class="pb-1 pt-[18px]">
      <div class="mb-[14px] text-center">
        <span class="font-mono text-[clamp(40px,9vw,66px)] font-bold leading-none text-ink">
          {{ liveMbps }}
        </span>
        <span class="ml-[6px] font-body text-[20px] font-bold text-sub">Mbps</span>
      </div>
      <div
        class="relative h-[46px] overflow-hidden rounded-full border-[3px] border-ink bg-bg2"
      >
        <div
          class="absolute bottom-0 left-0 top-0 bg-yolk transition-[width] duration-200 ease-linear"
          :style="{ width: trackPct + '%' }"
        ></div>
        <span
          class="absolute left-0 top-1/2 z-[2] -translate-y-1/2 text-[34px] transition-[left] duration-200 ease-linear"
          :style="{ left: 'calc(' + trackPct + '% - 14px)' }"
        >
          <span class="inline-block" style="animation: pollo-sprint 0.28s linear infinite;">🐔</span>
        </span>
      </div>
      <div class="mt-3 text-center font-body text-[15px] font-semibold text-sub">
        {{ statusMsg }}
      </div>
    </div>

    <!-- done -->
    <div v-else-if="isDone" class="pt-[14px]">
      <div class="grid grid-cols-3 gap-3">
        <div class="rounded-[14px] border-[2.5px] border-ink bg-bg2 px-[6px] py-3 text-center">
          <div class="text-[20px]">⬇️</div>
          <div class="font-mono text-[clamp(20px,5vw,30px)] font-bold leading-[1.1] text-ink">
            {{ downText }}
          </div>
          <div class="font-body text-[11px] font-semibold uppercase tracking-[1px] text-sub">
            {{ t.dl }}
          </div>
        </div>
        <div class="rounded-[14px] border-[2.5px] border-ink bg-bg2 px-[6px] py-3 text-center">
          <div class="text-[20px]">⬆️</div>
          <div class="font-mono text-[clamp(20px,5vw,30px)] font-bold leading-[1.1] text-ink">
            {{ upText }}
          </div>
          <div class="font-body text-[11px] font-semibold uppercase tracking-[1px] text-sub">
            {{ t.ul }}
          </div>
        </div>
        <div class="rounded-[14px] border-[2.5px] border-ink bg-bg2 px-[6px] py-3 text-center">
          <div class="text-[20px]">📶</div>
          <div class="font-mono text-[clamp(20px,5vw,30px)] font-bold leading-[1.1] text-ink">
            {{ pingText }}
          </div>
          <div class="font-body text-[11px] font-semibold uppercase tracking-[1px] text-sub">
            {{ t.pingL }}
          </div>
        </div>
      </div>
      <div class="mt-3 grid grid-cols-2 gap-3">
        <div
          class="flex items-center justify-center gap-[7px] rounded-[12px] border-[2px] border-ink bg-bg2 px-2 py-[10px]"
        >
          <span class="text-[15px]">⏱️</span>
          <span class="font-mono text-[18px] font-bold leading-none text-ink">{{ loadedLatencyText }}</span>
          <span class="font-body text-[10px] font-semibold uppercase tracking-[0.5px] text-sub">{{ t.loadedL }}</span>
        </div>
        <div
          class="flex items-center justify-center gap-[7px] rounded-[12px] border-[2px] border-ink bg-bg2 px-2 py-[10px]"
        >
          <span class="text-[15px]">🪶</span>
          <span class="font-mono text-[18px] font-bold leading-none text-ink">{{ jitterText }}</span>
          <span class="font-body text-[10px] font-semibold uppercase tracking-[0.5px] text-sub">{{ t.jitterL }}</span>
        </div>
      </div>
      <div
        class="mt-[14px] flex items-center gap-[14px] rounded-[14px] border-[3px] border-ink bg-yolk px-4 py-[14px]"
      >
        <span class="text-[42px] leading-none">{{ speedTier.emoji }}</span>
        <div>
          <div class="font-body text-[19px] font-bold text-[#3A2410]">
            {{ speedTier.label }}
          </div>
          <div class="font-body text-[14px] font-medium text-[#3A2410] opacity-[0.82] [text-wrap:pretty]">
            {{ speedTier.sub }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
