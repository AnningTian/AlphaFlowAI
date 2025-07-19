import { promises as fs } from 'fs';
import path from 'path';

/**
 * 在 Vercel serverless 环境中查找 analysis_results 目录
 */
async function findAnalysisDir() {
  const possiblePaths = [
    path.join(process.cwd(), 'analysis_results'),
    path.join(process.cwd(), '..', 'analysis_results'),
    'analysis_results',
    '../analysis_results',
    './analysis_results'
  ];
  
  for (const testPath of possiblePaths) {
    try {
      await fs.access(testPath);
      console.log('Found analysis directory at:', testPath);
      return testPath;
    } catch {
      continue;
    }
  }
  
  console.error('Analysis directory not found. Tried paths:', possiblePaths);
  return null;
}

/**
 * 查找指定符号的最新分析文件
 */
async function findLatestAnalysisFile(symbol, analysisDir) {
  if (!analysisDir) {
    return null;
  }

  try {
    const files = await fs.readdir(analysisDir);
    console.log(`Files in analysis directory: ${files.join(', ')}`);
    
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
      .sort((a, b) => b.timestamp - a.timestamp);

    if (dateFiles.length > 0) {
      console.log(`Found date file for ${symbol}: ${dateFiles[0].filename}`);
      return dateFiles[0];
    }

    // 查找固定格式文件 {SYMBOL}_analysis.json
    const analysisFile = path.join(analysisDir, `${symbol}_analysis.json`);
    try {
      await fs.access(analysisFile);
      console.log(`Found analysis file for ${symbol}: ${symbol}_analysis.json`);
      return {
        filename: `${symbol}_analysis.json`,
        date: 'latest',
        timestamp: Date.now(),
        path: analysisFile
      };
    } catch {
      console.log(`No analysis file found for ${symbol}`);
      return null;
    }
  } catch (error) {
    console.error(`Error finding analysis file for ${symbol}:`, error);
    return null;
  }
}

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
    const debug = urlObject.searchParams.get('debug');
    
    const analysisDir = await findAnalysisDir();

    // Debug endpoint - 查看文件系统状态
    if (debug === 'true') {
      let files = [];
      let error = null;
      
      if (analysisDir) {
        try {
          files = await fs.readdir(analysisDir);
        } catch (err) {
          error = err.message;
        }
      }
      
      return res.status(200).json({
        debug: true,
        cwd: process.cwd(),
        analysisDir,
        files,
        error,
        timestamp: new Date().toISOString()
      });
    }

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

      const latestFile = await findLatestAnalysisFile(symbolUpper, analysisDir);
      
      if (latestFile) {
        try {
          const analysisData = await fs.readFile(latestFile.path, 'utf-8');
          const analysis = JSON.parse(analysisData);
          
          return res.status(200).json({
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
        // 返回占位符响应
        return res.status(200).json({
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
    }

    // 如果没有指定符号，返回所有分析的摘要
    const analyses = {};
    
    for (const sym of supportedSymbols) {
      const latestFile = await findLatestAnalysisFile(sym, analysisDir);
      
      if (latestFile) {
        try {
          const analysisData = await fs.readFile(latestFile.path, 'utf-8');
          const analysis = JSON.parse(analysisData);
          analyses[sym] = {
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
          console.error(`Error reading analysis file for ${sym}:`, fileError);
          analyses[sym] = {
            symbol: sym,
            status: 'error',
            final_recommendation: 'ERROR',
            confidence: 0,
            message: `Failed to read analysis file: ${fileError.message}`,
            source_file: latestFile.filename,
            file_date: latestFile.date
          };
        }
      } else {
        analyses[sym] = {
          symbol: sym,
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

  } catch (error) {
    console.error('Analysis API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
} 