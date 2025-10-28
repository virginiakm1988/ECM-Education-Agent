# Vercel 部署指南 (免费 + 服务器功能)

## 优势
- ✅ 完全免费 (个人使用)
- ✅ 支持服务器端API调用 (解决CORS问题)
- ✅ 支持所有LLM提供商 (包括NVIDIA NIM)
- ✅ 全球CDN，访问速度快
- ✅ 自动部署，推送即更新

## 步骤

### 1. 准备GitHub仓库
1. 将你的代码推送到GitHub
2. 确保包含所有必要文件

### 2. 部署到Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 用GitHub账号登录
3. 点击 "New Project"
4. 选择你的GitHub仓库
5. 点击 "Deploy"

### 3. 配置Serverless Functions
创建 `api/chat.py` 文件:

```python
from http.server import BaseHTTPRequestHandler
import json
import urllib.request
import urllib.parse
import ssl

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # 设置CORS头
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        
        try:
            # 读取请求数据
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
            # 处理API调用
            provider = request_data.get('provider')
            if provider == 'gemini':
                response = self.call_gemini(request_data)
            elif provider == 'openai':
                response = self.call_openai(request_data)
            elif provider == 'nvidia-nim':
                response = self.call_nvidia_nim(request_data)
            else:
                raise ValueError(f"Unsupported provider: {provider}")
            
            # 返回响应
            result = {'response': response}
            self.wfile.write(json.dumps(result).encode('utf-8'))
            
        except Exception as e:
            error_response = {'error': str(e)}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    # 添加你的API调用方法...
```

### 4. 访问网站
部署完成后，访问: `https://your-project.vercel.app`

## 优势
- 支持所有LLM提供商
- 解决CORS问题
- 免费且功能强大
- 自动SSL证书
