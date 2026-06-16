<script setup lang="ts">
import { CLI } from '~/composables/usePolloData'

const { t, lang, copyText } = usePollo()

// Base host shown in the examples (e.g. "ippollo.com"), derived from siteUrl.
const host = (useRuntimeConfig().public.siteUrl as string)
  .replace(/^https?:\/\//, '')
  .replace(/\/+$/, '')

const commands = computed(() =>
  CLI.map((c) => ({
    cmd: `curl ${c.host || host}${c.path}`,
    desc: lang.value === 'es' ? c.es : c.en,
  })),
)

const copiedIdx = ref(-1)
let copiedTimer: ReturnType<typeof setTimeout> | null = null

function copy(cmd: string, i: number) {
  copyText(cmd)
  copiedIdx.value = i
  if (copiedTimer) clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => (copiedIdx.value = -1), 1400)
}
</script>

<template>
  <div
    class="mt-[34px] rounded-[22px] border-4 border-ink bg-card p-[clamp(20px,4vw,30px)] shadow-[9px_9px_0_var(--ink)]"
  >
    <div class="font-display text-[clamp(20px,4vw,26px)] text-ink">
      🖥️ {{ t.cliTitle }}
    </div>
    <div class="mt-1 font-body text-[14px] text-sub">{{ t.cliHint }}</div>

    <div class="mt-4 grid gap-[10px]">
      <button
        v-for="(c, i) in commands"
        :key="i"
        type="button"
        class="group flex cursor-pointer items-center justify-between gap-3 rounded-[12px] border-2 border-ink bg-ink/[0.04] px-[14px] py-[10px] text-left transition hover:bg-ink/[0.08]"
        :title="c.desc"
        @click="copy(c.cmd, i)"
      >
        <code class="break-all font-mono text-[clamp(12px,2.6vw,15px)] text-ink">
          <span class="select-none text-sub">$ </span>{{ c.cmd }}
        </code>
        <span class="flex shrink-0 items-center gap-2">
          <span class="hidden font-mono text-[12px] text-sub sm:inline">{{ c.desc }}</span>
          <span
            class="rounded-md border-2 border-ink px-[8px] py-px font-body text-[11px] font-bold uppercase tracking-[1px]"
            :class="copiedIdx === i ? 'bg-comb text-white' : 'bg-card text-ink'"
          >
            {{ copiedIdx === i ? t.copied : '📋' }}
          </span>
        </span>
      </button>
    </div>
  </div>
</template>
