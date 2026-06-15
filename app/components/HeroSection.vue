<script setup lang="ts">
const { t, showBubble, bubbleText, reactToChicken } = usePollo()

const chickenEl = ref<HTMLElement | null>(null)

function onCluck() {
  reactToChicken()
  const el = chickenEl.value
  if (el && el.animate) {
    el.animate(
      [
        { transform: 'scale(1) rotate(0deg)' },
        { transform: 'scale(1.22) rotate(-13deg)' },
        { transform: 'scale(1.12) rotate(11deg)' },
        { transform: 'scale(1) rotate(0deg)' },
      ],
      { duration: 520, easing: 'ease-out' },
    )
  }
}
</script>

<template>
  <div>
    <div
      class="inline-block"
      style="animation: pollo-drop 0.7s cubic-bezier(0.2, 0.8, 0.3, 1.2), pollo-bob 2.6s 0.7s ease-in-out infinite;"
    >
      <span
        ref="chickenEl"
        role="button"
        tabindex="0"
        aria-label="Cluck the chicken"
        class="inline-block cursor-pointer select-none leading-none text-[clamp(120px,24vw,210px)] [-webkit-tap-highlight-color:transparent] [filter:drop-shadow(6px_8px_0_rgba(0,0,0,0.18))]"
        @click="onCluck"
        @keydown.enter.prevent="onCluck"
        @keydown.space.prevent="onCluck"
      >🐔</span>
    </div>

    <div v-if="showBubble" class="-mt-[6px]">
      <span
        class="inline-block rounded-[14px] border-[3px] border-ink bg-comb px-[18px] py-2 font-display text-[clamp(20px,4vw,30px)] text-white shadow-[4px_4px_0_var(--ink)]"
        style="animation: pollo-pop 0.25s ease-out; transform: rotate(-3deg);"
      >{{ bubbleText }}</span>
    </div>

    <h1
      class="mt-[14px] mb-1 font-display text-[clamp(46px,11vw,118px)] leading-[0.92] tracking-[1px]"
    >
      <span class="text-ink">IP</span> <span class="text-comb">POLLO</span>
    </h1>
    <p class="mb-[26px] font-body text-[clamp(16px,3vw,22px)] font-semibold text-sub">
      {{ t.tagline }}
    </p>
  </div>
</template>
