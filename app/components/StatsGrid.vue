<script setup lang="ts">
const {
  t,
  flag,
  locationText,
  regionText,
  coordsText,
  mapsUrl,
  timezone,
  isp,
  asn,
  browserName,
  osName,
  deviceType,
  rating,
  ratingEggs,
  ratingProgress,
} = usePollo()
</script>

<template>
  <div
    class="mt-[34px] grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4"
  >
    <!-- Location -->
    <div class="rounded-[18px] border-[3px] border-ink bg-card p-5 shadow-[6px_6px_0_var(--ink)]">
      <div class="text-[28px]">📍</div>
      <div class="mt-[6px] font-body text-[12px] font-bold uppercase tracking-[1.5px] text-sub">
        {{ t.location }}
      </div>
      <div class="mt-[3px] font-body text-[20px] font-semibold text-ink">
        {{ flag }} {{ locationText }}
      </div>
    </div>

    <!-- Region + postal -->
    <div
      v-if="regionText"
      class="rounded-[18px] border-[3px] border-ink bg-card p-5 shadow-[6px_6px_0_var(--ink)]"
    >
      <div class="text-[28px]">🗺️</div>
      <div class="mt-[6px] font-body text-[12px] font-bold uppercase tracking-[1.5px] text-sub">
        {{ t.region }}
      </div>
      <div class="mt-[3px] font-body text-[20px] font-semibold text-ink">
        {{ regionText }}
      </div>
    </div>

    <!-- Coordinates -->
    <div
      v-if="coordsText"
      class="rounded-[18px] border-[3px] border-ink bg-card p-5 shadow-[6px_6px_0_var(--ink)]"
    >
      <div class="text-[28px]">🧭</div>
      <div class="mt-[6px] font-body text-[12px] font-bold uppercase tracking-[1.5px] text-sub">
        {{ t.coords }}
      </div>
      <a
        :href="mapsUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-[3px] inline-block font-mono text-[18px] font-semibold text-ink underline decoration-dotted underline-offset-4"
      >
        {{ coordsText }}
      </a>
    </div>

    <!-- Time zone -->
    <div
      v-if="timezone"
      class="rounded-[18px] border-[3px] border-ink bg-card p-5 shadow-[6px_6px_0_var(--ink)]"
    >
      <div class="text-[28px]">🕐</div>
      <div class="mt-[6px] font-body text-[12px] font-bold uppercase tracking-[1.5px] text-sub">
        {{ t.timezone }}
      </div>
      <div class="mt-[3px] font-mono text-[18px] font-semibold text-ink">
        {{ timezone }}
      </div>
    </div>

    <!-- ISP -->
    <div class="rounded-[18px] border-[3px] border-ink bg-card p-5 shadow-[6px_6px_0_var(--ink)]">
      <div class="text-[28px]">🛰️</div>
      <div class="mt-[6px] font-body text-[12px] font-bold uppercase tracking-[1.5px] text-sub">
        {{ t.isp }}
      </div>
      <div class="mt-[3px] font-body text-[20px] font-semibold text-ink">
        {{ isp }}
      </div>
      <div v-if="asn" class="mt-1 font-mono text-[12px] text-sub">{{ asn }}</div>
    </div>

    <!-- Device -->
    <div class="rounded-[18px] border-[3px] border-ink bg-card p-5 shadow-[6px_6px_0_var(--ink)]">
      <div class="text-[28px]">🖥️</div>
      <div class="mt-[6px] font-body text-[12px] font-bold uppercase tracking-[1.5px] text-sub">
        {{ t.device }}
      </div>
      <div class="mt-[3px] font-body text-[20px] font-semibold text-ink">
        {{ browserName }} · {{ osName }}
      </div>
      <div class="mt-1 font-mono text-[12px] text-sub">{{ deviceType }}</div>
    </div>

    <!-- Chicken Rating (always on the yellow yolk card → fixed dark ink color) -->
    <div class="rounded-[18px] border-[3px] border-ink bg-yolk p-5 shadow-[6px_6px_0_var(--ink)]">
      <div class="flex items-center justify-between">
        <div class="font-body text-[12px] font-bold uppercase tracking-[1.5px] text-[#3A2410]">
          {{ t.rating }}
        </div>
        <div class="font-display text-[18px] text-[#3A2410]">{{ rating.eggsText }}</div>
      </div>

      <div class="mt-2 flex gap-1">
        <span
          v-for="(egg, i) in ratingEggs"
          :key="i"
          class="text-[clamp(26px,6vw,36px)] leading-none"
          :style="{ opacity: egg.op, filter: egg.fil }"
        >🥚</span>
      </div>

      <div class="mt-[10px] font-body text-[18px] font-bold text-[#3A2410]">
        {{ rating.title }}
      </div>
      <div class="mt-[2px] font-mono text-[12px] text-[#3A2410] opacity-[0.72]">
        {{ rating.breed }}
      </div>
      <div class="mt-[9px] font-body text-[12px] font-bold text-[#3A2410] opacity-[0.85]">
        {{ ratingProgress }}
      </div>

      <span
        v-if="rating.freeRange"
        class="mt-[9px] inline-block rounded-full bg-[#3A2410] px-[10px] py-1 font-body text-[11px] font-bold uppercase tracking-[1px] text-[#FFF3D6]"
      >
        {{ t.freeRange }}
      </span>
    </div>
  </div>
</template>
