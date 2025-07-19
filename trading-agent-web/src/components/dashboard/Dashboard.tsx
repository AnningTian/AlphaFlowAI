import React, { useState, useEffect } from 'react';
import CryptoDropdown from './CryptoDropdown';
import TradingAnalysisPanel from './TradingAnalysisPanel';
import { fetchCryptoPrice, type CryptoPrice } from '../../services/cryptoApi';
import { fetchCryptoNews, formatTimeAgo, type NewsItem } from '../../services/newsApi';

interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  lastUpdated: string;
}

const Dashboard: React.FC = () => {
  const [selectedCrypto, setSelectedCrypto] = useState<string>('BTC');
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取价格数据
  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data: CryptoPrice = await fetchCryptoPrice(selectedCrypto);
        setPriceData({
          symbol: selectedCrypto,
          price: data.usd,
          change24h: data.usd_24h_change,
          lastUpdated: new Date().toLocaleTimeString()
        });
      } catch (err) {
        setError('Failed to fetch price data');
        // 设置fallback数据
        setPriceData({
          symbol: selectedCrypto,
          price: selectedCrypto === 'BTC' ? 118246 : 3572,
          change24h: -1.11,
          lastUpdated: new Date().toLocaleTimeString()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();
    const interval = setInterval(fetchPriceData, 30000); // 每30秒更新

    return () => clearInterval(interval);
  }, [selectedCrypto]);

  // 获取新闻数据
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setNewsLoading(true);
        const news = await fetchCryptoNews(selectedCrypto);
        setNewsItems(news);
      } catch (err) {
        console.error('Failed to fetch news:', err);
      } finally {
        setNewsLoading(false);
      }
    };

    fetchNews();
    // 每5分钟更新新闻
    const newsInterval = setInterval(fetchNews, 5 * 60 * 1000);

    return () => clearInterval(newsInterval);
  }, [selectedCrypto]);

  const handleNewsClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-layout">
        {/* 统一设计的融合工具栏 */}
        <div className="unified-toolbar">
          {/* 加密货币选择器 */}
          <div className="toolbar-section">
            <CryptoDropdown 
              selectedCrypto={selectedCrypto} 
              onCryptoChange={setSelectedCrypto} 
            />
          </div>
          
          {/* 当前价格 */}
          <div className="toolbar-section">
            <div className="section-label">Current Price</div>
            {loading ? (
              <div className="section-value loading">Loading...</div>
            ) : error ? (
              <div className="section-value error">API Error</div>
            ) : (
              <div className="section-value">${priceData?.price.toLocaleString()}</div>
            )}
            <div className="section-sublabel">USD</div>
          </div>
          
          {/* 24小时变化 */}
          <div className="toolbar-section">
            <div className="section-label">24h Change</div>
            {priceData && (
              <div className={`section-value ${priceData.change24h >= 0 ? 'positive' : 'negative'}`}>
                {priceData.change24h >= 0 ? '+' : ''}{priceData.change24h.toFixed(2)}%
              </div>
            )}
            <div className="section-sublabel">{priceData?.symbol}</div>
          </div>
          
          {/* 24小时交易量 */}
          <div className="toolbar-section">
            <div className="section-label">24h Volume</div>
            <div className="section-value">$2.4B</div>
            <div className="section-sublabel">Trading Volume</div>
          </div>
          
          {/* 市场市值 */}
          <div className="toolbar-section">
            <div className="section-label">Market Cap</div>
            <div className="section-value">$1.2T</div>
            <div className="section-sublabel">Total Value</div>
          </div>
          
          {/* 最后更新 */}
          <div className="toolbar-section">
            <div className="section-label">Last Updated</div>
            <div className="section-value">{priceData?.lastUpdated || '--:--:--'}</div>
            <div className="section-sublabel">Real-time</div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="dashboard-main-content">
          {/* 左侧区域 - TradingAgents分析面板 */}
          <div className="left-section">
            <TradingAnalysisPanel selectedSymbol={selectedCrypto} />
          </div>

          {/* 右侧区域 - 市场新闻 */}
          <div className="right-section">
            <div className="news-card">
              <div className="news-header">
                <h3>Market News</h3>
                {newsLoading && <div className="news-loading">Loading...</div>}
              </div>
              <div className="news-content">
                {newsItems.length > 0 ? (
                  newsItems.map((news, index) => (
                    <div 
                      key={index} 
                      className="news-item clickable"
                      onClick={() => handleNewsClick(news.url)}
                      title={news.description || news.title}
                    >
                      <div className="news-title">{news.title}</div>
                      <div className="news-meta">
                        <span className="news-source">{news.source}</span>
                        <span className="news-time">{formatTimeAgo(news.publishedAt)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  !newsLoading && (
                    <div className="news-item">
                      <div className="news-title">No news available</div>
                      <div className="news-time">Please try again later</div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 