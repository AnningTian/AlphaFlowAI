# Vercel 部署指南

## 部署步骤

### 1. 准备工作

确保您的项目已经推送到 Git 仓库（GitHub、GitLab 或 Bitbucket）。

### 2. 在 Vercel 上部署

1. 访问 [Vercel](https://vercel.com) 并登录
2. 点击 "New Project"
3. 导入您的 Git 仓库
4. 选择 `trading-agent-web` 文件夹作为根目录
5. Vercel 会自动检测这是一个 React + Vite 项目

### 3. 配置部署设置

在 Vercel 部署设置中：

- **Framework Preset**: Vite
- **Root Directory**: `trading-agent-web`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. 环境变量（如果需要）

如果您的应用需要环境变量，在 Vercel 项目设置的 Environment Variables 部分添加：

```bash
NODE_ENV=production
```

### 5. 部署

点击 "Deploy" 按钮开始部署。Vercel 会：

1. 克隆您的代码
2. 安装依赖 (`npm install`)
3. 构建前端应用 (`npm run build`)
4. 部署 serverless 函数到 `/api` 路由
5. 提供生产环境 URL

## API 路由

部署后，以下 API 端点将可用：

- `GET /api/health` - 健康检查
- `GET /api/trading/symbols` - 支持的交易符号
- `GET /api/trading/prices` - 价格数据
- `GET /api/trading/analysis` - 所有分析数据
- `GET /api/trading/analysis/:symbol` - 特定符号分析
- `GET /api/news` - 加密货币新闻

## 自动部署

每次您推送代码到主分支，Vercel 会自动重新部署您的应用。

## 本地开发

开发时仍然可以使用：

```bash
npm run dev
```

这将启动开发服务器，代理配置仍然有效。

## 故障排查

### 1. 构建失败
- 检查 `package.json` 中的依赖
- 确保所有文件路径正确

### 2. API 函数不工作
- 检查 `/api` 文件夹中的函数
- 查看 Vercel 函数日志

### 3. 分析数据不显示
- 确保 `analysis_results` 文件夹包含正确的 JSON 文件
- 检查文件命名格式：`{SYMBOL}_YYYY-MM-DD.json`

## 生产优化

1. **启用缓存**: Vercel 自动为静态资源启用 CDN 缓存
2. **压缩**: 自动启用 gzip/brotli 压缩
3. **HTTPS**: 自动提供 SSL 证书
4. **性能监控**: 在 Vercel 仪表板查看性能指标 