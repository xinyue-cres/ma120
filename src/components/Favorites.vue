<template>
  <div class="bg-slate-800 rounded-lg p-3">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm text-slate-400">收藏</span>
      <div class="flex gap-2">
        <template v-if="selecting">
          <button
            @click="cancelSelect"
            class="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >取消</button>
          <button
            @click="confirmDelete"
            :disabled="selected.size === 0"
            class="text-xs text-red-400 hover:text-red-300 disabled:opacity-40 transition-colors"
          >确认删除({{ selected.size }})</button>
        </template>
        <button
          v-else-if="favorites.length > 0"
          @click="selecting = true"
          class="text-xs text-slate-400 hover:text-red-400 transition-colors"
        >删除</button>
      </div>
    </div>

    <div v-if="favorites.length === 0" class="text-slate-500 text-sm text-center py-4">
      暂无收藏
    </div>
    <div
      v-for="fund in favorites"
      :key="fund.code"
      @click="onItemClick(fund)"
      class="flex items-center gap-2 py-2 border-b border-slate-700 last:border-0 cursor-pointer"
      :class="selecting ? 'hover:bg-slate-700/50' : 'hover:text-blue-400'"
    >
      <input
        v-if="selecting"
        type="checkbox"
        :checked="selected.has(fund.code)"
        @click.stop
        @change="toggleSelect(fund.code)"
        class="accent-blue-500 shrink-0"
      />
      <span class="font-mono text-blue-400 text-sm w-16 shrink-0">{{ fund.code }}</span>
      <span class="text-sm truncate">{{ fund.name }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useFavorites } from '@/composables/useFavorites.js'

const emit = defineEmits(['select'])
const { favorites, removeMany } = useFavorites()

const selecting = ref(false)
const selected = reactive(new Set())

function toggleSelect(code) {
  if (selected.has(code)) selected.delete(code)
  else selected.add(code)
}

function cancelSelect() {
  selecting.value = false
  selected.clear()
}

function confirmDelete() {
  if (selected.size === 0) return
  removeMany([...selected])
  cancelSelect()
}

function onItemClick(fund) {
  if (selecting.value) {
    toggleSelect(fund.code)
  } else {
    emit('select', fund)
  }
}
</script>
