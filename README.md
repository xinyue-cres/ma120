# ma120

查看国内公募基金和 ETF 均线（MA）的 Web 工具。

## 功能

- 按代码或名称搜索基金
- 普通基金：净值折线图 + MA 叠加
- ETF：K 线图 + MA 叠加
- MA 周期可选：MA5 / MA10 / MA20 / MA60 / MA120 / MA250
- 收藏列表（localStorage 持久化）
- 移动端响应式布局

## 技术栈

- **前端**：Vue 3 + Vite
- **图表**：ECharts
- **样式**：Tailwind CSS
- **后端**：Vercel Serverless Functions（数据代理）
- **数据来源**：东方财富公开接口

## 本地开发

需要 [Node.js](https://nodejs.org) 和 [Vercel CLI](https://vercel.com/docs/cli)。

```bash
npm install -g vercel
npm install
npm start
```

启动后会同时运行两个进程：
- `vercel dev --listen 3001` — Serverless Functions，处理 `/api/*` 请求
- `vite` — 前端开发服务器，运行在 `http://localhost:5173`，将 `/api` 代理到 3001 端口

3 秒后自动打开浏览器。

## 部署

```bash
vercel --prod
```

`api/` 目录会自动部署为 Vercel Serverless Functions，与前端静态资源在同一项目下。

## 项目结构

```
├── api/
│   ├── search.js   # 基金搜索代理
│   ├── nav.js      # 普通基金历史净值代理
│   └── kline.js    # ETF K 线数据代理
└── src/
    ├── components/
    │   ├── FundChart.vue   # 图表主组件（K 线或折线 + MA）
    │   ├── SearchBar.vue   # 搜索框（带下拉候选）
    │   ├── MASelector.vue  # MA 周期切换按钮
    │   └── Favorites.vue   # 收藏列表
    └── composables/
        ├── useFundData.js  # 数据获取 + MA 计算
        └── useFavorites.js # 收藏管理
```
