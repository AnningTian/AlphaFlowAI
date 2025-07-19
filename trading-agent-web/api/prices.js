const samplePrices = {
  BTC: { price: 45000, change: 2.5 },
  ETH: { price: 3200, change: -1.2 },
  SOL: { price: 180, change: 5.8 },
  BNB: { price: 580, change: 1.8 }
};

export default function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.status(200).json({
    success: true,
    data: samplePrices,
    message: 'Sample price data'
  });
} 