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
  <div class="mt-[34px] flex flex-wrap items-stretch gap-4">
    <!-- Pollo Dossier: the six factual readouts in one panel -->
    <div
      class="flex flex-[2.4_1_440px] flex-col overflow-hidden rounded-[20px] border-[3px] border-ink bg-card shadow-[6px_6px_0_var(--ink)] min-w-[300px]"
    >
      <div class="flex items-center gap-[10px] border-b-[3px] border-ink px-[22px] py-[15px]">
        <span class="text-[22px]">🗂️</span>
        <span class="font-display text-[clamp(15px,2.6vw,19px)] tracking-[0.5px] text-ink">
          {{ t.dossierTitle }}
        </span>
      </div>

      <div
        class="grid flex-1 grid-cols-[repeat(auto-fit,minmax(195px,1fr))] content-start gap-3 p-[14px]"
      >
        <!-- Location -->
        <div class="rounded-[14px] bg-bg px-4 py-[14px]">
          <div class="flex items-center gap-2">
            <span class="text-[18px]">📍</span>
            <span class="font-body text-[11px] font-bold uppercase tracking-[1.5px] text-sub">
              {{ t.location }}
            </span>
          </div>
          <div class="mt-[6px] font-body text-[18px] font-semibold leading-[1.2] text-ink">
            {{ flag }} {{ locationText }}
          </div>
        </div>

        <!-- Region + postal -->
        <div v-if="regionText" class="rounded-[14px] bg-bg px-4 py-[14px]">
          <div class="flex items-center gap-2">
            <span class="text-[18px]">🗺️</span>
            <span class="font-body text-[11px] font-bold uppercase tracking-[1.5px] text-sub">
              {{ t.region }}
            </span>
          </div>
          <div class="mt-[6px] font-body text-[18px] font-semibold leading-[1.2] text-ink">
            {{ regionText }}
          </div>
        </div>

        <!-- Coordinates -->
        <div v-if="coordsText" class="rounded-[14px] bg-bg px-4 py-[14px]">
          <div class="flex items-center gap-2">
            <span class="text-[18px]">🧭</span>
            <span class="font-body text-[11px] font-bold uppercase tracking-[1.5px] text-sub">
              {{ t.coords }}
            </span>
          </div>
          <a
            :href="mapsUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-[6px] inline-block font-mono text-[16px] font-semibold text-ink underline decoration-dotted underline-offset-4"
          >
            {{ coordsText }}
          </a>
        </div>

        <!-- Time zone -->
        <div v-if="timezone" class="rounded-[14px] bg-bg px-4 py-[14px]">
          <div class="flex items-center gap-2">
            <span class="text-[18px]">🕐</span>
            <span class="font-body text-[11px] font-bold uppercase tracking-[1.5px] text-sub">
              {{ t.timezone }}
            </span>
          </div>
          <div class="mt-[6px] font-mono text-[16px] font-semibold text-ink">
            {{ timezone }}
          </div>
        </div>

        <!-- ISP -->
        <div class="rounded-[14px] bg-bg px-4 py-[14px]">
          <div class="flex items-center gap-2">
            <span class="text-[18px]">🛰️</span>
            <span class="font-body text-[11px] font-bold uppercase tracking-[1.5px] text-sub">
              {{ t.isp }}
            </span>
          </div>
          <div class="mt-[6px] font-body text-[18px] font-semibold leading-[1.2] text-ink">
            {{ isp }}
          </div>
          <div v-if="asn" class="mt-1 font-mono text-[12px] text-sub">{{ asn }}</div>
        </div>

        <!-- Device -->
        <div class="rounded-[14px] bg-bg px-4 py-[14px]">
          <div class="flex items-center gap-2">
            <span class="text-[18px]">🖥️</span>
            <span class="font-body text-[11px] font-bold uppercase tracking-[1.5px] text-sub">
              {{ t.device }}
            </span>
          </div>
          <div class="mt-[6px] font-body text-[18px] font-semibold leading-[1.2] text-ink">
            {{ browserName }} · {{ osName }}
          </div>
          <div class="mt-1 font-mono text-[12px] text-sub">{{ deviceType }}</div>
        </div>
      </div>
    </div>

    <!-- Chicken Rating hero (yellow yolk card → fixed dark ink color) -->
    <div
      class="flex flex-[1_1_260px] flex-col justify-center rounded-[20px] border-[3px] border-ink bg-yolk p-6 shadow-[6px_6px_0_var(--ink)] min-w-[240px]"
    >
      <div class="flex items-center justify-between">
        <div class="font-body text-[12px] font-bold uppercase tracking-[1.5px] text-[#3A2410]">
          {{ t.rating }}
        </div>
        <div class="font-display text-[22px] text-[#3A2410]">{{ rating.eggsText }}</div>
      </div>

      <div class="mt-[14px] flex gap-[6px]">
        <span
          v-for="(egg, i) in ratingEggs"
          :key="i"
          class="text-[clamp(30px,7vw,42px)] leading-none"
          :style="{ opacity: egg.op, filter: egg.fil }"
        >🥚</span>
      </div>

      <div class="mt-4 font-display text-[clamp(20px,4vw,26px)] leading-[1.05] text-[#3A2410]">
        {{ rating.title }}
      </div>
      <div class="mt-[5px] font-mono text-[13px] text-[#3A2410] opacity-[0.72]">
        {{ rating.breed }}
      </div>
      <div class="mt-3 font-body text-[13px] font-bold text-[#3A2410] opacity-[0.85]">
        {{ ratingProgress }}
      </div>

      <span
        v-if="rating.freeRange"
        class="mt-[14px] inline-block self-start rounded-full bg-[#3A2410] px-3 py-[5px] font-body text-[11px] font-bold uppercase tracking-[1px] text-[#FFF3D6]"
      >
        {{ t.freeRange }}
      </span>
    </div>
  </div>
</template>
