# RAG 深度知识

## 分块策略

分块是 RAG 效果最关键、数据质量影响最大的环节。

| 策略 | 原理 | 优缺点 | 适用场景 |
|------|------|--------|----------|
| 固定字数 | 每 N 个字一切 | ✅ 简单 ❌ 容易切断语义 | 快速验证 |
| 递归字符 | 先按段落切，不够再按句子 | ✅ 保持语义完整 ✅ LangChain 默认 | **通用首选** |
| 按语义切 | 计算句子间相似度，在低相似度处切 | ✅ 语义完整 ❌ 计算量大 | 高质量场景 |
| 按结构切 | 按 Markdown 标题、PDF 章节切 | ✅ 结构保持 ❌ 块大小不均匀 | 技术文档、论文 |
| 父子块检索 | 大块建父索引，小块建子索引 | ✅ 兼顾精度和上下文 ❌ 实现复杂 | **生产环境推荐** |

**经验值**：中文 chunk_size = 300-600 字，overlap = 50-100 字

## Embedding 选型 {#embedding-选型}

| 模型 | 维度 | 中文效果 | 备注 |
|------|------|----------|------|
| text-embedding-3-large | 3072 | ✅ 良好 | OpenAI 旗舰 |
| text-embedding-3-small | 1536 | ✅ 良好 | 性价比高 |
| **BGE-large-zh-v1.5** | 1024 | ✅✅ **最强** | **中文首选** |
| Jina-v2-base-zh | 768 | ✅ 强 | Jina 出品 |
| m3e-large | 1024 | ✅ 强 | 开源免费 |

> 💡 参考 [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard) 选模型

## 稀疏向量 vs 密集向量 {#稀疏向量-vs-密集向量}

混合检索融合了两种向量的优势，理解它们是掌握高级检索的基础。

| | 稀疏向量（Sparse） | 密集向量（Dense） |
|---|---|---|
| 代表算法 | BM25 / TF-IDF | BGE / OpenAI Embedding |
| 表示方式 | 高维向量，绝大部分为 0 | 低维连续向量 |
| 匹配方式 | 关键词精确匹配 | 语义相似度搜索 |
| 优点 | 可解释性强，专有名词精准 | 理解同义词/上下文 |
| 缺点 | 无法理解语义（词汇鸿沟） | 可解释性差 |

**BM25 公式**：
```
Score(Q,D) = Σ IDF(qi) × (f(qi,D) × (k1+1)) / (f(qi,D) + k1 × (1-b + b × |D|/avgdl))
```

## RAG 模式图谱 {#rag-模式图谱}

```
基础 RAG → 检索增强 → 模块化 RAG → Self-RAG → Agentic RAG
  (Query→Retrieve→LLM)  (Rewrite/Rerank)  (可插拔)  (自适应)   (自主决策)
```

| 模式 | 说明 |
|------|------|
| **基础 RAG** | Query → Retrieve → LLM，最简单 |
| **检索增强** | Query Rewrite / HyDE / Query Decomposition |
| **模块化 RAG** | Retriever/Rewriter/ReRanker 可插拔组合 |
| **Self-RAG** | 模型自己判断：需要检索吗？→ 检索 → 生成 → 回答有帮助吗？ |
| **Agentic RAG** | Agent 自主决定：查什么、查几次、如何综合 |

## HyDE：假设性文档嵌入 {#hyde-假设性文档嵌入}

先用 LLM 生成一个"假设答案"，再用这个假设答案去检索，而不用原始问题。

```go
// 1. LLM 先生成假设性答案
hydeAnswer, _ := chatModel.Generate(ctx, []schema.Message{
    schema.UserMessage("假设你是合同专家，回答：" + question),
})

// 2. 用假设答案去检索（而不是用原始问题）
hydeDocs, _ := retriever.Retrieve(ctx, hydeAnswer.Content)

// 3. 综合假设答案 + 真实文档 → 最终回答
finalAnswer, _ := chatModel.Generate(ctx, []schema.Message{
    schema.UserMessage(fmt.Sprintf("参考资料：%s\n\n问题：%s",
        concatDocs(hydeDocs), question)),
})
```

## RAG 三元组评估

RAG 质量从三个维度打分：

| 维度 | 评估对象 | 核心问题 | 指标 |
|------|----------|----------|------|
| **上下文相关性** | Retriever | 检索到的内容是否和问题相关？ | Precision@K, Recall@K, MRR |
| **忠实度** | Generator | 答案是否严格基于上下文，没有瞎编？ | Faithfulness Score |
| **答案相关性** | 端到端系统 | 最终答案是否直接完整回答了问题？ | Answer Relevance |

**关键公式**：
```
Precision@K = (Top-K 中相关文档数) / K
Recall@K    = (Top-K 中相关文档数) / (所有相关文档数)
MRR          = (1/|Q|) × Σ (1/rank_q)    # 第一个相关文档排名的倒数均值
F1           = 2 × (Precision × Recall) / (Precision + Recall)
```
