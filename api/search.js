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
  const { q } = req.query
  if (!q) return res.status(400).json({ error: 'missing query' })

  const url = `https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?callback=&m=1&key=${encodeURIComponent(q)}`
  try {
    const text = await get(url, { Referer: 'https://fund.eastmoney.com/' })
    res.setHeader('Content-Type', 'application/json')
    res.send(text)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
