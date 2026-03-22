# RAG Knowledge Base · Eino + RAG 技术分享

📚 Eino 框架与 RAG 检索增强生成技术知识库

## 在线阅读

部署后访问：`https://[username].github.io/rag-knowledge-base/`

## 本地开发

```bash
npm install
npm run docs:dev      # 开发预览（localhost:5173）
npm run docs:build    # 构建静态文件
npm run docs:preview  # 预览构建结果
```

## 目录结构

```
rag-knowledge-base/
├── docs/
│   ├── index.md              # 首页
│   ├── .vitepress/
│   │   └── config.js         # VitePress 配置
│   └── chapters/
│       ├── 00-overview.md     # Eino 框架概览
│       ├── 01-what-is-rag.md  # RAG 是什么
│       ├── 02-eino-components.md
│       ├── 03-composition.md
│       ├── 04-rag-practice.md
│       ├── 05-rag-deep.md
│       ├── 06-advanced.md
│       └── 07-summary.md
├── scripts/
│   └── gen_chapters.py       # 从 markdown 生成章节
└── package.json
```

## 部署到 GitHub Pages

1. Fork / Clone 本仓库
2. 在 GitHub Actions 中启用 Pages（Settings → Pages → Source: GitHub Actions）
3. 推送后自动部署

## 致谢

- [Eino](https://github.com/cloudwego/eino) — 字节跳动开源 Go AI 框架
- [DataWhale all-in-rag](https://github.com/datawhalechina/all-in-rag) — RAG 技术全栈教程
- [村口情报社](https://github.com/village-intelligence) — 二狗出品 🐕
