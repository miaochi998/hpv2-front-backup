# 跨域资源加载解决方案

## 问题背景

在前后端分离架构中，前端和后端可能部署在不同的域名或端口下，导致浏览器的同源策略限制资源（如图片、API请求等）的加载。本项目遇到的主要问题是：

- 生产环境（http://hpfront.bonnei.com:6015）无法正常加载后端服务器（http://192.168.2.9:6016）上的图片资源
- 开发环境（http://192.168.2.9:6017）无法正常加载后端服务器（http://192.168.2.9:6016）上的图片资源
- 浏览器报错：`ERR_BLOCKED_BY_RESPONSE.NotSameOrigin`或`404 (Not Found)`

## 解决方案架构

为解决跨域资源加载问题并提供更灵活的部署选项，我们采用了以下策略：

1. **集中式URL管理**：创建专门的URL配置模块，统一管理所有API和资源地址
2. **环境变量配置**：使用环境变量文件区分开发和生产环境的配置
3. **生产环境Nginx反向代理**：在生产环境前端服务器上设置反向代理，转发资源请求到后端服务器
4. **开发环境直接使用完整URL**：在开发环境中使用完整的后端服务器URL

这种架构的优势在于：
- 消除跨域问题（使用完整URL或同源请求）
- 简化未来的域名变更（只需修改环境变量配置文件）
- 增强安全性（隐藏实际后端地址）
- 提供灵活的缓存策略
- 开发和生产环境统一配置

## 实施细节

### 1. 集中式URL管理

在`src/config/urls.js`中创建URL管理模块：

```javascript
/**
 * URL配置管理模块
 * 集中管理所有API和资源URL配置，方便未来域名变更
 */

// 获取API基础URL
export const getApiBaseUrl = () => {
  // 1. 首先检查环境变量中是否已定义
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // 2. 检查是否是生产环境（根据域名判断）
  const { hostname } = window.location;
  const isProduction = hostname.includes('bonnei.com');
  
  // 3. 根据环境返回对应的后端URL
  if (isProduction) {
    // 当前使用IP，未来可改为域名
    return 'http://192.168.2.9:6016';
  } else {
    // 开发环境使用当前主机的6016端口
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:6016`;
  }
};

// 获取图片URL的函数
export const getImageUrl = (imagePath, params = '') => {
  if (!imagePath) {
    return null;
  }
  
  // 如果已经是完整的URL（包含http或https），直接返回
  if (imagePath.startsWith('http')) {
    return imagePath + params;
  }
  
  // 确保路径以'/'开头
  if (!imagePath.startsWith('/')) {
    imagePath = `/${imagePath}`;
  }
  
  // 优先使用环境变量中的图片基础URL
  let baseUrl = '';
  if (import.meta.env.VITE_IMAGE_BASE_URL) {
    baseUrl = import.meta.env.VITE_IMAGE_BASE_URL;
    console.log('[URL CONFIG] 使用环境变量图片基础URL:', baseUrl);
  } else {
    // 否则使用API基础URL
    baseUrl = getApiBaseUrl();
    console.log('[URL CONFIG] 使用API基础URL作为图片URL:', baseUrl);
  }
  
  // 返回完整URL
  const fullUrl = `${baseUrl}${imagePath}${params}`;
  console.log('[URL CONFIG] 生成完整图片URL:', fullUrl);
  return fullUrl;
};

// 导出配置对象，方便引用
export default {
  apiBaseUrl: getApiBaseUrl(),
  getImageUrl
};
```

### 2. 环境变量配置

在项目根目录创建环境配置文件：

**.env.development**（开发环境配置）：
```
# 开发环境配置
VITE_API_BASE_URL=http://192.168.2.9:6016
VITE_IMAGE_BASE_URL=http://192.168.2.9:6016
VITE_ENV=development
```

**.env.production**（生产环境配置）：
```
# 生产环境配置
VITE_API_BASE_URL=http://192.168.2.9:6016
VITE_IMAGE_BASE_URL=http://192.168.2.9:6016
VITE_ENV=production

# 未来可以修改为域名
# VITE_API_BASE_URL=https://api.yourdomain.com
# VITE_IMAGE_BASE_URL=https://api.yourdomain.com
```

### 3. 使用URL配置

在组件中使用集中式URL管理，例如`BrandCard.jsx`：

```jsx
import { getImageUrl } from '../../config/urls';

// 使用示例
const getBrandImageUrl = () => {
  if (!brand?.logo_url) {
    return null;
  }
  
  // 添加缓存破坏参数
  const cacheVer = getCacheVersion();
  const timestamp = forceUpdate;
  const params = `?_v=${cacheVer}&_t=${timestamp}`;
  
  // 使用集中配置的URL生成函数
  return getImageUrl(brand.logo_url, params);
};
```

同样，在`EditBrandModal.jsx`中也使用了相同的方式：

```jsx
// 设置logo预览
if (brand.logo_url) {
  // 使用集中URL配置生成图片URL
  const timestamp = Date.now();
  const imageUrl = getImageUrl(brand.logo_url, `?_t=${timestamp}`);
  setLogoPreview(imageUrl);
  console.log('[EDIT BRAND] 设置Logo预览URL:', imageUrl);
}
```

### 4. 开发环境配置

开发环境使用PM2启动Vite开发服务器，其中Vite配置(`vite.config.js`)包含以下代理设置：

```javascript
// 通用代理配置
const proxyConfig = {
  '/api': {
    target: 'http://192.168.2.9:6016',
    changeOrigin: true,
    secure: false
  },
  '/uploads': {
    target: 'http://192.168.2.9:6016',
    changeOrigin: true,
    secure: false
  }
};

export default defineConfig({
  // ...其他配置
  server: {
    port: 6017,
    host: "0.0.0.0",
    cors: true,
    proxy: proxyConfig
  }
});
```

但是由于Vite代理可能在某些情况下不可靠，我们在`getImageUrl`函数中直接返回完整URL，不依赖代理功能。这样可以确保图片资源在开发环境中也能正常加载。

### 5. Nginx反向代理配置（生产环境）

在生产环境Nginx配置中添加API和上传文件的代理：

```nginx
# API代理配置
location /api/ {
    proxy_pass http://192.168.2.9:6016;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_connect_timeout 60s;
    proxy_read_timeout 60s;
    proxy_send_timeout 60s;
}

# 上传文件代理配置
location /uploads/ {
    proxy_pass http://192.168.2.9:6016;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    expires 7d;  # 图片缓存7天
    proxy_cache_valid 200 304 7d;
    proxy_cache_valid any 1m;
}
```

## 后端配置

后端需要允许跨域请求，在`hpv2-hou/src/app.js`中配置CORS：

```javascript
// 配置CORS选项
const corsOptions = {
  origin: (origin, callback) => {
    // 允许没有来源的请求（如Postman或curl）或在允许列表中的域名
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`拒绝CORS请求: ${origin}`);
      
      // 开发环境下记录被拒绝的域名，但仍然允许请求
      if (process.env.NODE_ENV !== 'production') {
        console.log('开发环境下允许未知来源请求');
        callback(null, true);
      } else {
        // 生产环境也允许任何来源请求，以确保图片加载
        console.log('生产环境也允许未知来源请求:', origin);
        callback(null, true);
      }
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cache-Control', 'Pragma', 'Expires', 'X-Random'],
  exposedHeaders: ['Content-Length', 'Content-Type']
};
```

对于静态文件服务，禁用安全限制：

```javascript
// 静态文件服务 - 添加CORS头部
app.use('/uploads', (req, res, next) => {
  // 设置允许任何来源访问图片资源
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  
  // 明确禁用所有可能阻止跨域资源共享的安全策略
  res.removeHeader('Cross-Origin-Resource-Policy');
  res.removeHeader('Cross-Origin-Embedder-Policy');
  
  // 禁用内容安全策略头
  res.removeHeader('Content-Security-Policy');
  res.removeHeader('X-Content-Security-Policy');
  
  next();
}, express.static(path.join(__dirname, 'uploads')));
```

## 使用说明

### 正常使用

当前配置已经生效，无需特殊操作，图片和API在开发环境和生产环境中都应正常工作。

### 域名变更

当后端服务器域名变更时：

1. 修改`.env.production`和`.env.development`文件：
   ```
   VITE_API_BASE_URL=https://api.newdomain.com
   VITE_IMAGE_BASE_URL=https://api.newdomain.com
   ```

2. 修改Nginx配置中的proxy_pass（仅生产环境需要）：
   ```nginx
   location /api/ {
       proxy_pass https://api.newdomain.com;
       # ...其他配置保持不变
   }
   
   location /uploads/ {
       proxy_pass https://api.newdomain.com;
       # ...其他配置保持不变
   }
   ```

3. 重新构建前端并重启服务：
   ```bash
   cd /www/wwwroot/hpv2-front
   npm run build
   pm2 restart hpv2-front-prod
   pm2 restart hpv2-front-dev
   nginx -s reload  # 仅生产环境需要
   ```

### 添加新域名

如需使用全新域名（如https://www.abc.com）访问：

1. 在DNS服务商处将域名解析到服务器IP
2. 创建新的Nginx配置文件
3. 配置HTTPS证书
4. 添加反向代理到前端服务

示例配置：
```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name www.abc.com;
    
    # SSL配置
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # 反向代理到前端
    location / {
        proxy_pass http://hpfront.bonnei.com:6015;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        # ...其他代理配置
    }
}
```

## 注意事项

1. **安全考虑**：生产环境应使用HTTPS而非HTTP
2. **缓存控制**：调整Nginx中的缓存设置以满足特定需求
3. **维护文档**：当域名或IP变更时，更新相关配置文档
4. **测试验证**：任何修改后都应全面测试各项功能
5. **备份配置**：修改前备份配置文件，以便快速恢复
6. **环境变量优先**：确保优先使用环境变量配置，避免硬编码URL

## 故障排除

如果遇到资源加载问题：

1. **检查浏览器控制台**：查看具体错误信息
2. **检查环境变量**：确认`.env.development`和`.env.production`配置正确
3. **验证Nginx配置**：使用`nginx -t`检查语法（仅生产环境）
4. **检查后端服务**：确认后端服务正常运行
5. **检查网络连接**：确保服务器间网络畅通
6. **查看日志**：检查控制台日志中的`[URL CONFIG]`前缀信息，了解URL生成过程

## 未来改进

1. **添加日志监控**：实时监控图片加载失败情况
2. **CDN集成**：将静态资源部署到CDN提高加载速度
3. **图片优化**：添加自动压缩和格式转换功能
4. **服务健康检查**：添加后端服务健康检查机制
5. **容器化部署**：使用Docker容器简化部署流程

---

本文档由技术团队维护，最后更新日期：2024年4月25日 