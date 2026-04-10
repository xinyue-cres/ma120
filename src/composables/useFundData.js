// Fetch regular fund historical NAV via Vercel proxy
// Returns: [{ date: '2024-01-01', nav: 1.234 }, ...]
export async function fetchFundNav(code) {
  const res = await fetch(`/api/nav?code=${code}`)
  if (!res.ok) throw new Error(`nav fetch failed: ${res.status}`)
  return res.json()
}

// Fetch ETF K-line data via Vercel proxy
// Returns: [{ date, open, close, low, high, volume }, ...]
export async function fetchEtfKline(code, count = 500) {
  const res = await fetch(`/api/kline?code=${code}&count=${count}`)
  if (!res.ok) throw new Error(`kline fetch failed: ${res.status}`)
  const json = await res.json()
  const klines = json?.data?.klines
  if (!klines) throw new Error('no kline data')
  return klines.map(line => {
    const [date, open, close, high, low, volume] = line.split(',')
    return {
      date,
      open: parseFloat(open),
      close: parseFloat(close),
      high: parseFloat(high),
      low: parseFloat(low),
      volume: parseFloat(volume)
    }
  })
}

// Search funds via Vercel proxy
// Returns: [{ code, name, type, pinyin }, ...]
export async function searchFunds(query) {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error('search failed')
  const json = await res.json()
  const list = json?.Datas ?? []
  return list.map(item => ({
    code: item.CODE,
    name: item.NAME,
    type: item.FundType,
    pinyin: item.SPELL
  }))
}

// Determine if a fund code is ETF
// ETF codes: 5xxxxx (SH) or 15xxxx (SZ)
export function isEtf(code) {
  return /^(5\d{5}|15\d{4})$/.test(code)
}

// Calculate MA series from price array
// prices: number[], period: number
// Returns: (number|null)[] — null for initial window
export function calcMA(prices, period) {
  return prices.map((_, i) => {
    if (i < period - 1) return null
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
    return parseFloat((sum / period).toFixed(4))
  })
}
