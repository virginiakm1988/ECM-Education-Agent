# Netlify 部署指南 (免费)

## 优势
- ✅ 免费套餐很慷慨
- ✅ 拖拽部署，超级简单
- ✅ 支持Serverless Functions
- ✅ 表单处理功能
- ✅ 自动HTTPS

## 快速部署步骤

### 方法1: 拖拽部署 (最简单)
1. 访问 [netlify.com](https://netlify.com)
2. 注册免费账号
3. 将你的项目文件夹直接拖到部署区域
4. 等待部署完成
5. 获得免费URL: `https://random-name.netlify.app`

### 方法2: GitHub集成
1. 连接你的GitHub账号
2. 选择仓库
3. 设置构建命令 (如果需要)
4. 自动部署

### 自定义域名 (可选)
- 免费支持自定义域名
- 自动SSL证书
- DNS管理

## 配置Serverless Functions
创建 `netlify/functions/chat.js`:

```javascript
exports.handler = async (event, context) => {
  // 设置CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    const data = JSON.parse(event.body);
    // 处理API调用逻辑
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ response: 'API response here' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```
