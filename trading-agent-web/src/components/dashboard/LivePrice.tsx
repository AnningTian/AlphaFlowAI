import React, { useState, useEffect } from 'react';
import { fetchCryptoPrice } from '../../services/cryptoApi';

interface LivePriceProps {
  crypto: string;
}

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  last_updated: string;
}

const LivePrice: React.FC<LivePriceProps> = ({ crypto }) => {
  const [price, setPrice] = useState<number | null>(null);
  const [change24h, setChange24h] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 币种ID映射
  const cryptoIds = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    SOL: 'solana'
  };

  // 获取实时价格数据
  useEffect(() => {
    const fetchPrice = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchCryptoPrice(crypto);
        setPrice(data.usd);
        setChange24h(data.usd_24h_change);
      } catch (err) {
        console.error('Error fetching price:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load price data';
        setError(errorMessage);
        // 使用模拟数据作为后备
        const mockPrices = {
          BTC: { price: 45000, change: 2.5 },
          ETH: { price: 3200, change: -1.2 },
          SOL: { price: 95, change: 5.8 }
        };
        const mockData = mockPrices[crypto as keyof typeof mockPrices];
        setPrice(mockData.price);
        setChange24h(mockData.change);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();
    
    // 每120秒更新一次价格（进一步减少频率）
    const interval = setInterval(fetchPrice, 120000);
    
    return () => clearInterval(interval);
  }, [crypto]);

  if (isLoading) {
    return (
      <div className="live-price">
        <h3>Live Price</h3>
        <div className="price-loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="live-price">
        <h3>Live Price</h3>
        <div className="price-error">
          <div className="error-message">{error}</div>
          <div className="fallback-note">Showing fallback data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="live-price">
      <h3>Live Price</h3>
      <div className="price-info">
        <div className="current-price">
          <span className="currency">USD</span>
          <span className="amount">${price?.toLocaleString()}</span>
        </div>
        <div className={`price-change ${change24h >= 0 ? 'positive' : 'negative'}`}>
          <span className="change-amount">{change24h >= 0 ? '+' : ''}{change24h?.toFixed(2)}%</span>
          <span className="change-label">24h</span>
        </div>
      </div>
      <div className="crypto-info">
        <span className="crypto-symbol">{crypto}</span>
        <span className="last-updated">Last updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default LivePrice; 