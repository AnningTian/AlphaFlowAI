# TradingAgents 分析结果同步工具

这个工具解决了TradingAgents生成的分析文件名格式与Web前端期望格式不匹配的问题。

## 📋 问题描述

- **TradingAgents生成格式**: `BTC_2024-01-15.json`
- **Web前端期望格式**: `BTC_analysis.json`

同步工具会自动找到最新的分析文件并复制到正确的文件名。

## 🚀 快速使用

### 方法一：使用npm脚本（推荐）
```bash
# 同步所有分析结果
npm run sync

# 同步指定货币（如BTC）
npm run sync:btc

# 启动监听模式（实时同步）
npm run sync:watch

# 查看帮助
npm run sync:help
```

### 方法二：直接运行脚本
```bash
# 进入trading-agent-web目录
cd trading-agent-web

# 同步所有分析结果
node scripts/sync_analysis_results.js

# 同步指定货币
node scripts/sync_analysis_results.js --symbol BTC

# 启动监听模式
node scripts/sync_analysis_results.js --watch

# 启用调试模式
node scripts/sync_analysis_results.js --debug --watch
```

## 📊 功能特点

### ✅ 智能同步
- 自动找到每个货币的最新分析文件
- 按日期排序，确保使用最新数据
- 避免重复同步相同的文件

### 🔍 实时监听
- 监听TradingAgents结果目录
- 检测到新文件时自动同步
- 适合长期运行的自动化场景

### 📝 详细日志
- 彩色日志输出，易于识别
- 支持不同日志级别（debug/info/warn/error）
- 显示同步结果统计

### 🎯 多货币支持
支持的货币符号：
- **加密货币**: BTC, ETH, SOL, ADA, DOT, AVAX, MATIC, LINK
- **股票**: NVDA, AAPL, TSLA

## 📁 目录结构

```
trading-agent-web/
├── scripts/
│   ├── sync_analysis_results.js    # 主同步脚本
│   └── README.md                   # 本文档
├── analysis_results/               # Web前端分析结果目录
│   ├── BTC_analysis.json          # 前端期望的格式
│   ├── ETH_analysis.json
│   └── ...
└── package.json                    # 包含同步脚本命令

TradingAgents/
└── results/                        # TradingAgents生成的结果
    ├── BTC_2024-01-15.json         # TradingAgents生成的格式
    ├── BTC_2024-01-16.json
    └── ...
```

## 🔧 配置选项

可以在脚本中修改 `CONFIG` 对象来调整配置：

```javascript
const CONFIG = {
  // TradingAgents结果目录
  SOURCE_DIR: path.join(__dirname, '../../TradingAgents/results'),
  
  // Web项目分析结果目录
  TARGET_DIR: path.join(__dirname, '../analysis_results'),
  
  // 支持的货币符号
  SUPPORTED_SYMBOLS: ['BTC', 'ETH', 'SOL', ...],
  
  // 日志级别
  LOG_LEVEL: 'info' // 'debug', 'info', 'warn', 'error'
};
```

## 🎯 使用场景

### 场景1：手动同步
运行TradingAgents分析后，手动同步结果：
```bash
npm run sync
```

### 场景2：实时自动化
启动监听模式，TradingAgents每次生成新分析时自动同步：
```bash
npm run sync:watch
```

### 场景3：单个货币
只同步特定货币的分析结果：
```bash
npm run sync:btc
# 或
node scripts/sync_analysis_results.js --symbol ETH
```

### 场景4：调试问题
启用详细日志来调试同步问题：
```bash
node scripts/sync_analysis_results.js --debug
```

## 📋 输出示例

### 成功同步
```
🚀 TradingAgents 分析结果同步工具
ℹ️  [INFO] 开始同步所有分析结果...
✅ [SUCCESS] BTC 分析结果已同步到: /path/to/analysis_results/BTC_analysis.json
✅ [SUCCESS] ETH 分析结果已同步到: /path/to/analysis_results/ETH_analysis.json

📊 同步结果总结:
ℹ️  [INFO] ✅ 成功: 2 个
ℹ️  [INFO] ⏭️  跳过: 0 个
ℹ️  [INFO] ❌ 失败: 0 个

成功同步的分析:
ℹ️  [INFO]   BTC: BUY (85%) - 2024-01-15
ℹ️  [INFO]   ETH: HOLD (72%) - 2024-01-15
```

### 监听模式
```
🔍 启动监听模式...
ℹ️  [INFO] 监听目录: /path/to/TradingAgents/results
ℹ️  [INFO] 监听已启动，按 Ctrl+C 退出

ℹ️  [INFO] 检测到 BTC 分析文件更新，开始同步...
✅ [SUCCESS] BTC 实时同步完成: BUY (88%)
```

## ❗ 注意事项

1. **目录路径**: 确保TradingAgents和trading-agent-web在同一父目录下
2. **文件格式**: 同步工具会验证JSON文件的基本格式
3. **权限问题**: 确保脚本有读写相关目录的权限
4. **时间戳比较**: 工具会比较文件时间戳避免重复同步

## 🐛 故障排除

### 问题1：找不到源目录
```
❌ [ERROR] 源目录不存在: /path/to/TradingAgents/results
```
**解决**：确保TradingAgents项目存在且已运行过分析

### 问题2：没有找到分析文件
```
⚠️  [WARN] 未找到 BTC 的分析文件
```
**解决**：运行TradingAgents生成对应货币的分析文件

### 问题3：权限错误
```
❌ [ERROR] 同步 BTC 分析结果失败: EACCES: permission denied
```
**解决**：检查目录权限或使用管理员权限运行

## 🔄 集成到工作流

可以将同步工具集成到你的工作流中：

### 1. 在TradingAgents脚本中调用
```python
# 在TradingAgents的run_analysis.py末尾添加
import subprocess
subprocess.run(['npm', 'run', 'sync'], cwd='../trading-agent-web')
```

### 2. 使用定时任务
```bash
# 每5分钟同步一次
*/5 * * * * cd /path/to/trading-agent-web && npm run sync
```

### 3. 在CI/CD中使用
```yaml
- name: Sync Analysis Results
  run: |
    cd trading-agent-web
    npm run sync
``` 