# 登录页面开发规范

## 1. 组件概述

登录页面是用户访问系统的第一步，提供身份验证功能，确保只有授权用户能够访问系统。登录页面设计简洁直观，同时提供品牌展示和用户友好的错误提示。

### 1.1 组件路径

- 代码路径：`src/pages/login/Login.js`
- 样式路径：`src/pages/login/Login.module.less`
- 路由路径：`/login`

### 1.2 功能特性

- 用户名/密码登录表单
- 记住我功能
- 错误提示与验证
- 响应式布局，适配不同屏幕尺寸
- 自动重定向（已登录用户）
- 登录状态保持

## 2. 页面结构

### 2.1 组件树

```
Login
├── LoginContainer           // 登录页面容器
│   ├── LoginBanner          // 左侧品牌展示区
│   │   ├── BrandLogo        // 品牌Logo
│   │   └── SystemTitle      // 系统标题与副标题
│   └── LoginPanel           // 右侧登录表单区
│       ├── LoginHeader      // 登录表单标题
│       ├── LoginForm        // 登录表单
│       │   ├── UsernameField    // 用户名输入框
│       │   ├── PasswordField    // 密码输入框
│       │   ├── RememberMeOption // 记住我选项
│       │   └── LoginButton      // 登录按钮
│       └── ErrorMessage     // 错误信息显示区
└── BackgroundLayer          // 背景层（可选装饰图案）
```

### 2.2 组件职责

#### LoginContainer（主容器）
- 控制整体登录页面布局
- 响应式调整左右两栏比例

#### LoginBanner（品牌展示区）
- 展示系统品牌Logo和系统名称
- 可选的品牌宣传语或系统描述
- 在移动端可隐藏或简化显示

#### LoginPanel（登录表单区）
- 展示登录表单和相关操作
- 处理表单验证与提交逻辑

#### LoginForm（登录表单）
- 收集用户登录凭据
- 进行客户端表单验证
- 处理登录请求提交

#### ErrorMessage（错误消息）
- 显示登录失败信息
- 提供用户友好的错误提示

## 3. 数据模型与状态管理

### 3.1 数据模型

```typescript
// 登录表单数据模型
interface LoginFormData {
  username: string;       // 用户名
  password: string;       // 密码
  remember: boolean;      // 记住我选项
}

// 用户认证响应数据模型
interface AuthResponse {
  token: string;          // JWT访问令牌
  refresh_token: string;  // 刷新令牌
  expires_in: number;     // 令牌过期时间(秒)
  user_info: {
    id: number;           // 用户ID
    username: string;     // 用户名
    name: string;         // 姓名
    phone: string;        // 电话
    email: string;        // 邮箱
    status: string;       // 状态(ACTIVE/INACTIVE)
    company: string;      // 所属公司
    is_admin: boolean;    // 是否管理员
    avatar: string;       // 头像URL
    wechat_qrcode: string; // 微信二维码URL
    last_login_time: string; // 最后登录时间
  }
}

// 登录状态数据模型
interface LoginState {
  isLoading: boolean;     // 登录请求加载状态
  error: string | null;   // 错误信息
  isAuthenticated: boolean; // 是否已认证
}
```

### 3.2 状态管理

登录组件使用React hooks和Redux管理状态：

```typescript
// 使用Redux管理登录状态
const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginFormData, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 认证切片定义
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoading: false,
    error: null,
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token')
  },
  reducers: {
    // 同步reducer定义
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user_info;
        // 更新最后登录时间
        state.user.last_login_time = new Date().toISOString();
        // 存储token到localStorage（如果记住我选项被选中）
        if (action.meta.arg.remember) {
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || '登录失败，请重试';
      });
  }
});
```

## 4. 表单验证

### 4.1 验证规则

使用Formik和Yup进行表单验证：

```typescript
// 登录表单验证schema
const loginValidationSchema = Yup.object().shape({
  username: Yup.string()
    .required('请输入用户名')
    .min(4, '用户名至少4个字符'),
  password: Yup.string()
    .required('请输入密码')
    .min(6, '密码至少6个字符')
});
```

### 4.2 错误处理

```typescript
// 错误处理逻辑
const handleLoginError = (error) => {
  // 处理不同类型的错误
  switch (error.code) {
    case 'auth/invalid-credentials':
      return '用户名或密码错误';
    case 'auth/user-disabled':
      return '该账户已被禁用';
    case 'auth/too-many-requests':
      return '登录尝试次数过多，请稍后再试';
    default:
      return '登录失败，请稍后重试';
  }
};
```

## 5. UI组件实现

### 5.1 登录页面主组件

```jsx
import React, { useEffect } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginAsync } from '../../store/authSlice';
import styles from './Login.module.less';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, isAuthenticated } = useSelector(state => state.auth);
  
  // 表单引用
  const [form] = Form.useForm();
  
  // 已登录用户重定向
  useEffect(() => {
    if (isAuthenticated) {
      const { from } = location.state || { from: { pathname: '/dashboard' } };
      navigate(from);
    }
  }, [isAuthenticated, navigate, location]);
  
  // 表单提交
  const onFinish = (values) => {
    dispatch(loginAsync(values));
  };
  
  // 显示错误消息
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBanner}>
        <div className={styles.brandLogo}>
          <img src="/static/images/logo.png" alt="品牌Logo" />
        </div>
        <div className={styles.systemTitle}>
          <h1>帮你品牌货盘管理系统</h1>
          <p>高效管理您的品牌与产品</p>
        </div>
      </div>
      
      <div className={styles.loginPanel}>
        <div className={styles.loginHeader}>
          <h2>用户登录</h2>
        </div>
        
        <Form
          form={form}
          name="login"
          className={styles.loginForm}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="密码"
              size="large"
            />
          </Form.Item>
          
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className={styles.loginButton}
              loading={isLoading}
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
```

### 5.2 样式实现

```less
// Login.module.less
@import '../../assets/styles/variables.less';

.loginContainer {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: @background-color-light;
  overflow: hidden;
  
  @media (max-width: @screen-md) {
    flex-direction: column;
  }
}

.loginBanner {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: @primary-color;
  color: white;
  padding: 40px;
  
  @media (max-width: @screen-md) {
    flex: 0 0 30%;
    padding: 20px;
  }
  
  @media (max-width: @screen-sm) {
    display: none;
  }
}

.brandLogo {
  margin-bottom: 30px;
  
  img {
    height: 100px;
    width: auto;
  }
}

.systemTitle {
  text-align: center;
  
  h1 {
    font-size: 28px;
    margin-bottom: 10px;
    color: white;
  }
  
  p {
    font-size: 16px;
    opacity: 0.8;
  }
}

.loginPanel {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  max-width: 450px;
  margin: 0 auto;
  
  @media (max-width: @screen-md) {
    flex: 1;
    max-width: 100%;
  }
}

.loginHeader {
  margin-bottom: 40px;
  text-align: center;
  
  h2 {
    font-size: 24px;
    font-weight: 500;
    color: @heading-color;
  }
}

.loginForm {
  width: 100%;
}

.loginButton {
  height: 40px;
  font-size: 16px;
}

.errorMessage {
  margin-top: 16px;
  padding: 8px 12px;
  color: @error-color;
  background-color: fade(@error-color, 10%);
  border-radius: 4px;
  text-align: center;
}
```

## 6. API接口

### 6.1 登录接口

```typescript
// src/api/auth.js
import request from '../utils/request';

export const login = (data) => {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  });
};

export const logout = () => {
  return request({
    url: '/api/auth/logout',
    method: 'post'
  });
};

export const refreshToken = (data) => {
  return request({
    url: '/api/auth/refresh',
    method: 'post',
    data
  });
};

export const getProfile = () => {
  return request({
    url: '/api/auth/profile',
    method: 'get'
  });
};
```

### 6.2 接口参数与响应

**登录请求参数：**

```json
{
  "username": "admin",
  "password": "password123"
}
```

**登录成功响应：**

```json
{
  "code": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 86400,
    "user_info": {
      "id": 1,
      "username": "admin",
      "name": "管理员",
      "company": "XX有限公司",
      "is_admin": true,
      "avatar": "/uploads/avatars/admin.jpg",
      "wechat_qrcode": "/uploads/qrcodes/admin.jpg"
    }
  }
}
```

**登录失败响应：**

```json
{
  "code": 401,
  "message": "用户名或密码错误"
}
```

**其他可能的错误响应：**

```json
{
  "code": 403,
  "message": "账户已锁定，请30分钟后重试"
}
```

```json
{
  "code": 400,
  "message": "请求参数不完整"
}
```

## 7. 交互规范

### 7.1 表单交互

1. **输入框焦点**：
   - 页面加载时自动聚焦用户名输入框
   - Tab键可在各输入项间切换
   - 回车键可直接提交表单

2. **表单验证**：
   - 输入框失去焦点时进行验证
   - 提交时再次验证所有字段
   - 表单验证错误时显示红色提示文字

3. **提交按钮**：
   - 点击后显示加载状态（按钮内显示加载图标）
   - 登录成功后自动跳转到对应页面
   - 登录失败显示错误信息

### 7.2 错误处理

1. **验证错误**：
   - 在相应输入框下方显示红色错误提示
   - 错误提示清晰明确，指导用户如何修正

2. **登录失败**：
   - 在表单下方显示错误信息区域
   - 不同类型的错误显示不同的提示信息
   - 连续多次登录失败可能触发锁定机制

### 7.3 用户体验

1. **记住我功能**：
   - 勾选后，用户Token会存储在LocalStorage
   - 未勾选时，Token仅在会话期间有效

2. **自动登录**：
   - 检测到有效Token时自动登录并跳转
   - 跳转到用户之前尝试访问的页面或默认页面

3. **加载状态**：
   - 登录过程中显示加载指示器
   - 避免多次点击提交按钮

## 8. 响应式设计

### 8.1 桌面端（>= 992px）

- 左右两栏布局，左侧品牌展示区，右侧登录表单
- 左右各占50%宽度
- 完整显示品牌Logo和系统标题

### 8.2 平板端（768px - 991px）

- 保持左右两栏布局
- 左侧品牌展示区缩小比例
- 登录表单占据更大空间

### 8.3 移动端（< 768px）

- 隐藏左侧品牌展示区
- 登录表单占据全屏
- 简化UI元素，确保表单易于填写
- 调整输入框大小，适应触摸输入

## 9. 测试要点

### 9.1 单元测试

- 测试表单验证逻辑
- 测试错误处理逻辑
- 测试自动重定向逻辑

```javascript
// 示例测试用例
test('应该显示错误信息当用户名为空', async () => {
  render(<Login />);
  fireEvent.click(screen.getByText('登录'));
  expect(await screen.findByText('请输入用户名')).toBeInTheDocument();
});
```

### 9.2 集成测试

- 测试登录流程完整性
- 测试与后端API交互
- 测试权限和路由重定向

### 9.3 兼容性测试

- 测试主流浏览器兼容性
- 测试不同设备和屏幕尺寸
- 测试不同网络条件下的表现

## 10. 安全考虑

1. **密码处理**：
   - 密码在传输前加密
   - 不在前端存储明文密码
   - 使用HTTPS确保传输安全

2. **Token管理**：
   - 使用JWT保存登录状态
   - Token设置适当的过期时间
   - 敏感操作可能需要重新验证

3. **防护措施**：
   - 防止XSS攻击（使用React内置XSS防护）
   - 防止CSRF攻击（使用CSRF令牌）
   - 限制登录尝试次数，防止暴力破解

## 11. 注意事项

1. **表单性能优化**：
   - 使用受控组件，但注意过度渲染
   - 大型表单考虑使用Formik的优化策略

2. **错误处理**：
   - 确保所有API错误都有合适的用户反馈
   - 网络错误处理（离线状态提示）

3. **可访问性**：
   - 确保表单可通过键盘操作
   - 提供适当的ARIA标签
   - 错误消息应对屏幕阅读器友好 