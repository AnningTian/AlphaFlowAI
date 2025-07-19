#!/usr/bin/env node
/**
 * 测试新的API逻辑
 * 验证是否能正确找到最新的分析文件
 */

const fs = require('fs').promises;
const path = require('path');

// 支持的交易符号
const supportedSymbols = ['BTC', 'ETH', 'SOL', 'BNB'];

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
      console.log(`✅ Found ${dateFiles.length} dated files for ${symbol}, using latest: ${dateFiles[0].filename}`);
      return dateFiles[0];
    }

    // 如果没有找到日期文件，查找固定格式文件
    const analysisFile = path.join(analysisDir, `${symbol}_analysis.json`);
    try {
      await fs.access(analysisFile);
      console.log(`✅ Using analysis file for ${symbol}: ${symbol}_analysis.json`);
      return {
        filename: `${symbol}_analysis.json`,
        date: 'latest',
        timestamp: Date.now(),
        path: analysisFile
      };
    } catch {
      // 文件不存在
      console.log(`❌ No analysis file found for ${symbol}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error finding analysis file for ${symbol}:`, error);
    return null;
  }
}

async function testAPI() {
  console.log('🧪 Testing new API logic...\n');
  
  const analysisDir = path.join(__dirname, 'analysis_results');
  
  console.log(`📁 Analysis directory: ${analysisDir}`);
  
  try {
    const files = await fs.readdir(analysisDir);
    console.log(`📋 Files in analysis directory: ${files.join(', ')}\n`);
  } catch (error) {
    console.error(`❌ Cannot read analysis directory: ${error.message}`);
    return;
  }
  
  console.log('🔍 Testing file discovery for each symbol:\n');
  
  for (const symbol of supportedSymbols) {
    console.log(`--- Testing ${symbol} ---`);
    const result = await findLatestAnalysisFile(symbol, analysisDir);
    
    if (result) {
      console.log(`📄 File: ${result.filename}`);
      console.log(`📅 Date: ${result.date}`);
      console.log(`📍 Path: ${result.path}`);
      
      // 验证文件是否可读
      try {
        const data = await fs.readFile(result.path, 'utf-8');
        const analysis = JSON.parse(data);
        console.log(`📊 Status: ${analysis.status || 'unknown'}`);
        console.log(`💡 Recommendation: ${analysis.final_recommendation || 'unknown'}`);
        console.log(`🎯 Confidence: ${analysis.confidence || 0}%`);
      } catch (error) {
        console.log(`❌ Cannot read file: ${error.message}`);
      }
    } else {
      console.log(`❌ No file found`);
    }
    console.log('');
  }
  
  console.log('🎉 API logic test completed!');
}

// 运行测试
testAPI().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
}); 