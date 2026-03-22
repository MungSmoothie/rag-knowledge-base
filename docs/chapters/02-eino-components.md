# Eino 核心组件

Eino 将 AI 应用需要的能力抽象为标准组件接口，每个组件都可以替换底层实现而不影响上层。

## 组件全景

| 组件 | 接口 | 说明 | 官方实现 |
|------|------|------|----------|
| **ChatModel** | `Generate(ctx, msgs)` | 对话生成，支持流式 | OpenAI, Claude, Gemini, Ollama, 火山 Ark |
| **Embedder** | `EmbedStrings(ctx, texts)` | 文本 → 向量 `[][]float64` | OpenAI, BGE, Jina |
| **Retriever** | `Retrieve(ctx, query)` | 根据 query 检索相关文档 | Milvus, Qdrant, ES, VikingDB |
| **Indexer** | `Store(ctx, docs)` | 文档写入向量库（自动 Embedding） | Milvus, Qdrant |
| **DocumentLoader** | `Load(ctx)` | PDF/Word/HTML → 纯文本 | pdfplumber, Unstructured |
| **Tool** | `Invoke(ctx, args)` | 外部工具调用 | Shell, HTTP, DB |

## ChatModel — 大脑

```go
type ChatModel interface {
    Generate(ctx context.Context, msgs []Message, opts ...Option) (Message, error)
    Stream(ctx context.Context, msgs []Message, opts ...Option) (Stream[Message], error)
}

// 官方实现
openai.NewChatModel(ctx, &openai.ChatModelConfig{
    APIKey: os.Getenv("OPENAI_API_KEY"),
    Model:  "gpt-4o",
})
```

## Embedder — 向量化

```go
type Embedder interface {
    // 文本 → 高维向量，语义相似的文本在向量空间里"距离近"
    EmbedStrings(ctx context.Context, texts []string, opts ...Option) ([][]float64, error)
}

// OpenAI Embedding
openai.NewEmbedder(ctx, &openai.EmbeddingConfig{
    APIKey:  os.Getenv("OPENAI_API_KEY"),
    Model:   "text-embedding-3-small", // 1536 维
})
```

## Retriever — 检索器

```go
type Retriever interface {
    Retrieve(ctx context.Context, query string, opts ...Option) ([]*schema.Document, error)
}

// Document 结构
type Document struct {
    ID       string            // 唯一 ID
    Content  string            // 文本内容
    MetaData map[string]any   // 元数据：来源、页码...
}

// Milvus 检索器
milvus.NewRetriever(ctx, &milvus.RetrieverConfig{
    Collection: "contract_rag",
    TopK:       3,            // 取 Top-3 最相关块
    Embedding:  embedder,
})
```

## Indexer — 存储

```go
type Indexer interface {
    // Store 内部自动完成：Embedding → 写入向量库
    Store(ctx context.Context, docs []*Document, embedder Embedder) error
}

// Milvus 写入器
milvus.NewIndexer(ctx, &milvus.IndexerConfig{
    Collection: "contract_rag",
    Dimension:  1536,         // 必须与 Embedder 输出一致
    IndexType:  "AUTOINDEX",
    MetricType: "COSINE",     // 余弦相似度
})
```

## Tool — 工具

```go
type Tool interface {
    Name()        string
    Description() string
    Invoke(ctx context.Context, args string, opts ...Option) (string, error)
}
```

让 Agent 能够调用外部系统：搜索网页、查数据库、发 API 请求。
