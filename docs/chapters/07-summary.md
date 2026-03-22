# 总结

## Eino + RAG 技术栈

```
数据层：PDF / Word / HTML / 数据库 → Document Loader
处理层：Text Splitter → Embedding（BGE/OpenAI）
存储层：向量数据库（Milvus / Qdrant / Chroma）
检索层：Retriever（向量 / BM25 / 混合检索 / Rerank）
生成层：ChatModel（GPT-4o / Claude / Qwen）
编排层：compose.NewGraph（Chain & Graph）
```

## Eino vs LangChain

| | Eino（Go） | LangChain（Python） |
|---|---|---|
| 语言 | Go，性能高，并发强 | Python，生态最全 |
| 性能 | 编译型，延迟低，适合生产 | 解释型，高并发有瓶颈 |
| 适用 | 高并发后端服务、微服务 | 数据处理、NLP 管道 |

## 下一步建议

```
第1周：搭建 Milvus + Eino 的 RAG demo，理解各组件
第2周：加混合检索（RRF 融合），提升检索精度
第3周：加重排序（Rerank）和 Query 改写
第4周：构建评估体系，建立自己的 RAG 质量基准
```

## 参考资源

| 资源 | 链接 |
|------|------|
| Eino 官方文档 | [cloudwego.io/docs/eino](https://www.cloudwego.io/docs/eino) |
| Eino GitHub | [github.com/cloudwego/eino](https://github.com/cloudwego/eino) |
| Eino Examples | [github.com/cloudwego/eino-examples](https://github.com/cloudwego/eino-examples) |
| DataWhale all-in-rag | [github.com/datawhalechina/all-in-rag](https://github.com/datawhalechina/all-in-rag) |
| MTEB 排行榜 | [huggingface.co/spaces/mteb/leaderboard](https://huggingface.co/spaces/mteb/leaderboard) |

---

**有问题？找二狗。** 🐕

*村口情报社 · 2026 年 3 月 · 欢迎转发*
