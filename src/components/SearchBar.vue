<template>
  <div class="relative">
    <div class="flex gap-2">
      <input
        v-model="query"
        @input="onInput"
        @keydown.enter="onEnter"
        @keydown.escape="close"
        placeholder="输入基金代码或名称"
        class="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 placeholder-slate-500"
      />
      <button
        @click="onEnter"
        class="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
      >
        查询
      </button>
    </div>

    <!-- Dropdown results -->
    <div
      v-if="results.length && showDropdown"
      class="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg overflow-hidden z-50 shadow-xl"
    >
      <div
        v-for="item in results"
        :key="item.code"
        @click="select(item)"
        class="flex items-center gap-3 px-4 py-3 hover:bg-slate-700 cursor-pointer border-b border-slate-700 last:border-0"
      >
        <span class="text-blue-400 font-mono text-sm w-16 shrink-0">{{ item.code }}</span>
        <span class="text-sm truncate">{{ item.name }}</span>
        <span class="ml-auto text-xs text-slate-400 shrink-0">{{ item.type }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { searchFunds } from '@/composables/useFundData.js'

const emit = defineEmits(['select'])

const query = ref('')
const results = ref([])
const showDropdown = ref(false)
let debounceTimer = null

function onInput() {
  clearTimeout(debounceTimer)
  if (!query.value.trim()) {
    results.value = []
    return
  }
  debounceTimer = setTimeout(async () => {
    try {
      results.value = await searchFunds(query.value.trim())
      showDropdown.value = true
    } catch {
      results.value = []
    }
  }, 300)
}

function onEnter() {
  // If query looks like a fund code, select directly
  const code = query.value.trim()
  if (/^\d{6}$/.test(code)) {
    select({ code, name: code, type: '' })
    return
  }
  if (results.value.length) select(results.value[0])
}

function select(item) {
  emit('select', item)
  query.value = ''
  results.value = []
  showDropdown.value = false
}

function close() {
  showDropdown.value = false
}
</script>
