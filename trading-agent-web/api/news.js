// Fallback新闻数据
const FALLBACK_NEWS = [
  {
    title: "Bitcoin Reaches New All-Time High Above $100K",
    url: "https://coindesk.com/markets/2024/12/bitcoin-ath",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: "CoinDesk",
    description: "Bitcoin surpasses $100,000 milestone amid institutional adoption surge"
  },
  {
    title: "Ethereum 2.0 Staking Rewards Hit Record High",
    url: "https://cointelegraph.com/news/ethereum-staking-rewards",
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    source: "Cointelegraph",
    description: "ETH staking yields reach 6.2% as network participation increases"
  },
  {
    title: "Solana Network Processes 1 Million Transactions in Single Day",
    url: "https://decrypt.co/solana-transaction-milestone",
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    source: "Decrypt",
    description: "SOL network demonstrates scalability with record transaction throughput"
  },
  {
    title: "Major DeFi Protocol Launches Cross-Chain Bridge",
    url: "https://theblock.co/defi-cross-chain-bridge",
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    source: "The Block",
    description: "New interoperability solution connects multiple blockchain networks"
  },
  {
    title: "Central Bank Digital Currency Pilots Expand Globally",
    url: "https://coindesk.com/policy/cbdc-global-expansion",
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    source: "CoinDesk",
    description: "Multiple countries advance CBDC testing and implementation phases"
  }
];

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
    const symbol = urlObject.searchParams.get('symbol');
    
    // 尝试从CryptoCompare API获取新闻
    try {
      const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=latest');
      
      if (response.ok) {
        const data = await response.json();
        if (data.Data && data.Data.length > 0) {
          const news = data.Data.slice(0, 10).map(item => ({
            title: item.title,
            url: item.url,
            publishedAt: new Date(item.published_on * 1000).toISOString(),
            source: item.source_info?.name || item.source || 'CryptoCompare',
            description: item.body?.substring(0, 200) + '...' || ''
          }));
          
          // 如果指定了特定币种，过滤相关新闻
          if (symbol) {
            const symbolKeywords = {
              'BTC': ['bitcoin', 'btc'],
              'ETH': ['ethereum', 'eth'],
              'SOL': ['solana', 'sol'],
              'BNB': ['binance', 'bnb']
            };
            
            const keywords = symbolKeywords[symbol.toUpperCase()] || [symbol.toLowerCase()];
            const filteredNews = news.filter(item => 
              keywords.some(keyword => 
                item.title.toLowerCase().includes(keyword) ||
                (item.description && item.description.toLowerCase().includes(keyword))
              )
            );
            
            // 如果过滤后没有新闻，返回所有新闻
            return res.status(200).json(filteredNews.length > 0 ? filteredNews : news);
          }
          
          return res.status(200).json(news);
        }
      }
    } catch (apiError) {
      console.log('CryptoCompare API not available:', apiError.message);
    }
    
    // 如果API不可用，返回fallback数据
    console.log('Using fallback news data');
    res.status(200).json(FALLBACK_NEWS);
    
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ 
      error: 'Failed to fetch news',
      fallback: FALLBACK_NEWS
    });
  }
} 