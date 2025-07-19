// 硬编码的真实 BTC 分析数据（来自 BTC_2025-07-19.json）
const REAL_ANALYSIS_DATA = {
  BTC: {
    "symbol": "BTC",
    "analysis_date": "2025-07-19",
    "timestamp": "2025-07-19T05:29:41.437716",
    "status": "completed",
    "final_recommendation": "BUY",
    "confidence": 75,
    "progress": {
      "analyst_team": {
        "market_analyst": {
          "status": "completed",
          "progress": 100
        },
        "social_analyst": {
          "status": "completed",
          "progress": 100
        },
        "news_analyst": {
          "status": "completed",
          "progress": 100
        },
        "fundamentals_analyst": {
          "status": "completed",
          "progress": 100
        }
      },
      "research_team": {
        "bull_researcher": {
          "status": "completed",
          "progress": 100
        },
        "bear_researcher": {
          "status": "completed",
          "progress": 100
        }
      },
      "research_manager": {
        "status": "completed",
        "progress": 100
      }
    },
    "messages_and_tools": [
      {
        "time": "05:32:14",
        "type": "Analysis",
        "content": "Market Analyst completed comprehensive analysis for BTC"
      },
      {
        "time": "05:32:14",
        "type": "Analysis",
        "content": "Social Analyst completed comprehensive analysis for BTC"
      },
      {
        "time": "05:32:14",
        "type": "Analysis",
        "content": "News Analyst completed comprehensive analysis for BTC"
      },
      {
        "time": "05:32:14",
        "type": "Analysis",
        "content": "Fundamentals Analyst completed comprehensive analysis for BTC"
      }
    ],
    "current_report": {
      "title": "BTC Technical Analysis Report (July 19, 2025)",
      "type": "Market Analysis",
      "overview": "Comprehensive technical and fundamental analysis for BTC conducted using multiple indicators and market data sources.",
      "indicators_selected": {
        "description": "Based on the latest data, the following technical indicators have been selected for their complementary insights:",
        "indicators": [],
        "summary": "These indicators provide a mix of trend identification, momentum measurement, and volatility assessment."
      },
      "trend_analysis": {}
    },
    "portfolio_management_decision": {
      "final_recommendation": "BUY",
      "summary_of_key_arguments": {
        "risky_analyst": {
          "stance": "Bullish",
          "key_points": [
            "time high of $122,197 recently achieved. What does this tell us? It suggests that the market is not only resilient but that Bitcoin has a short",
            "term bullish momentum evident through key technical indicators like the **10",
            "Day EMA trending upwards at $51.23 and the 200"
          ]
        },
        "safe_analyst": {
          "stance": "Bearish",
          "key_points": [
            "economic concerns that loom large over the cryptocurrency landscape. The recent announcement from the IMF regarding a reduced global growth forecast** and trade tensions can contribute to a risk",
            "does not negate the substantial risk inherent in such volatility. Just a few days after that peak, we saw a price drop to",
            "macro-economic concerns"
          ]
        },
        "neutral_analyst": {
          "stance": "Balanced",
          "key_points": [
            "edged sword; it's more akin to a minefield for investors lacking proper risk management. While short",
            "loss orders or diversification – might prove more sustainable than a pure buy",
            "hold or aggressive trading strategy."
          ]
        }
      },
      "rationale_and_decision_justification": "After considering the arguments presented by both the bull and bear analysts regarding Bitcoin (BTC), I lean towards a Sell recommendation. Here's a clear breakdown of the key points from both sides and the rationale for this decision. Bull Analyst's Key Points: 1. Growth Potential: Bitcoin's historical price peaks and the prediction from the Stock-to-Flow model indicate a potential price range of $400,000 to $1 million post the 2024 halving event. This suggests substantial long-term growth. 2. ..."
    },
    "tool_calls": 8,
    "llm_calls": 4,
    "generated_reports": 1,
    "analysis_duration": "2.6 minutes",
    "cost_estimate": "$0.001"
  },
  ETH: {
    "symbol": "ETH",
    "analysis_date": new Date().toISOString().split('T')[0],
    "timestamp": new Date().toISOString(),
    "status": "pending",
    "final_recommendation": "PENDING",
    "confidence": 0,
    "progress": {
      "analyst_team": {
        "market_analyst": {"status": "pending", "progress": 0},
        "social_analyst": {"status": "pending", "progress": 0},
        "news_analyst": {"status": "pending", "progress": 0},
        "fundamentals_analyst": {"status": "pending", "progress": 0}
      },
      "research_team": {
        "bull_researcher": {"status": "pending", "progress": 0},
        "bear_researcher": {"status": "pending", "progress": 0}
      },
      "research_manager": {"status": "pending", "progress": 0}
    },
    "current_report": {
      "title": "ETH Analysis - Pending",
      "type": "Market Analysis",
      "overview": "Analysis for ETH is currently being processed. Please check back later for detailed insights and recommendations."
    }
  },
  SOL: {
    "symbol": "SOL",
    "analysis_date": new Date().toISOString().split('T')[0],
    "timestamp": new Date().toISOString(),
    "status": "pending",
    "final_recommendation": "PENDING",
    "confidence": 0,
    "progress": {
      "analyst_team": {
        "market_analyst": {"status": "pending", "progress": 0},
        "social_analyst": {"status": "pending", "progress": 0},
        "news_analyst": {"status": "pending", "progress": 0},
        "fundamentals_analyst": {"status": "pending", "progress": 0}
      },
      "research_team": {
        "bull_researcher": {"status": "pending", "progress": 0},
        "bear_researcher": {"status": "pending", "progress": 0}
      },
      "research_manager": {"status": "pending", "progress": 0}
    },
    "current_report": {
      "title": "SOL Analysis - Pending",
      "type": "Market Analysis",
      "overview": "Analysis for SOL is currently being processed. Please check back later for detailed insights and recommendations."
    }
  },
  BNB: {
    "symbol": "BNB",
    "analysis_date": new Date().toISOString().split('T')[0],
    "timestamp": new Date().toISOString(),
    "status": "pending",
    "final_recommendation": "PENDING",
    "confidence": 0,
    "progress": {
      "analyst_team": {
        "market_analyst": {"status": "pending", "progress": 0},
        "social_analyst": {"status": "pending", "progress": 0},
        "news_analyst": {"status": "pending", "progress": 0},
        "fundamentals_analyst": {"status": "pending", "progress": 0}
      },
      "research_team": {
        "bull_researcher": {"status": "pending", "progress": 0},
        "bear_researcher": {"status": "pending", "progress": 0}
      },
      "research_manager": {"status": "pending", "progress": 0}
    },
    "current_report": {
      "title": "BNB Analysis - Pending", 
      "type": "Market Analysis",
      "overview": "Analysis for BNB is currently being processed. Please check back later for detailed insights and recommendations."
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

      const analysis = REAL_ANALYSIS_DATA[symbolUpper];
      if (analysis) {
        return res.status(200).json({
          success: true,
          data: analysis,
          symbol: symbolUpper,
          source_file: symbolUpper === 'BTC' ? 'BTC_2025-07-19.json' : null,
          analysis_date: analysis.analysis_date,
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
      const analysis = REAL_ANALYSIS_DATA[sym];
      if (analysis) {
        analyses[sym] = {
          symbol: analysis.symbol,
          status: analysis.status,
          final_recommendation: analysis.final_recommendation,
          confidence: analysis.confidence,
          analysis_date: analysis.analysis_date,
          timestamp: analysis.timestamp,
          source_file: sym === 'BTC' ? 'BTC_2025-07-19.json' : null
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