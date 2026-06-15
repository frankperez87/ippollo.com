<script setup lang="ts">
const { t, fact, rerollFact } = usePollo()
</script>

<template>
  <div
    class="mt-[18px] flex flex-wrap items-start gap-4 rounded-[18px] border-[3px] border-ink bg-card p-[22px] shadow-[6px_6px_0_var(--ink)]"
  >
    <div class="text-[42px] leading-none">🔮</div>
    <div class="min-w-[200px] flex-1">
      <div class="font-body text-[12px] font-bold uppercase tracking-[1.5px] text-sub">
        {{ t.factTitle }}
      </div>
      <div class="mt-[6px] font-body text-[19px] font-medium leading-[1.35] text-ink [text-wrap:pretty]">
        {{ fact }}
      </div>
    </div>
    <button
      type="button"
      class="cursor-pointer whitespace-nowrap rounded-[12px] bg-ink px-5 py-[11px] font-body text-[15px] font-bold text-card"
      @click="rerollFact"
    >
      {{ t.cluckAgain }}
    </button>
  </div>
</template>
