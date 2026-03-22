# 进阶用法

## 混合检索（RRF 融合）

向量检索 + BM25 关键词检索，RRF（倒数排名融合）双重保险。

```go
import "github.com/cloudwego/eino/compose"

// 向量检索器（Milvus）
vectorRet, _ := milvus.NewRetriever(ctx, &milvus.RetrieverConfig{
    Collection: "contract_rag", TopK: 5, Embedding: embedder,
})

// 关键词检索器（ElasticSearch BM25）
bm25Ret, _ := es7.NewRetriever(ctx, &es7.RetrieverConfig{
    Index: "contract_rag", TopK: 5,
    SearchMode: es7.SearchModeBM25,
})

// RRF 融合：两个检索器的结果按倒数排名加权合并
// RRF(d) = Σ 1 / (60 + rank(d))
fusionRet := compose.NewFusionRetriever(
    []retriever.Retriever{vectorRet, bm25Ret},
    compose.FusionRRF(60),
)

docs, _ := fusionRet.Retrieve(ctx, "违约金条款")
```

## DeepAgent：多子 Agent 协作

用 Eino DeepAgent 让 AI 自主决定要查什么知识库、查几轮。

```go
import "github.com/cloudwego/eino/agent/deep"

deepAgent, _ := deep.New(ctx, &deep.Config{
    ChatModel: chatModel,
    SubAgents: []adk.Agent{
        newSubAgent("合同检索", contractRetriever),
        newSubAgent("财务数据", financeRetriever),
        newSubAgent("法务条款", legalRetriever),
    },
})

runner := agent.NewRunner(ctx, &agent.RunnerConfig{Agent: deepAgent})

// 用户：分析一下这个供应商合同的风险点
// Agent 自动分配给相关子 Agent，最后由分析 Agent 综合
result := runner.Query(ctx, "分析这个供应商合同的风险点")
```

## Callback：全链路监控

```go
handler := callbacks.NewHandler("rag-tracer",
    callbacks.WithOnStart(func(ctx context.Context, info *callbacks.RunInfo) context.Context {
        fmt.Printf("[开始] %s\n", info.Name)
        return ctx
    }),
    callbacks.WithOnEnd(func(ctx context.Context, info *callbacks.RunInfo, output any) context.Context {
        fmt.Printf("[完成] %s\n", info.Name)
        return ctx
    }),
)

compiled.Invoke(ctx, question, compose.WithCallbacks(handler))
```

## 向量数据库选型

| 数据库 | 规模 | 部署 | 推荐场景 |
|--------|------|------|----------|
| Chroma | ~1000万 | 本地/Docker | 开发测试 |
| FAISS | ~1亿 | 本地 | 离线批处理 |
| **Qdrant** | >10亿 | Docker/K8s | **生产首选** |
| Milvus | >100亿 | K8s/云 | 企业级超大规模 |
| VikingDB | >10亿 | 火山引擎 | 国内业务 |
| Pinecone | 任意 | 全托管 | 不想运维 |

## 生产注意事项

### ✅ 该做的
- 上线前建立评估集（人工标注 50-100 个问答对）
- 用 Callback 记录每次检索的召回率和相关性
- 监控 Token 消耗，控制单次查询成本
- 对敏感数据做访问控制（索引层 ACL）

### ❌ 不该做的
- 不要把原始文档全文塞进 Prompt（成本爆炸）
- 不要跳过 Embedding 评估直接上线
- 不要用太大 chunk_size（512 tokens 以上效果通常下降）
- 不要忽略错误处理（网络超时、向量库挂了）
