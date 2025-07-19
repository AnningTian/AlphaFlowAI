export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { url } = req;
    const urlObject = new URL(url, `http://${req.headers.host}`);
    
    // 将 /api/coingecko 替换为 CoinGecko API 的实际路径
    const targetPath = urlObject.pathname.replace('/api/coingecko', '/api/v3');
    const targetUrl = `https://api.coingecko.com${targetPath}${urlObject.search}`;
    
    console.log('Proxying to CoinGecko:', targetUrl);
    
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'User-Agent': 'TradingDashboard/1.0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('CoinGecko proxy error:', error);
    res.status(500).json({
      error: 'Failed to fetch from CoinGecko API',
      message: error.message
    });
  }
} 