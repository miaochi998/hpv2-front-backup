# 帮你品牌货盘管理系统 - 前端独立开发实施方案

## 方案概述

本方案采用完全独立的前端开发模式，保持现有后端代码不变，前端在独立代码库中开发。这种方式符合现代前后端分离架构，具有零风险、高灵活性和良好的多端扩展性。

## 目录结构

### 现有后端项目（保持不变）
```
/www/wwwroot/hpv2-hou/          # 当前后端项目
├── src/                        # 后端源代码
├── package.json                # 后端依赖管理
├── ecosystem.config.js         # PM2配置
└── ...                         # 其他后端相关文件
```

### 新建前端项目
```
/www/wwwroot/hpv2-front/        # 新建前端项目目录
├── src/                        # 前端源代码
│   ├── api/                    # API请求封装
│   ├── assets/                 # 静态资源
│   ├── components/             # 组件库
│   ├── pages/                  # 页面组件
│   ├── router/                 # 路由配置
│   ├── store/                  # 状态管理
│   ├── utils/                  # 工具函数
│   ├── App.jsx                 # 应用入口
│   └── main.jsx                # 渲染入口
├── public/                     # 公共静态资源
├── index.html                  # HTML模板
├── vite.config.js              # Vite配置
├── package.json                # 前端依赖管理
├── .env.development            # 开发环境变量
├── .env.production             # 生产环境变量
└── ...                         # 其他配置文件
```

## 实施步骤

### 1. 后端准备工作

#### 1.1 启用CORS支持
在后端`src/app.js`中修改CORS中间件配置，允许前端跨域访问：

```javascript
// 引入cors包（已安装）
const cors = require('cors');

// 配置CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://hpfront.bonnei.com:6015', 'https://hp.bonnei.com'] 
    : ['http://192.168.2.9:6015'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

// 应用CORS中间件，替换现有的简单配置
app.use(cors(corsOptions));
```

#### 1.2 API接口规范确认

根据后端代码检查，确认以下API接口规范：

- **API路径前缀**：`/api`
- **认证方式**：JWT Bearer令牌
- **令牌传递**：通过HTTP请求头 `Authorization: Bearer <token>`
- **数据格式**：JSON
- **错误处理**：统一的错误响应格式

#### 1.3 API文档整理

为前端开发准备API文档，包含以下内容：

1. **认证相关接口**
   - 登录: `POST /api/auth/login`
   - 登出: `POST /api/auth/logout`
   - 获取用户信息: `GET /api/auth/profile`
   - 更新用户信息: `PUT /api/auth/profile`
   
2. **产品相关接口**
   - 获取产品列表: `GET /api/pallet/products`
   - 添加产品: `POST /api/pallet/products`
   - 修改产品: `PUT /api/pallet/products/:id`
   - 删除产品: `DELETE /api/pallet/products/:id`

3. **品牌相关接口**
   - 获取品牌列表: `GET /api/brands`
   - 添加品牌: `POST /api/brands`
   - 修改品牌: `PUT /api/brands/:id`
   - 删除品牌: `DELETE /api/brands/:id`

4. **用户管理接口**
   - 获取用户列表: `GET /api/users`
   - 添加用户: `POST /api/users`
   - 修改用户: `PUT /api/users/:id`
   - 删除用户: `DELETE /api/users/:id`

### 2. 前端项目初始化

#### 2.1 创建项目

使用Vite创建React项目：

```bash
# 创建项目目录
mkdir -p /www/wwwroot/hpv2-front

# 进入项目目录
cd /www/wwwroot/hpv2-front

# 使用Vite创建项目
npm create vite@latest . -- --template react

# 安装依赖
npm install
```

#### 2.2 安装核心依赖

```bash
# 路由管理
npm install react-router-dom

# UI组件库
npm install antd @ant-design/icons

# 状态管理
npm install @reduxjs/toolkit react-redux

# HTTP请求
npm install axios

# 工具库
npm install dayjs lodash-es

# 表单管理
npm install formik yup

# CSS预处理器
npm install less

# 代码格式化工具
npm install eslint prettier eslint-config-prettier eslint-plugin-react --save-dev
```

#### 2.3 配置开发环境

创建`.env.development`文件：

```
# API基础URL - 开发环境
VITE_API_BASE_URL=http://192.168.2.9:6016/api
VITE_ENV=development
```

创建`.env.production`文件：

```
# API基础URL - 生产环境
VITE_API_BASE_URL=http://hpapi.bonnei.com:6016/api
VITE_ENV=production
```

配置`vite.config.js`：

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `@import "@/assets/styles/variables.less";`
      }
    }
  },
  server: {
    port: 6015,
    proxy: {
      '/api': {
        target: 'http://192.168.2.9:6016',
        changeOrigin: true,
        // 不需要rewrite，因为后端已有/api前缀
      }
    }
  }
});
```

#### 2.4 配置ESLint和Prettier

创建`.eslintrc.js`文件：

```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'prettier'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    // 自定义规则
    'react/prop-types': 'off', // 关闭Props类型检查，可以选择使用TypeScript代替
    'no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

创建`.prettierrc`文件：

```json
{
  "semi": true,
  "tabWidth": 2,
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

#### 2.5 配置Git仓库

```bash
# 初始化Git仓库
git init

# 创建.gitignore文件
cat > .gitignore << EOF
# Dependencies
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production
/dist
/build

# Environment
.env.local
.env.development.local
.env.test.local
.env.production.local

# Editor
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln

# Misc
.DS_Store
EOF

# 添加远程仓库
git remote add origin https://github.com/miaochi998/hpfront.git

# 提交初始代码
git add .
git commit -m "feat: 项目初始化"
git push -u origin main
```

#### 2.6 创建基本目录结构

```bash
# 创建基本目录结构
mkdir -p src/{api,assets,components,pages,router,store,utils}
mkdir -p src/assets/{images,icons,styles}
mkdir -p src/components/{common,business,layout}
mkdir -p src/pages/{login,admin,seller,dashboard}
mkdir -p src/store/slices
```

### 3. 前端核心框架搭建

#### 3.1 API请求封装

创建统一的请求工具（`src/utils/request.js`）：

```javascript
import axios from 'axios';
import { message } from 'antd';

// 从环境变量获取API基础URL
const baseURL = import.meta.env.VITE_API_BASE_URL;

// 创建axios实例
const request = axios.create({
  baseURL,
  timeout: 15000, // 15秒超时
});

// 获取本地存储中的token
const getToken = () => localStorage.getItem('token');

// 移除本地存储中的token
const removeToken = () => localStorage.removeItem('token');

// 请求拦截器 - 添加认证token
request.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = getToken();
    if (token) {
      // 设置Authorization请求头
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 处理常见错误
request.interceptors.response.use(
  (response) => {
    // 直接返回数据部分
    return response.data;
  },
  (error) => {
    // 处理错误情况
    if (error.response) {
      // 服务器返回了错误状态码
      const { status } = error.response;
      
      if (status === 401) {
        // 未授权 - 清除token并重定向到登录页
        removeToken();
        message.error('登录已过期，请重新登录');
        window.location.href = '/login';
      } else if (status === 403) {
        message.error('您没有权限执行此操作');
      } else if (status === 500) {
        message.error('服务器错误，请稍后再试');
      } else {
        // 其他错误
        const errorMsg = error.response.data?.message || '请求失败';
        message.error(errorMsg);
      }
    } else if (error.request) {
      // 请求发出但没有收到响应
      message.error('无法连接到服务器，请检查网络连接');
    } else {
      // 请求配置出错
      message.error('请求配置错误');
    }
    
    return Promise.reject(error);
  }
);

export { getToken, removeToken };
export default request;
```

#### 3.2 创建API模块

**认证相关API** (`src/api/auth.js`):

```javascript
import request from '../utils/request';

// 登录API
export const login = (data) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  });
};

// 登出API
export const logout = () => {
  return request({
    url: '/auth/logout',
    method: 'post'
  });
};

// 获取用户信息API
export const getUserProfile = () => {
  return request({
    url: '/auth/profile',
    method: 'get'
  });
};

// 更新用户信息API
export const updateUserProfile = (data) => {
  return request({
    url: '/auth/profile',
    method: 'put',
    data
  });
};
```

**产品相关API** (`src/api/product.js`):

```javascript
import request from '../utils/request';

// 获取产品列表
export const getProducts = (params) => {
  return request({
    url: '/pallet/products',
    method: 'get',
    params
  });
};

// 获取产品详情
export const getProductById = (id) => {
  return request({
    url: `/pallet/products/${id}`,
    method: 'get'
  });
};

// 创建产品
export const createProduct = (data) => {
  return request({
    url: '/pallet/products',
    method: 'post',
    data
  });
};

// 更新产品
export const updateProduct = (id, data) => {
  return request({
    url: `/pallet/products/${id}`,
    method: 'put',
    data
  });
};

// 删除产品
export const deleteProduct = (id) => {
  return request({
    url: `/pallet/products/${id}`,
    method: 'delete'
  });
};
```

#### 3.3 路由配置

创建路由配置（`src/router/index.jsx`）：

```javascript
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Spin } from 'antd';

// 懒加载包装器
const lazyLoad = (Component) => (
  <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>}>
    <Component />
  </Suspense>
);

// 懒加载组件
const LoginPage = lazy(() => import('../pages/login'));
const MainLayout = lazy(() => import('../components/layout/MainLayout'));
const Dashboard = lazy(() => import('../pages/dashboard'));

// 管理员页面
const BrandManagement = lazy(() => import('../pages/admin/BrandManagement'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));
const ProductManagement = lazy(() => import('../pages/admin/ProductManagement'));

// 销售员页面
const SellerProducts = lazy(() => import('../pages/seller/PalletManagement'));
const ProfileManagement = lazy(() => import('../pages/seller/ProfileManagement'));

// 创建路由
const router = createBrowserRouter([
  {
    path: '/login',
    element: lazyLoad(LoginPage),
  },
  {
    path: '/',
    element: lazyLoad(MainLayout),
    children: [
      { 
        index: true, 
        element: <Navigate to="/dashboard" replace /> 
      },
      { 
        path: 'dashboard', 
        element: lazyLoad(Dashboard) 
      },
      // 管理员路由
      {
        path: 'admin',
        children: [
          { 
            path: 'brands', 
            element: lazyLoad(BrandManagement) 
          },
          { 
            path: 'users', 
            element: lazyLoad(UserManagement) 
          },
          { 
            path: 'products', 
            element: lazyLoad(ProductManagement) 
          },
        ],
      },
      // 销售员路由
      {
        path: 'seller',
        children: [
          { 
            path: 'products', 
            element: lazyLoad(SellerProducts) 
          },
          { 
            path: 'profile', 
            element: lazyLoad(ProfileManagement) 
          },
        ],
      },
    ],
  },
  // 默认重定向
  {
    path: '*',
    element: <Navigate to="/" replace />
  },
]);

export default router;
```

#### 3.4 状态管理

创建Redux store（`src/store/index.js`）：

```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

// 创建Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    // 其他reducer将在后续添加
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
```

创建身份验证slice（`src/store/slices/authSlice.js`）：

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginApi, getUserProfile, logout as logoutApi } from '../../api/auth';
import { getToken, removeToken } from '../../utils/request';

// 登录异步action
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: '登录失败' });
    }
  }
);

// 获取用户信息异步action
export const getUserInfoAsync = createAsyncThunk(
  'auth/getUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserProfile();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: '获取用户信息失败' });
    }
  }
);

// 登出异步action
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: '登出失败' });
    }
  }
);

// 身份验证状态切片
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: getToken() || null,
    isAuthenticated: !!getToken(),
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    // 清除错误
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 登录
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        // 保存token到localStorage
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '登录失败';
      })
      // 获取用户信息
      .addCase(getUserInfoAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserInfoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '获取用户信息失败';
      })
      // 登出
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        // 移除localStorage中的token
        removeToken();
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
```

### 4. 权限管理实现

#### 4.1 创建权限验证组件

创建权限验证组件（`src/components/auth/PrivateRoute.jsx`）：

```javascript
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// 权限验证组件
const PrivateRoute = ({ element, requiredRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // 如果未登录，重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果需要特定角色但用户没有相应角色，重定向到无权限页面
  if (requiredRoles.length > 0) {
    const userRole = user?.is_admin ? 'admin' : 'seller';
    if (!requiredRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 验证通过，渲染原始组件
  return element;
};

export default PrivateRoute;
```

#### 4.2 修改主布局组件

创建主布局组件（`src/components/layout/MainLayout.jsx`）：

```javascript
import { useEffect } from 'react';
import { Layout, Menu, Dropdown, Avatar, Typography, Spin } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  TagOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { getUserInfoAsync, logoutAsync } from '../../store/slices/authSlice';
import PrivateRoute from '../auth/PrivateRoute';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [collapsed, setCollapsed] = useState(false);

  // 获取用户信息
  useEffect(() => {
    if (!user) {
      dispatch(getUserInfoAsync());
    }
  }, [dispatch, user]);

  // 判断当前用户角色
  const isAdmin = user?.is_admin;

  // 菜单项配置
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    // 管理员菜单
    ...(isAdmin
      ? [
          {
            key: '/admin/brands',
            icon: <TagOutlined />,
            label: '品牌管理',
          },
          {
            key: '/admin/users',
            icon: <UserOutlined />,
            label: '用户管理',
          },
          {
            key: '/admin/products',
            icon: <ShoppingOutlined />,
            label: '公司货盘',
          },
        ]
      : [
          // 销售员菜单
          {
            key: '/seller/products',
            icon: <ShoppingOutlined />,
            label: '我的货盘',
          },
          {
            key: '/seller/profile',
            icon: <UserOutlined />,
            label: '个人信息',
          },
        ]),
  ];

  // 处理菜单点击
  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  // 处理登出
  const handleLogout = () => {
    dispatch(logoutAsync()).then(() => {
      navigate('/login');
    });
  };

  // 用户菜单
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate('/seller/profile')}>
        个人信息
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  // 如果正在加载，显示加载中
  if (loading && !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider 
        width={200} 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        breakpoint="lg"
        theme="dark"
      >
        <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
          <Title level={4} style={{ color: '#fff', margin: 0 }}>
            {collapsed ? 'HP' : '货盘管理系统'}
          </Title>
        </div>
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[location.pathname]} 
          items={menuItems} 
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        {/* 头部 */}
        <Header style={{ padding: 0, background: '#fff', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ padding: '0 16px' }}>
            {collapsed ? (
              <MenuUnfoldOutlined onClick={() => setCollapsed(false)} style={{ fontSize: '18px' }} />
            ) : (
              <MenuFoldOutlined onClick={() => setCollapsed(true)} style={{ fontSize: '18px' }} />
            )}
          </div>
          <div style={{ paddingRight: 20 }}>
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar icon={<UserOutlined />} />
                <span style={{ marginLeft: 8 }}>{user?.name || '用户'}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        {/* 内容区 */}
        <Content style={{ margin: '16px', padding: 24, background: '#fff', minHeight: 280 }}>
          <PrivateRoute 
            element={<Outlet />} 
            requiredRoles={location.pathname.startsWith('/admin') ? ['admin'] : []}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
```

### 5. 开发与部署流程

#### 5.1 开发流程

1. **本地开发服务启动**
   ```bash
   # 进入前端项目目录
   cd /www/wwwroot/hpv2-front
   
   # 启动开发服务器
   npm run dev
   ```

2. **代码风格检查**
   ```bash
   # 运行ESLint检查
   npx eslint src --ext .js,.jsx
   
   # 使用Prettier格式化代码
   npx prettier --write "src/**/*.{js,jsx}"
   ```

3. **Git提交规范**

   遵循Conventional Commits规范进行代码提交：
   ```bash
   # 示例
   git commit -m "feat: 添加登录页面"
   git commit -m "fix: 修复表单提交验证问题"
   git commit -m "docs: 更新README文档"
   ```

4. **版本管理**

   采用语义化版本管理：
   - 主版本号：不兼容的API变更
   - 次版本号：向下兼容的功能新增
   - 修订号：向下兼容的问题修正

#### 5.2 构建与部署

1. **构建生产版本**
   ```bash
   # 构建生产版本
   npm run build
   ```

2. **部署到服务器**
   ```bash
   # 将构建产物部署到Nginx目录
   cp -r dist/* /www/wwwroot/hpv2-front/dist/
   ```

3. **Nginx配置**-------------已完成配置，SSL让书已添加，https://hpfront.bonnei.com:6015可正常访问，无需修改配置

   在宝塔面板中配置Nginx：
   - 网站域名：`hpfront.bonnei.com`
   - 端口：`6015`
   - 网站目录：`/www/wwwroot/hpv2-front/dist`
   - 添加SSL证书

   配置文件参考（`/www/server/panel/vhost/nginx/well-known/hpfront.bonnei.com.conf`）：
   ```nginx
   server {
     listen 6015 ssl;
     server_name hpfront.bonnei.com;
     root /www/wwwroot/hpv2-front/dist;
     index index.html;
     
     # SSL配置
     ssl_certificate /path/to/ssl/certificate.crt;
     ssl_certificate_key /path/to/ssl/private.key;
     
     # 单页应用路由处理
     location / {
       try_files $uri $uri/ /index.html;
       add_header Cache-Control "no-cache, no-store, must-revalidate";
     }
     
     # 静态资源缓存
     location /assets {
       expires 7d;
     }
   }
   ```

### 6. 多端开发准备

#### 6.1 响应式实现

使用Ant Design的响应式Grid系统：

```javascript
import { Row, Col } from 'antd';

// 响应式布局示例
const ResponsiveLayout = () => (
  <Row gutter={[16, 16]}>
    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
      内容块1
    </Col>
    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
      内容块2
    </Col>
    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
      内容块3
    </Col>
  </Row>
);
```

#### 6.2 自定义响应式Hook

创建响应式Hook（`src/hooks/useResponsive.js`）：

```javascript
import { useState, useEffect } from 'react';

// 响应式断点
const breakpoints = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1600,
};

// 响应式Hook
const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    xxl: false,
  });

  useEffect(() => {
    // 更新屏幕尺寸状态
    const updateScreenSize = () => {
      const width = window.innerWidth;
      setScreenSize({
        xs: width < breakpoints.xs,
        sm: width >= breakpoints.xs && width < breakpoints.sm,
        md: width >= breakpoints.sm && width < breakpoints.md,
        lg: width >= breakpoints.md && width < breakpoints.lg,
        xl: width >= breakpoints.lg && width < breakpoints.xl,
        xxl: width >= breakpoints.xl,
      });
    };

    // 初始调用一次
    updateScreenSize();

    // 添加resize事件监听
    window.addEventListener('resize', updateScreenSize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', updateScreenSize);
    };
  }, []);

  // 当前断点
  const currentBreakpoint = Object.keys(screenSize).find(key => screenSize[key]) || 'xs';

  // 是否是移动设备
  const isMobile = screenSize.xs || screenSize.sm;

  return {
    screenSize,
    isMobile,
    currentBreakpoint,
  };
};

export default useResponsive;
```

### 7. 开发规范

#### 7.1 命名规范

- **组件文件**：使用PascalCase（大驼峰），如`ProductTable.jsx`
- **非组件文件**：使用camelCase（小驼峰），如`request.js`
- **CSS类名**：使用kebab-case，如`product-card`，或BEM命名法，如`product-card__image--large`
- **常量**：使用UPPER_SNAKE_CASE，如`MAX_FILE_SIZE`
- **变量和函数**：使用camelCase，如`getUserData`
- **布尔变量**：使用`is`/`has`前缀，如`isLoading`

#### 7.2 文件组织

- **按功能组织**：相关功能放在同一目录
- **组件结构**：一个组件一个文件，复杂组件可以有子组件目录
- **路径别名**：使用`@`或`src`路径别名简化导入

#### 7.3 代码风格

- **使用ESLint和Prettier**：统一代码风格
- **注释规范**：为复杂逻辑添加详细注释
- **避免魔法数字**：使用命名常量替代硬编码值
- **使用函数组件和Hooks**：优先使用React函数组件和Hooks

### 8. 总结与后续规划

#### 8.1 时间规划

1. **初始阶段**（1-2周）
   - 环境搭建
   - 核心框架开发
   - 基础组件实现

2. **功能开发阶段**（4-6周）
   - 登录与认证
   - 管理员功能
   - 销售员功能
   - 货盘管理

3. **优化阶段**（2周）
   - 性能优化
   - 响应式适配
   - 测试与修复

4. **移动适配阶段**（2-3周）
   - 移动端UI调整
   - 触控体验优化
   - 跨设备测试

#### 8.2 风险管理

1. **跨域问题**
   - 确保后端CORS配置正确
   - 使用开发环境代理解决跨域问题

2. **认证安全**
   - 使用HTTPS保证传输安全
   - 实施JWT令牌安全管理

3. **性能优化**
   - 实施代码分割和懒加载
   - 优化组件渲染性能
   - 减少不必要的网络请求

#### 8.3 扩展方案

在完成基础PC端开发后，可以考虑：

1. **移动端适配**：优化移动设备UI体验
2. **小程序开发**：利用现有业务逻辑，开发微信小程序版本
3. **功能扩展**：根据用户反馈添加新功能
4. **性能优化**：进一步优化加载速度和响应性

### 9. 结论

本方案通过完全独立的前端开发模式，在不影响现有后端的情况下，可以高效地构建现代化的前端应用。通过使用React、Ant Design和Redux等成熟技术栈，结合清晰的项目结构和开发规范，可以确保项目的可维护性和可扩展性。

随着基础功能的完成，可以逐步扩展到移动端和小程序，满足不同用户的需求，实现多端一体化的货盘管理系统。 