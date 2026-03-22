# 部署说明

## 从本机推送到 GitHub

由于服务器无法访问 GitHub，请在本机执行以下操作：

```bash
# 1. 把仓库拉到本机（或者把文件拷贝出来）
scp -r claw@<server>:/home/claw/.openclaw/workspace/rag-knowledge-base ./

# 2. 或者在服务器上打包后拷贝
cd /home/claw/.openclaw/workspace/rag-knowledge-base
git remote add origin https://github.com/<your-username>/rag-knowledge-base.git
git push -u origin master
```

## GitHub Pages 部署（推荐）

1. Fork 本仓库到你的 GitHub 账号
2. Settings → Pages → Source: **GitHub Actions**（不要选 branch）
3. GitHub Actions 会自动运行 `npm run docs:build` 并部署

## 本地预览

```bash
cd rag-knowledge-base
npm install
npm run docs:dev      # 预览 http://localhost:5173
npm run docs:build    # 构建静态文件到 docs/.vitepress/dist/
```
