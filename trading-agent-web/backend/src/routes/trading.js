const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

// 支持的交易符号
const supportedSymbols = ['BTC', 'ETH', 'SOL', 'BNB'];

// Sample trading data (you can replace this with real data later)
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
 * 优先查找 {SYMBOL}_{DATE}.json 格式的文件，按日期排序取最新
 * 如果没找到，则查找 {SYMBOL}_analysis.json 格式
 */
async function findLatestAnalysisFile(symbol, analysisDir) {
  try {
    const files = await fs.readdir(analysisDir);
    
    // 查找所有匹配的日期文件 {SYMBOL}_{DATE}.json
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
      .sort((a, b) => b.timestamp - a.timestamp); // 按日期降序排列，最新的在前

    if (dateFiles.length > 0) {
      console.log(`Found ${dateFiles.length} dated files for ${symbol}, using latest: ${dateFiles[0].filename}`);
      return dateFiles[0];
    }

    // 如果没有找到日期文件，查找固定格式文件
    const analysisFile = path.join(analysisDir, `${symbol}_analysis.json`);
    try {
      await fs.access(analysisFile);
      console.log(`Using analysis file for ${symbol}: ${symbol}_analysis.json`);
      return {
        filename: `${symbol}_analysis.json`,
        date: 'latest',
        timestamp: Date.now(),
        path: analysisFile
      };
    } catch {
      // 文件不存在
      return null;
    }
  } catch (error) {
    console.error(`Error finding analysis file for ${symbol}:`, error);
    return null;
  }
}

// Get analysis result for a specific symbol
router.get('/analysis/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const symbolUpper = symbol.toUpperCase();
    
    if (!supportedSymbols.includes(symbolUpper)) {
      return res.status(404).json({
        success: false,
        error: 'Symbol not supported',
        message: `${symbolUpper} is not in supported symbols: ${supportedSymbols.join(', ')}`
      });
    }

    const analysisDir = path.join(__dirname, '../../../analysis_results');
    
    // 查找最新的分析文件
    const latestFile = await findLatestAnalysisFile(symbolUpper, analysisDir);
    
    if (latestFile) {
      try {
        const analysisData = await fs.readFile(latestFile.path, 'utf-8');
        const analysis = JSON.parse(analysisData);
        
        res.json({
          success: true,
          data: analysis,
          symbol: symbolUpper,
          source_file: latestFile.filename,
          analysis_date: latestFile.date,
          message: `Analysis loaded successfully from ${latestFile.filename}`
        });
      } catch (fileError) {
        console.error(`Error reading analysis file ${latestFile.filename}:`, fileError);
        return res.status(500).json({
          success: false,
          error: 'Failed to read analysis file',
          message: `Could not read ${latestFile.filename}: ${fileError.message}`
        });
      }
    } else {
      // 如果没有找到任何分析文件，返回占位符响应
      console.log(`No analysis file found for ${symbolUpper}, returning placeholder`);
      res.json({
        success: true,
        data: {
          symbol: symbolUpper,
          status: 'pending',
          message: 'Analysis not yet available for this symbol',
          final_recommendation: 'PENDING',
          confidence: 0,
          analysis_date: new Date().toISOString().split('T')[0],
          timestamp: new Date().toISOString(),
          current_report: {
            title: `${symbolUpper} Analysis - Pending`,
            type: "Market Analysis",
            overview: `Analysis for ${symbolUpper} is currently being processed. Please check back later for detailed insights and recommendations.`
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
        symbol: symbolUpper,
        source_file: null,
        analysis_date: null,
        message: `No analysis file found for ${symbolUpper}. Supported files: ${symbolUpper}_YYYY-MM-DD.json or ${symbolUpper}_analysis.json`
      });
    }
  } catch (error) {
    console.error(`Error fetching analysis for ${req.params.symbol}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analysis',
      message: error.message
    });
  }
});

// Get all available analyses
router.get('/analysis', async (req, res) => {
  try {
    const analysisDir = path.join(__dirname, '../../../analysis_results');
    const analyses = {};
    
    for (const symbol of supportedSymbols) {
      // 使用相同的逻辑查找最新文件
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
          console.error(`Error reading analysis file for ${symbol}:`, fileError);
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
    
    res.json({
      success: true,
      data: analyses,
      count: Object.keys(analyses).length,
      supported_symbols: supportedSymbols,
      message: 'All analyses loaded successfully'
    });
  } catch (error) {
    console.error('Error fetching all analyses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analyses',
      message: error.message
    });
  }
});

// Get supported symbols
router.get('/symbols', (req, res) => {
  res.json({
    success: true,
    data: supportedSymbols,
    message: 'Supported cryptocurrency symbols'
  });
});

// Get sample price data
router.get('/prices', (req, res) => {
  res.json({
    success: true,
    data: sampleData.prices,
    message: 'Sample price data'
  });
});

// Health check for trading service
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Trading service is healthy',
    timestamp: new Date().toISOString(),
    supportedSymbols: supportedSymbols
  });
});

module.exports = router; 