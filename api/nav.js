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
  const { code } = req.query
  if (!code) return res.status(400).json({ error: 'missing code' })

  const url = `https://fund.eastmoney.com/pingzhongdata/${code}.js`
  try {
    const text = await get(url, { Referer: 'https://fund.eastmoney.com/' })
    const match = text.match(/Data_netWorthTrend\s*=\s*(\[[\s\S]*?\]);/)
    if (!match) return res.status(404).json({ error: 'no nav data' })
    const raw = JSON.parse(match[1])
    const data = raw.map(item => ({
      date: new Date(item.x).toISOString().slice(0, 10),
      nav: parseFloat(item.y)
    }))
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
