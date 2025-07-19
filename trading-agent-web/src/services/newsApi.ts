export interface NewsItem {
  title: string;
  url: string;
  publishedAt: string;
  source: string;
  description?: string;
  urlToImage?: string;
}

export interface NewsResponse {
  articles: NewsItem[];
  totalResults: number;
}

// 后端API基础URL
const API_BASE_URL = 'http://localhost:5000/api';

export const fetchCryptoNews = async (symbol?: string): Promise<NewsItem[]> => {
  try {
    // 调用后端新闻代理API
    const url = symbol 
      ? `${API_BASE_URL}/news?symbol=${encodeURIComponent(symbol)}`
      : `${API_BASE_URL}/news`;
    
    const response = await fetch(url);
    
    if (response.ok) {
      const news: NewsItem[] = await response.json();
      return news;
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

  } catch (error) {
    console.error('Error fetching crypto news:', error);
    
    // 如果后端不可用，返回客户端fallback数据
    return [
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
  }
};

export const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const publishedDate = new Date(dateString);
  const diffInMs = now.getTime() - publishedDate.getTime();
  
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return publishedDate.toLocaleDateString();
  }
}; 