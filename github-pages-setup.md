# GitHub Pages 部署指南 (免费)

## 优势
- ✅ 完全免费，无限制
- ✅ 自动HTTPS
- ✅ 全球CDN
- ✅ 与GitHub完美集成

## 步骤

### 1. 创建GitHub仓库
1. 访问 [GitHub.com](https://github.com)
2. 点击 "New repository"
3. 仓库名: `eop-ecm-agent`
4. 设为 **Public** (免费GitHub Pages需要)
5. 勾选 "Add a README file"
6. 点击 "Create repository"

### 2. 准备文件
将以下文件上传到仓库:
```
index.html (重命名 script-github.js 内容)
styles.css
script.js (使用 script-github.js)
rag_system.js
README.md
```

### 3. 启用GitHub Pages
1. 进入仓库设置 (Settings)
2. 滚动到 "Pages" 部分
3. Source: "Deploy from a branch"
4. Branch: "main"
5. Folder: "/ (root)"
6. 点击 "Save"

### 4. 访问网站
5-10分钟后，访问: `https://yourusername.github.io/eop-ecm-agent`

## 限制
- 只支持Gemini和OpenAI API (直接调用)
- 不支持NVIDIA NIM (需要服务器代理)
- 文件上传功能有限

## 配置
用户需要在设置中输入自己的API密钥
