// 嵌入的示例分析数据（避免文件系统问题）
const SAMPLE_ANALYSIS_DATA = {
  BTC: {
    symbol: "BTC",
    analysis_date: "2025-01-19",
    timestamp: new Date().toISOString(),
    status: "completed",
    final_recommendation: "BUY",
    confidence: 75,
    progress: {
      analyst_team: {
        market_analyst: {"status": "completed", "progress": 100},
        social_analyst: {"status": "completed", "progress": 100},
        news_analyst: {"status": "completed", "progress": 100},
        fundamentals_analyst: {"status": "completed", "progress": 100}
      },
      research_team: {
        bull_researcher: {"status": "completed", "progress": 100},
        bear_researcher: {"status": "completed", "progress": 100}
      },
      research_manager: {"status": "completed", "progress": 100}
    },
    current_report: {
      title: "BTC Market Analysis",
      type: "Comprehensive Trading Analysis",
      overview: "Bitcoin shows strong bullish momentum with institutional support and technical indicators pointing to continued upward trend. Risk management recommended with 10% position sizing.",
      key_findings: [
        "Strong institutional adoption continues",
        "Technical indicators show bullish momentum",
        "Market sentiment remains positive",
        "Regulatory environment stabilizing"
      ]
    }
  },
  ETH: {
    symbol: "ETH",
    analysis_date: "2025-01-19", 
    timestamp: new Date().toISOString(),
    status: "completed",
    final_recommendation: "HOLD",
    confidence: 65,
    progress: {
      analyst_team: {
        market_analyst: {"status": "completed", "progress": 100},
        social_analyst: {"status": "completed", "progress": 100},
        news_analyst: {"status": "completed", "progress": 100},
        fundamentals_analyst: {"status": "completed", "progress": 100}
      },
      research_team: {
        bull_researcher: {"status": "completed", "progress": 100},
        bear_researcher: {"status": "completed", "progress": 100}
      },
      research_manager: {"status": "completed", "progress": 100}
    },
    current_report: {
      title: "ETH Market Analysis",
      type: "Ethereum Trading Analysis",
      overview: "Ethereum maintains solid fundamentals with DeFi growth, but faces short-term consolidation. Recommended to hold existing positions.",
      key_findings: [
        "DeFi ecosystem continues expansion",
        "Network upgrades improving efficiency", 
        "Short-term price consolidation expected",
        "Long-term outlook remains positive"
      ]
    }
  },
  SOL: {
    symbol: "SOL",
    analysis_date: "2025-01-19",
    timestamp: new Date().toISOString(), 
    status: "completed",
    final_recommendation: "BUY",
    confidence: 70,
    progress: {
      analyst_team: {
        market_analyst: {"status": "completed", "progress": 100},
        social_analyst: {"status": "completed", "progress": 100},
        news_analyst: {"status": "completed", "progress": 100},
        fundamentals_analyst: {"status": "completed", "progress": 100}
      },
      research_team: {
        bull_researcher: {"status": "completed", "progress": 100},
        bear_researcher: {"status": "completed", "progress": 100}
      },
      research_manager: {"status": "completed", "progress": 100}
    },
    current_report: {
      title: "SOL Market Analysis",
      type: "Solana Trading Analysis", 
      overview: "Solana demonstrates strong technical performance and ecosystem growth. Network stability improvements support bullish outlook.",
      key_findings: [
        "High transaction throughput maintained",
        "Growing developer ecosystem",
        "Strong institutional interest",
        "Technical indicators show strength"
      ]
    }
  },
  BNB: {
    symbol: "BNB",
    analysis_date: "2025-01-19",
    timestamp: new Date().toISOString(),
    status: "completed", 
    final_recommendation: "HOLD",
    confidence: 60,
    progress: {
      analyst_team: {
        market_analyst: {"status": "completed", "progress": 100},
        social_analyst: {"status": "completed", "progress": 100}, 
        news_analyst: {"status": "completed", "progress": 100},
        fundamentals_analyst: {"status": "completed", "progress": 100}
      },
      research_team: {
        bull_researcher: {"status": "completed", "progress": 100},
        bear_researcher: {"status": "completed", "progress": 100}
      },
      research_manager: {"status": "completed", "progress": 100}
    },
    current_report: {
      title: "BNB Market Analysis",
      type: "Binance Coin Trading Analysis",
      overview: "BNB maintains utility value through Binance ecosystem, but faces regulatory uncertainties. Conservative hold recommended.",
      key_findings: [
        "Strong utility within Binance ecosystem",
        "Regular token burn mechanisms active",
        "Regulatory environment uncertain", 
        "Ecosystem expansion continues"
      ]
    }
  }
};

const supportedSymbols = ['BTC', 'ETH', 'SOL', 'BNB'];

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

    // 如果指定了符号，返回该符号的分析
    if (symbol) {
      const symbolUpper = symbol.toUpperCase();
      
      if (!supportedSymbols.includes(symbolUpper)) {
        return res.status(404).json({
          success: false,
          error: 'Symbol not supported',
          message: `${symbolUpper} is not in supported symbols: ${supportedSymbols.join(', ')}`
        });
      }

      const analysis = SAMPLE_ANALYSIS_DATA[symbolUpper];
      if (analysis) {
        return res.status(200).json({
          success: true,
          data: analysis,
          symbol: symbolUpper,
          message: `Analysis loaded successfully for ${symbolUpper}`
        });
      } else {
        return res.status(404).json({
          success: false,
          error: 'Analysis not found',
          message: `No analysis available for ${symbolUpper}`
        });
      }
    }

    // 如果没有指定符号，返回所有分析的摘要
    const analyses = {};
    for (const sym of supportedSymbols) {
      const analysis = SAMPLE_ANALYSIS_DATA[sym];
      if (analysis) {
        analyses[sym] = {
          symbol: analysis.symbol,
          status: analysis.status,
          final_recommendation: analysis.final_recommendation,
          confidence: analysis.confidence,
          analysis_date: analysis.analysis_date,
          timestamp: analysis.timestamp
        };
      }
    }
    
    return res.status(200).json({
      success: true,
      data: analyses,
      count: Object.keys(analyses).length,
      supported_symbols: supportedSymbols,
      message: 'All analyses loaded successfully'
    });

  } catch (error) {
    console.error('Analysis API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
} 