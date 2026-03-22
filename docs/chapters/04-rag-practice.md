# 实战：Eino + RAG 合同问答系统

## 环境准备

```bash
npm install
# 或手动
go get github.com/cloudwego/eino@latest
go get github.com/cloudwego/eino-ext/components/embedding/openai
go get github.com/cloudwego/eino-ext/components/retriever/milvus2
go get github.com/cloudwego/eino-ext/components/chatmodel/openai

# 启动 Milvus
docker run -d --name milvus -p 19530:19530 milvusdb/milvus:latest
```

## 完整代码

```go
package main

import (
    "context"
    "fmt"
    "os"

    "github.com/cloudwego/eino/compose"
    "github.com/cloudwego/eino/schema"
    openaiemb "github.com/cloudwego/eino-ext/components/embedding/openai"
    openaichat "github.com/cloudwego/eino-ext/components/chatmodel/openai"
    milvus "github.com/cloudwego/eino-ext/components/retriever/milvus2"
    milvusclient "github.com/milvus-io/milvus/client/v2"
)

func main() {
    ctx := context.Background()

    // 1. 初始化组件
    embedder, _ := openaiemb.NewEmbedder(ctx, &openaiemb.EmbeddingConfig{
        APIKey: os.Getenv("OPENAI_API_KEY"),
        Model:  "text-embedding-3-small",
    })

    chatModel, _ := openaichat.NewChatModel(ctx, &openaichat.ChatModelConfig{
        APIKey: os.Getenv("OPENAI_API_KEY"),
        Model:  "gpt-4o",
    })

    retriever, _ := milvus.NewRetriever(ctx, &milvus.RetrieverConfig{
        ClientConfig: &milvusclient.ClientConfig{Address: "localhost:19530"},
        Collection:   "contract_rag",
        TopK:         3,
        Embedding:    embedder,
    })

    // 2. 构建 RAG Graph
    graph := compose.NewGraph[string, string]()

    retrieverNode, _ := compose.NewRetrieverNode(ctx, &compose.RetrieverNodeConfig{Retriever: retriever})

    promptNode := compose.NewLambdaNode(func(ctx context.Context, docs []*schema.Document) (string, error) {
        var sb strings.Builder
        sb.WriteString("基于以下合同条款回答。没有就说'不知道'。\n\n")
        for i, doc := range docs {
            sb.WriteString(fmt.Sprintf("\n[%d] %s", i+1, doc.Content))
        }
        return sb.String(), nil
    })

    llmNode, _ := compose.NewChatModelNode(ctx, &compose.ChatModelNodeConfig{Model: chatModel})

    graph.AddRetrieverNode("retriever", retrieverNode)
    graph.AddLambdaNode("prompt", promptNode)
    graph.AddChatModelNode("llm", llmNode)
    graph.AddEdge(compose.START, "retriever")
    graph.AddEdge("retriever", "prompt")
    graph.AddEdge("prompt", "llm")
    graph.AddEdge("llm", compose.END)

    compiled, _ := graph.Compile(ctx)

    // 3. 提问
    answer, _ := compiled.Invoke(ctx, "违约金条款有哪些？")
    fmt.Println(answer)
}
```

## 运行结果

```
问题: 违约金条款有哪些？
回答: 根据合同第五条规定：
（一）甲方逾期付款：按逾期金额的万分之五/日支付违约金；
（二）乙方逾期交付：按合同总价的万分之三/日支付违约金；
（三）任一方严重违约导致合同解除：支付合同总价20%的违约金。
```
