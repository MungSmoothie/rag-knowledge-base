import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Eino + RAG 技术知识库',
  description: '字节跳动 Eino 框架与 RAG 检索增强生成技术',
  lang: 'zh-CN',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: '📖 知识库', link: '/' },
      { text: 'GitHub', link: 'https://github.com/cloudwego/eino' }
    ],
    sidebar: [
      {
        text: '📚 RAG 基础',
        collapsed: false,
        items: [
          { text: 'RAG 是什么', link: '/chapters/01-rag-intro' },
          { text: 'Embedding 选型', link: '/chapters/05-rag-deep#embedding-选型' },
          { text: '稀疏向量 vs 密集向量', link: '/chapters/05-rag-deep#稀疏向量-vs-密集向量' }
        ]
      },
      {
        text: '📚 RAG 进阶',
        collapsed: false,
        items: [
          { text: 'RAG 深度知识', link: '/chapters/05-rag-deep' },
          { text: '分块策略', link: '/chapters/05-rag-deep#分块策略' },
          { text: 'HyDE 假设性文档嵌入', link: '/chapters/05-rag-deep#hyde-假设性文档嵌入' },
          { text: 'RAG 模式图谱', link: '/chapters/05-rag-deep#rag-模式图谱' }
        ]
      },
      {
        text: '⚙️ Eino 框架',
        collapsed: false,
        items: [
          { text: 'Eino 概览', link: '/chapters/00-overview' },
          { text: '核心组件', link: '/chapters/02-eino-components' },
          { text: 'Composition 编排', link: '/chapters/03-composition' },
          { text: 'Callback 全链路监控', link: '/chapters/03-composition#callback-全链路可观测' }
        ]
      },
      {
        text: '🔧 实战与进阶',
        collapsed: false,
        items: [
          { text: 'Eino + RAG 合同问答', link: '/chapters/04-rag-practice' },
          { text: '混合检索 RRF 融合', link: '/chapters/06-advanced#混合检索rrf-融合' },
          { text: 'Agentic RAG', link: '/chapters/06-advanced#agentic-rag' },
          { text: '向量数据库选型', link: '/chapters/06-advanced#向量数据库选型' }
        ]
      },
      {
        text: '📖 总结',
        collapsed: true,
        items: [
          { text: '总结与下一步', link: '/chapters/07-summary' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/cloudwego/eino' }
    ],
    footer: {
      message: '村口情报社 · 二狗 出品 🐕',
      copyright: 'MIT License · 2026'
    }
  }
})
