# Eino 编排：Chain 与 Graph

组件是积木，**Composition 是把这些积木串成流程的方法**。

## Chain（链）vs Graph（图）

| | Chain | Graph |
|---|---|---|
| 特点 | 线性顺序执行 | 支持分支、循环、条件 |
| 适用 | 简单的"输入 → 处理 → 输出" | 复杂的多路径业务逻辑 |
| API | `compose.NewChain` | `compose.NewGraph` |

## Chain 示例：Embedding 流水线

```go
import "github.com/cloudwego/eino/compose"

// 创建 Chain：输入 []string → 输出 [][]float64
chain := compose.NewChain[[]string, [][]float64]()

// 往 Chain 里加 Embedder 节点
chain.AppendEmbedding(embedder)

// 编译并运行
runnable, _ := chain.Compile(ctx)
vectors, _ := runnable.Invoke(ctx, []string{
    "RAG是什么？",
    "Eino框架怎么用？",
})
```

## Graph 示例：RAG 问答流程

```go
import "github.com/cloudwego/eino/compose"

// 创建 Graph：输入 string（用户问题）→ 输出 string（回答）
graph := compose.NewGraph[string, string]()

// 添加节点
graph.AddRetrieverNode("retriever", retrieverNode)
graph.AddLambdaNode("prompt", promptFn)
graph.AddChatModelNode("llm", chatModelNode)

// 编排边（节点之间的连接关系）
graph.AddEdge(compose.START, "retriever")
graph.AddEdge("retriever", "prompt")
graph.AddEdge("prompt", "llm")
graph.AddEdge("llm", compose.END)

compiled, _ := graph.Compile(ctx)
answer, _ := compiled.Invoke(ctx, "违约金条款有哪些？")
```

## Graph 支持的节点类型

| 节点类型 | 创建方式 | 说明 |
|---------|---------|------|
| `ChatModelNode` | `AddChatModelNode` | 调用 LLM |
| `RetrieverNode` | `AddRetrieverNode` | 检索文档 |
| `EmbeddingNode` | `AddEmbeddingNode` | 文本向量化 |
| `LambdaNode` | `AddLambdaNode` | 自定义函数逻辑 |

## Callback — 全链路可观测

```go
import "github.com/cloudwego/eino/callbacks"

handler := callbacks.NewHandler("rag-tracer",
    callbacks.WithOnStart(func(ctx context.Context, info *callbacks.RunInfo) context.Context {
        fmt.Printf("[开始] %s\n", info.Name)
        return ctx
    }),
    callbacks.WithOnEnd(func(ctx context.Context, info *callbacks.RunInfo, output any) context.Context {
        fmt.Printf("[完成] %s\n", info.Name)
        return ctx
    }),
    callbacks.WithOnError(func(ctx context.Context, info *callbacks.RunInfo, err error) {
        fmt.Printf("[错误] %s: %v\n", info.Name, err)
    }),
)

// 注入到 Graph，所有节点执行时都会触发 Callback
compiled.Invoke(ctx, question, compose.WithCallbacks(handler))
```

输出示例：
```
[开始] retriever  (检索耗时: 23ms, 返回 3 个文档块)
[完成] retriever
[开始] prompt     (组装 Prompt 耗时: 1ms)
[完成] prompt
[开始] llm        (LLM 生成耗时: 1.2s, 使用 820 tokens)
[完成] llm
```
