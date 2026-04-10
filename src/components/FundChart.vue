<template>
  <div class="relative">
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-slate-900/60 z-10 rounded-lg">
      <span class="text-slate-400 text-sm">加载中...</span>
    </div>
    <div v-if="error" class="absolute inset-0 flex items-center justify-center z-10">
      <span class="text-red-400 text-sm">{{ error }}</span>
    </div>
    <div ref="chartEl" class="w-full" :style="{ height: chartHeight }"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { fetchFundNav, fetchEtfKline, isEtf, calcMA } from '@/composables/useFundData.js'

const props = defineProps({
  fund: { type: Object, default: null },
  maPeriods: { type: Array, default: () => [20, 60, 120] }
})

const chartEl = ref(null)
const loading = ref(false)
const error = ref('')
const chartHeight = ref('420px')

let chart = null

const MA_COLORS = {
  5: '#facc15',
  10: '#fb923c',
  20: '#34d399',
  60: '#60a5fa',
  120: '#f472b6',
  250: '#a78bfa'
}

onMounted(() => {
  chart = echarts.init(chartEl.value, 'dark')
  window.addEventListener('resize', onResize)
  if (props.fund) loadData()
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  chart?.dispose()
})

watch(() => props.fund, (val) => { if (val) loadData() })
watch(() => props.maPeriods, () => { if (props.fund) loadData() }, { deep: true })

function onResize() {
  chart?.resize()
}

async function loadData() {
  loading.value = true
  error.value = ''
  try {
    const code = props.fund.code
    if (isEtf(code)) {
      await renderKline(code)
    } else {
      await renderLine(code)
    }
  } catch (e) {
    error.value = e.message || '数据加载失败'
  } finally {
    loading.value = false
  }
}

async function renderLine(code) {
  const data = await fetchFundNav(code)
  const dates = data.map(d => d.date)
  const navs = data.map(d => d.nav)

  const series = [
    {
      name: '净值',
      type: 'line',
      data: navs,
      lineStyle: { width: 1.5, color: '#94a3b8' },
      symbol: 'none',
      smooth: false
    },
    ...props.maPeriods.map(p => ({
      name: `MA${p}`,
      type: 'line',
      data: calcMA(navs, p),
      lineStyle: { width: 1, color: MA_COLORS[p] ?? '#fff' },
      symbol: 'none',
      smooth: false
    }))
  ]

  chart.setOption(buildOption(dates, series, false), true)
}

async function renderKline(code) {
  const data = await fetchEtfKline(code)
  const dates = data.map(d => d.date)
  const closes = data.map(d => d.close)
  const ohlc = data.map(d => [d.open, d.close, d.low, d.high])

  const series = [
    {
      name: 'K线',
      type: 'candlestick',
      data: ohlc,
      itemStyle: {
        color: '#ef4444',
        color0: '#22c55e',
        borderColor: '#ef4444',
        borderColor0: '#22c55e'
      }
    },
    ...props.maPeriods.map(p => ({
      name: `MA${p}`,
      type: 'line',
      data: calcMA(closes, p),
      lineStyle: { width: 1, color: MA_COLORS[p] ?? '#fff' },
      symbol: 'none',
      smooth: false
    }))
  ]

  chart.setOption(buildOption(dates, series, true), true)
}

function buildOption(dates, series, isKline) {
  return {
    backgroundColor: 'transparent',
    animation: false,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      textStyle: { color: '#e2e8f0', fontSize: 12 }
    },
    legend: {
      data: series.map(s => s.name),
      textStyle: { color: '#94a3b8', fontSize: 11 },
      top: 4
    },
    grid: { left: 60, right: 16, top: 40, bottom: 60 },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#64748b', fontSize: 11 },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      scale: true,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#64748b', fontSize: 11 },
      splitLine: { lineStyle: { color: '#1e293b' } }
    },
    dataZoom: [
      { type: 'inside', start: isKline ? 60 : 0, end: 100 },
      {
        type: 'slider',
        start: isKline ? 60 : 0,
        end: 100,
        height: 24,
        bottom: 8,
        fillerColor: 'rgba(59,130,246,0.15)',
        borderColor: '#334155',
        textStyle: { color: '#64748b' }
      }
    ],
    series
  }
}
</script>
