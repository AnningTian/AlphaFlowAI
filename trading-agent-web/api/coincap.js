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
    
    // 将 /api/coincap 替换为 CoinCap API 的实际路径
    const targetPath = urlObject.pathname.replace('/api/coincap', '/v2');
    const targetUrl = `https://api.coincap.io${targetPath}${urlObject.search}`;
    
    console.log('Proxying to CoinCap:', targetUrl);
    
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'User-Agent': 'TradingDashboard/1.0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`CoinCap API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('CoinCap proxy error:', error);
    res.status(500).json({
      error: 'Failed to fetch from CoinCap API',
      message: error.message
    });
  }
} 