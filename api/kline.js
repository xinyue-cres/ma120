import https from 'https'

function get(url, headers) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(data))
    }).on('error', reject)
  })
}

export default async function handler(req, res) {
  const { code, period = 'daily', count = 500 } = req.query
  if (!code) return res.status(400).json({ error: 'missing code' })

  const market = code.startsWith('5') ? 1 : 0
  const secid = `${market}.${code}`
  const klt = period === 'weekly' ? 102 : period === 'monthly' ? 103 : 101
  const url = `https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=${secid}&fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&klt=${klt}&fqt=1&end=20500101&lmt=${count}`

  try {
    const text = await get(url, { Referer: 'https://finance.eastmoney.com/' })
    res.setHeader('Content-Type', 'application/json')
    res.send(text)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
