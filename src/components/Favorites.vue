<template>
  <div class="bg-slate-800 rounded-lg p-3">
    <div v-if="favorites.length === 0" class="text-slate-500 text-sm text-center py-4">
      暂无收藏
    </div>
    <div
      v-for="fund in favorites"
      :key="fund.code"
      class="flex items-center gap-2 py-2 border-b border-slate-700 last:border-0"
    >
      <button
        @click="$emit('select', fund)"
        class="flex-1 flex items-center gap-2 text-left hover:text-blue-400 transition-colors"
      >
        <span class="font-mono text-blue-400 text-sm w-16 shrink-0">{{ fund.code }}</span>
        <span class="text-sm truncate">{{ fund.name }}</span>
      </button>
      <button
        @click="remove(fund.code)"
        class="text-slate-500 hover:text-red-400 transition-colors text-lg leading-none"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup>
import { useFavorites } from '@/composables/useFavorites.js'

defineEmits(['select'])
const { favorites, remove } = useFavorites()
</script>
