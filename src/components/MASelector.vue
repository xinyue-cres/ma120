<template>
  <div class="flex flex-wrap gap-2 items-center">
    <button
      v-for="p in periods"
      :key="p"
      @click="toggle(p)"
      :style="selected.includes(p) ? { backgroundColor: MA_COLORS[p] + '33', color: MA_COLORS[p], borderColor: MA_COLORS[p] } : {}"
      :class="[
        'px-3 py-1 rounded text-xs font-mono transition-colors border',
        selected.includes(p) ? 'border-opacity-60' : 'bg-slate-700 text-slate-400 hover:bg-slate-600 border-transparent'
      ]"
    >
      MA{{ p }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MA_COLORS } from '@/composables/maColors.js'

const periods = [5, 10, 20, 60, 120, 250]
const selected = defineModel({ default: () => [20, 60, 120] })

function toggle(p) {
  const idx = selected.value.indexOf(p)
  if (idx === -1) {
    selected.value = [...selected.value, p].sort((a, b) => a - b)
  } else {
    selected.value = selected.value.filter(x => x !== p)
  }
}
</script>
