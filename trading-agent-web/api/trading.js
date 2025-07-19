import { promises as fs } from 'fs';
import path from 'path';

// 支持的交易符号
const supportedSymbols = ['BTC', 'ETH', 'SOL', 'BNB'];

// Sample trading data
const sampleData = {
  symbols: supportedSymbols,
  prices: {
    BTC: { price: 45000, change: 2.5 },
    ETH: { price: 3200, change: -1.2 },
    SOL: { price: 180, change: 5.8 },
    BNB: { price: 580, change: 1.8 }
  }
};

/**
 * 查找指定符号的最新分析文件
 */
async function findLatestAnalysisFile(symbol, analysisDir) {
  try {
    const files = await fs.readdir(analysisDir);
    
    // 查找所有匹配的日期文件
    const dateFiles = files
      .filter(file => {
        const regex = new RegExp(`^${symbol}_(\\d{4}-\\d{2}-\\d{2})\\.json$`);
        return regex.test(file);
      })
      .map(file => {
        const match = file.match(new RegExp(`^${symbol}_(\\d{4}-\\d{2}-\\d{2})\\.json$`));
        if (match) {
          return {
            filename: file,
            date: match[1],
            timestamp: new Date(match[1]).getTime(),
            path: path.join(analysisDir, file)
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => b.timestamp - a.timestamp);

    if (dateFiles.length > 0) {
      return dateFiles[0];
    }

    // 查找固定格式文件
    const analysisFile = path.join(analysisDir, `${symbol}_analysis.json`);
    try {
      await fs.access(analysisFile);
      return {
        filename: `${symbol}_analysis.json`,
        date: 'latest',
        timestamp: Date.now(),
        path: analysisFile
      };
    } catch {
      return null;
    }
  } catch (error) {
    console.error(`Error finding analysis file for ${symbol}:`, error);
    return null;
  }
}

export default async function handler(req, res) {
  const { url, method } = req;
  const urlPath = new URL(url, `http://${req.headers.host}`).pathname;
  
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 路由处理
    if (urlPath === '/api/trading/symbols') {
      return res.status(200).json({
        success: true,
        data: supportedSymbols,
        message: 'Supported cryptocurrency symbols'
      });
    }
    
    if (urlPath === '/api/trading/prices') {
      return res.status(200).json({
        success: true,
        data: sampleData.prices,
        message: 'Sample price data'
      });
    }
    
    if (urlPath === '/api/trading/health') {
      return res.status(200).json({
        success: true,
        message: 'Trading service is healthy',
        timestamp: new Date().toISOString(),
        supportedSymbols: supportedSymbols
      });
    }

    // 处理所有分析查询
    if (urlPath === '/api/trading/analysis') {
      const analysisDir = path.join(process.cwd(), 'analysis_results');
      const analyses = {};
      
      for (const symbol of supportedSymbols) {
        const latestFile = await findLatestAnalysisFile(symbol, analysisDir);
        
        if (latestFile) {
          try {
            const analysisData = await fs.readFile(latestFile.path, 'utf-8');
            const analysis = JSON.parse(analysisData);
            analyses[symbol] = {
              symbol: analysis.symbol,
              status: analysis.status,
              final_recommendation: analysis.final_recommendation,
              confidence: analysis.confidence,
              analysis_date: analysis.analysis_date,
              timestamp: analysis.timestamp,
              source_file: latestFile.filename,
              file_date: latestFile.date
            };
          } catch (fileError) {
            analyses[symbol] = {
              symbol: symbol,
              status: 'error',
              final_recommendation: 'ERROR',
              confidence: 0,
              message: `Failed to read analysis file: ${fileError.message}`,
              source_file: latestFile.filename,
              file_date: latestFile.date
            };
          }
        } else {
          analyses[symbol] = {
            symbol: symbol,
            status: 'pending',
            final_recommendation: 'PENDING',
            confidence: 0,
            analysis_date: new Date().toISOString().split('T')[0],
            message: 'Analysis not yet available',
            source_file: null,
            file_date: null
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
    }

    // 处理特定符号分析
    const analysisMatch = urlPath.match(/^\/api\/trading\/analysis\/(.+)$/);
    if (analysisMatch) {
      const symbol = analysisMatch[1].toUpperCase();
      
      if (!supportedSymbols.includes(symbol)) {
        return res.status(404).json({
          success: false,
          error: 'Symbol not supported',
          message: `${symbol} is not in supported symbols: ${supportedSymbols.join(', ')}`
        });
      }

      const analysisDir = path.join(process.cwd(), 'analysis_results');
      const latestFile = await findLatestAnalysisFile(symbol, analysisDir);
      
      if (latestFile) {
        try {
          const analysisData = await fs.readFile(latestFile.path, 'utf-8');
          const analysis = JSON.parse(analysisData);
          
          return res.status(200).json({
            success: true,
            data: analysis,
            symbol: symbol,
            source_file: latestFile.filename,
            analysis_date: latestFile.date,
            message: `Analysis loaded successfully from ${latestFile.filename}`
          });
        } catch (fileError) {
          return res.status(500).json({
            success: false,
            error: 'Failed to read analysis file',
            message: `Could not read ${latestFile.filename}: ${fileError.message}`
          });
        }
      } else {
        // 返回占位符响应
        return res.status(200).json({
          success: true,
          data: {
            symbol: symbol,
            status: 'pending',
            message: 'Analysis not yet available for this symbol',
            final_recommendation: 'PENDING',
            confidence: 0,
            analysis_date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString(),
            current_report: {
              title: `${symbol} Analysis - Pending`,
              type: "Market Analysis",
              overview: `Analysis for ${symbol} is currently being processed. Please check back later for detailed insights and recommendations.`
            },
            progress: {
              analyst_team: {
                market_analyst: {"status": "pending", "progress": 0},
                social_analyst: {"status": "pending", "progress": 0},
                news_analyst: {"status": "pending", "progress": 0},
                fundamentals_analyst: {"status": "pending", "progress": 0}
              },
              research_team: {
                bull_researcher: {"status": "pending", "progress": 0},
                bear_researcher: {"status": "pending", "progress": 0}
              },
              research_manager: {"status": "pending", "progress": 0}
            }
          },
          symbol: symbol,
          source_file: null,
          analysis_date: null,
          message: `No analysis file found for ${symbol}. Supported files: ${symbol}_YYYY-MM-DD.json or ${symbol}_analysis.json`
        });
      }
    }

    // 404 for unknown routes
    return res.status(404).json({
      success: false,
      error: 'Not found',
      message: 'Trading API endpoint not found'
    });

  } catch (error) {
    console.error('Trading API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
} 