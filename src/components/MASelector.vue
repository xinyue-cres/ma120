<template>
  <div class="flex flex-wrap gap-2 items-center">
    <button
      v-for="p in periods"
      :key="p"
      @click="toggle(p)"
      :class="[
        'px-3 py-1 rounded text-xs font-mono transition-colors',
        selected.includes(p)
          ? 'bg-blue-600 text-white'
          : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
      ]"
    >
      MA{{ p }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
