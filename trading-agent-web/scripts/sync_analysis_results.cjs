#!/usr/bin/env node
/**
 * TradingAgents 分析结果同步脚本
 * 
 * 这个脚本将TradingAgents生成的分析结果文件从原始格式 {SYMBOL}_{DATE}.json
 * 同步到前端期望的格式 {SYMBOL}_analysis.json
 * 
 * 使用方法:
 * node scripts/sync_analysis_results.cjs
 * node scripts/sync_analysis_results.cjs --symbol BTC
 * node scripts/sync_analysis_results.cjs --watch
 */

const fs = require('fs').promises;
const path = require('path');
const { existsSync, watch } = require('fs');

// 配置
const CONFIG = {
  // TradingAgents结果目录
  SOURCE_DIR: path.join(__dirname, '../../TradingAgents/results'),
  // Web项目分析结果目录
  TARGET_DIR: path.join(__dirname, '../analysis_results'),
  // 支持的货币符号
  SUPPORTED_SYMBOLS: ['BTC', 'ETH', 'SOL', 'BNB'],
  // 日志级别
  LOG_LEVEL: 'info' // 'debug', 'info', 'warn', 'error'
};

// 日志工具
const logger = {
  debug: (...args) => CONFIG.LOG_LEVEL === 'debug' && console.log('🔍 [DEBUG]', ...args),
  info: (...args) => ['debug', 'info'].includes(CONFIG.LOG_LEVEL) && console.log('ℹ️  [INFO]', ...args),
  warn: (...args) => ['debug', 'info', 'warn'].includes(CONFIG.LOG_LEVEL) && console.warn('⚠️  [WARN]', ...args),
  error: (...args) => console.error('❌ [ERROR]', ...args),
  success: (...args) => console.log('✅ [SUCCESS]', ...args)
};

/**
 * 确保目录存在
 */
async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch (error) {
    logger.debug(`创建目录: ${dirPath}`);
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * 获取最新的分析文件
 */
async function getLatestAnalysisFile(symbol) {
  const sourceDir = CONFIG.SOURCE_DIR;
  
  try {
    const files = await fs.readdir(sourceDir);
    const symbolFiles = files
      .filter(file => file.startsWith(`${symbol}_`) && file.endsWith('.json'))
      .map(file => {
        const match = file.match(/^(.+)_(\d{4}-\d{2}-\d{2})\.json$/);
        if (match) {
          const [, fileSymbol, dateStr] = match;
          return {
            filename: file,
            symbol: fileSymbol,
            date: dateStr,
            timestamp: new Date(dateStr).getTime(),
            path: path.join(sourceDir, file)
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => b.timestamp - a.timestamp); // 按日期降序排列

    return symbolFiles.length > 0 ? symbolFiles[0] : null;
  } catch (error) {
    logger.debug(`读取源目录失败 ${sourceDir}:`, error.message);
    return null;
  }
}

/**
 * 同步单个符号的分析结果
 */
async function syncSymbolAnalysis(symbol) {
  logger.debug(`开始同步 ${symbol} 的分析结果`);
  
  try {
    // 获取最新的分析文件
    const latestFile = await getLatestAnalysisFile(symbol);
    
    if (!latestFile) {
      logger.warn(`未找到 ${symbol} 的分析文件`);
      return { success: false, reason: 'no_file' };
    }

    logger.debug(`找到最新文件: ${latestFile.filename} (${latestFile.date})`);

    // 读取源文件内容
    const sourceContent = await fs.readFile(latestFile.path, 'utf-8');
    const analysisData = JSON.parse(sourceContent);

    // 验证数据格式
    if (!analysisData.symbol || !analysisData.final_recommendation) {
      logger.warn(`${symbol} 分析文件格式无效`);
      return { success: false, reason: 'invalid_format' };
    }

    // 确保目标目录存在
    await ensureDirectoryExists(CONFIG.TARGET_DIR);

    // 目标文件路径
    const targetPath = path.join(CONFIG.TARGET_DIR, `${symbol}_analysis.json`);

    // 检查是否需要更新
    let shouldUpdate = true;
    try {
      const existingContent = await fs.readFile(targetPath, 'utf-8');
      const existingData = JSON.parse(existingContent);
      
      // 比较时间戳
      if (existingData.timestamp && analysisData.timestamp) {
        const existingTime = new Date(existingData.timestamp).getTime();
        const newTime = new Date(analysisData.timestamp).getTime();
        
        if (newTime <= existingTime) {
          logger.debug(`${symbol} 分析结果已是最新版本`);
          shouldUpdate = false;
        }
      }
    } catch (error) {
      // 文件不存在或读取失败，需要创建
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      // 写入目标文件
      await fs.writeFile(targetPath, JSON.stringify(analysisData, null, 2), 'utf-8');
      logger.success(`${symbol} 分析结果已同步到: ${targetPath}`);
      
      return { 
        success: true, 
        sourceFile: latestFile.filename,
        targetFile: `${symbol}_analysis.json`,
        date: latestFile.date,
        recommendation: analysisData.final_recommendation,
        confidence: analysisData.confidence
      };
    } else {
      return { success: true, reason: 'already_latest' };
    }

  } catch (error) {
    logger.error(`同步 ${symbol} 分析结果失败:`, error.message);
    return { success: false, reason: 'error', error: error.message };
  }
}

/**
 * 同步所有支持的符号
 */
async function syncAllAnalyses() {
  logger.info('开始同步所有分析结果...');
  
  const results = {
    success: [],
    failed: [],
    skipped: []
  };

  for (const symbol of CONFIG.SUPPORTED_SYMBOLS) {
    const result = await syncSymbolAnalysis(symbol);
    
    if (result.success) {
      if (result.reason === 'already_latest') {
        results.skipped.push({ symbol, reason: result.reason });
      } else {
        results.success.push({ 
          symbol, 
          sourceFile: result.sourceFile,
          date: result.date,
          recommendation: result.recommendation,
          confidence: result.confidence
        });
      }
    } else {
      results.failed.push({ symbol, reason: result.reason, error: result.error });
    }
  }

  // 输出总结
  logger.info('\n📊 同步结果总结:');
  logger.info(`✅ 成功: ${results.success.length} 个`);
  logger.info(`⏭️  跳过: ${results.skipped.length} 个`);
  logger.info(`❌ 失败: ${results.failed.length} 个`);

  if (results.success.length > 0) {
    logger.info('\n成功同步的分析:');
    results.success.forEach(item => {
      logger.info(`  ${item.symbol}: ${item.recommendation} (${item.confidence}%) - ${item.date}`);
    });
  }

  if (results.failed.length > 0) {
    logger.info('\n失败的分析:');
    results.failed.forEach(item => {
      logger.warn(`  ${item.symbol}: ${item.reason} ${item.error ? `- ${item.error}` : ''}`);
    });
  }

  return results;
}

/**
 * 监听模式 - 实时同步
 */
async function watchMode() {
  logger.info('🔍 启动监听模式...');
  logger.info(`监听目录: ${CONFIG.SOURCE_DIR}`);
  
  if (!existsSync(CONFIG.SOURCE_DIR)) {
    logger.error(`源目录不存在: ${CONFIG.SOURCE_DIR}`);
    process.exit(1);
  }

  // 初始同步
  await syncAllAnalyses();

  // 开始监听
  const watcher = watch(CONFIG.SOURCE_DIR, { recursive: false }, async (eventType, filename) => {
    if (!filename || !filename.endsWith('.json')) {
      return;
    }

    logger.debug(`文件变化: ${eventType} - ${filename}`);

    // 解析文件名获取符号
    const match = filename.match(/^(.+)_\d{4}-\d{2}-\d{2}\.json$/);
    if (match) {
      const symbol = match[1];
      
      if (CONFIG.SUPPORTED_SYMBOLS.includes(symbol)) {
        logger.info(`检测到 ${symbol} 分析文件更新，开始同步...`);
        
        // 等待文件写入完成
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const result = await syncSymbolAnalysis(symbol);
        if (result.success && result.recommendation) {
          logger.success(`${symbol} 实时同步完成: ${result.recommendation} (${result.confidence}%)`);
        }
      }
    }
  });

  logger.info('监听已启动，按 Ctrl+C 退出');
  
  // 优雅退出
  process.on('SIGINT', () => {
    logger.info('\n正在停止监听...');
    watcher.close();
    process.exit(0);
  });
}

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(`
TradingAgents 分析结果同步工具

用法:
  node sync_analysis_results.cjs [选项]

选项:
  --symbol <SYMBOL>    同步指定货币的分析结果
  --watch             启动监听模式，实时同步新的分析结果
  --help              显示此帮助信息
  --debug             启用调试模式

示例:
  node sync_analysis_results.cjs                    # 同步所有分析结果
  node sync_analysis_results.cjs --symbol BTC       # 仅同步BTC
  node sync_analysis_results.cjs --watch            # 启动监听模式
  node sync_analysis_results.cjs --debug --watch    # 调试模式监听

支持的货币符号:
  ${CONFIG.SUPPORTED_SYMBOLS.join(', ')}

目录配置:
  源目录: ${CONFIG.SOURCE_DIR}
  目标目录: ${CONFIG.TARGET_DIR}
`);
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  
  // 解析命令行参数
  const options = {
    symbol: null,
    watch: false,
    help: false,
    debug: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--symbol':
      case '-s':
        options.symbol = args[++i]?.toUpperCase();
        break;
      case '--watch':
      case '-w':
        options.watch = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--debug':
        options.debug = true;
        CONFIG.LOG_LEVEL = 'debug';
        break;
    }
  }

  if (options.help) {
    showHelp();
    return;
  }

  logger.info('🚀 TradingAgents 分析结果同步工具');
  logger.debug('配置:', CONFIG);

  try {
    if (options.watch) {
      await watchMode();
    } else if (options.symbol) {
      if (!CONFIG.SUPPORTED_SYMBOLS.includes(options.symbol)) {
        logger.error(`不支持的货币符号: ${options.symbol}`);
        logger.info(`支持的符号: ${CONFIG.SUPPORTED_SYMBOLS.join(', ')}`);
        process.exit(1);
      }
      
      logger.info(`同步 ${options.symbol} 分析结果...`);
      const result = await syncSymbolAnalysis(options.symbol);
      
      if (result.success && result.recommendation) {
        logger.success(`${options.symbol} 同步完成: ${result.recommendation} (${result.confidence}%)`);
      } else if (result.success && result.reason === 'already_latest') {
        logger.info(`${options.symbol} 已是最新版本`);
      } else {
        logger.error(`${options.symbol} 同步失败: ${result.reason}`);
        process.exit(1);
      }
    } else {
      await syncAllAnalyses();
    }
  } catch (error) {
    logger.error('执行失败:', error.message);
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main().catch(error => {
    logger.error('未处理的错误:', error);
    process.exit(1);
  });
}

module.exports = {
  syncSymbolAnalysis,
  syncAllAnalyses,
  CONFIG
}; 