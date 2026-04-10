<template>
  <div class="min-h-screen p-4 md:p-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-slate-200 mb-1">基金 MA</h1>
      <p class="text-xs text-slate-500">公募基金 / ETF 均线查看</p>
    </div>

    <!-- Search -->
    <div class="mb-4">
      <SearchBar @select="onFundSelect" />
    </div>

    <!-- Current fund info + favorite toggle -->
    <div v-if="currentFund" class="flex items-center gap-3 mb-3">
      <span class="font-mono text-blue-400 text-sm">{{ currentFund.code }}</span>
      <span class="text-sm text-slate-300">{{ currentFund.name }}</span>
      <span class="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
        {{ isEtf(currentFund.code) ? 'ETF' : '基金' }}
      </span>
      <button
        @click="toggleFavorite"
        :class="[
          'ml-auto text-sm px-3 py-1 rounded transition-colors',
          isFavorite(currentFund.code)
            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
        ]"
      >
        {{ isFavorite(currentFund.code) ? '★ 已收藏' : '☆ 收藏' }}
      </button>
    </div>

    <!-- MA selector -->
    <div class="mb-4">
      <MASelector v-model="maPeriods" />
    </div>

    <!-- Chart -->
    <div class="bg-slate-900 rounded-xl border border-slate-700 p-3 mb-6">
      <div v-if="!currentFund" class="flex items-center justify-center h-64 text-slate-500 text-sm">
        搜索或选择一只基金开始查看
      </div>
      <FundChart v-else :fund="currentFund" :ma-periods="maPeriods" />
    </div>

    <!-- Favorites -->
    <div>
      <h2 class="text-sm text-slate-400 mb-2">收藏</h2>
      <Favorites @select="onFundSelect" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import MASelector from '@/components/MASelector.vue'
import FundChart from '@/components/FundChart.vue'
import Favorites from '@/components/Favorites.vue'
import { useFavorites } from '@/composables/useFavorites.js'
import { isEtf } from '@/composables/useFundData.js'

const currentFund = ref(null)
const maPeriods = ref([20, 60, 120])
const { add, remove, isFavorite } = useFavorites()

function onFundSelect(fund) {
  currentFund.value = fund
}

function toggleFavorite() {
  if (!currentFund.value) return
  if (isFavorite(currentFund.value.code)) {
    remove(currentFund.value.code)
  } else {
    add(currentFund.value)
  }
}
</script>
