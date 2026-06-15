<script setup lang="ts">
const { clucks, langLabel, darkLabel, toggleLang, toggleDark } = usePollo()
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div
      class="flex items-center gap-[9px] font-display text-[20px] tracking-[0.5px] text-ink"
    >
      <span class="text-[26px]">🐔</span><span>ip pollo</span>
    </div>

    <div class="flex items-center gap-[10px]">
      <div
        class="flex items-center gap-[7px] rounded-full border-[2.5px] border-ink bg-card px-[14px] py-[7px] font-body text-[14px] font-semibold text-ink shadow-[3px_3px_0_var(--ink)]"
      >
        <span>🥚</span><span>{{ clucks }}</span>
      </div>

      <button
        type="button"
        :aria-label="'Switch language to ' + langLabel"
        class="cursor-pointer rounded-full border-[2.5px] border-ink bg-yolk px-[14px] py-[7px] font-body text-[14px] font-bold text-ink shadow-[3px_3px_0_var(--ink)]"
        @click="toggleLang"
      >
        {{ langLabel }}
      </button>

      <button
        type="button"
        aria-label="Toggle dark mode"
        class="grid h-10 w-10 cursor-pointer place-items-center rounded-full border-[2.5px] border-ink bg-card text-[17px] leading-none shadow-[3px_3px_0_var(--ink)]"
        @click="toggleDark"
      >
        {{ darkLabel }}
      </button>
    </div>
  </div>
</template>
