# 帮你品牌货盘管理系统 - 前端开发说明文档

## 1. 项目概述

### 1.1 项目背景
帮你品牌货盘管理系统是一个专为企业设计的产品管理平台，用于管理公司产品信息、销售员管理、品牌管理等功能。系统将首先开发PC端，随后开发手机端，最终扩展到微信小程序。

### 1.2 开发顺序
1. PC端开发（优先级最高）
2. 手机端适配（次要优先级）
3. 微信小程序开发（后续计划）

### 1.3 项目目标
- 提供稳定、高效的产品信息管理
- 实现简洁美观的用户界面
- 确保前端代码的可维护性和可扩展性
- 兼顾未来多端（PC、手机、小程序）的开发需求

## 2. 技术架构

### 2.1 技术栈选择

#### 核心框架与工具
- **框架**：React 18
- **构建工具**：Create React App（易上手、配置简单）
- **开发语言**：JavaScript + 部分TypeScript
- **状态管理**：React Context（简单状态）+ Redux Toolkit（复杂状态）
- **路由管理**：React Router 6
- **CSS预处理器**：Less

#### UI组件库
- **主组件库**：Ant Design 5.x
- **响应式设计**：Ant Design Grid System
- **表格组件**：Ant Design Table + 自定义优化
- **图表库**：Echarts (按需引入)

#### 工具库
- **HTTP请求**：Axios
- **数据处理**：Lodash（按需引入）
- **日期处理**：Day.js
- **表单验证**：Formik + Yup

### 2.2 多端开发考虑

为了未来能够平滑过渡到手机端和小程序开发，采取以下策略：

#### 可复用层设计
- **数据层**：API请求、数据处理逻辑独立封装，便于多端复用
- **工具层**：通用工具函数采用平台无关的实现方式
- **配置层**：使用环境变量和配置文件管理不同环境和平台的差异

#### 为小程序预留的迁移路径
- 组件设计遵循职责单一原则，便于未来迁移到小程序
- 避免使用Web特有的API，必要时进行平台适配层封装
- 资源文件（图标、图片等）组织结构便于多端共享

## 3. 项目结构

### 3.1 目录结构

```
frontend/                      # 前端根目录
├── public/                    # 静态资源
│   ├── favicon.ico            # 网站图标
│   ├── index.html             # HTML模板
│   └── static/                # 静态资源文件
│       ├── images/            # 图片资源
│       └── fonts/             # 字体资源
├── src/                       # 源代码
│   ├── api/                   # API请求封装
│   │   ├── auth.js            # 认证相关接口
│   │   ├── product.js         # 产品相关接口
│   │   ├── brand.js           # 品牌相关接口
│   │   ├── user.js            # 用户相关接口
│   │   └── index.js           # API导出汇总
│   ├── assets/                # 项目资源
│   │   ├── images/            # 图片资源
│   │   ├── icons/             # 图标资源
│   │   └── styles/            # 全局样式
│   │       ├── variables.less  # 样式变量
│   │       ├── mixins.less     # 样式混合
│   │       └── global.less     # 全局样式
│   ├── components/            # 公共组件
│   │   ├── common/            # 通用组件
│   │   │   ├── Button/        # 按钮组件
│   │   │   ├── Modal/         # 弹窗组件
│   │   │   └── Upload/        # 上传组件
│   │   ├── business/          # 业务组件
│   │   │   ├── ProductForm/   # 产品表单
│   │   │   ├── PriceTier/     # 价格档位组件
│   │   │   └── UserCard/      # 用户信息卡片
│   │   └── layout/            # 布局组件
│   │       ├── MainLayout/    # 主布局
│   │       ├── Sidebar/       # 侧边栏
│   │       └── Header/        # 顶部导航
│   ├── contexts/              # React上下文
│   │   ├── AuthContext.js     # 认证上下文
│   │   └── ThemeContext.js    # 主题上下文
│   ├── hooks/                 # 自定义Hook
│   │   ├── useAuth.js         # 认证Hook
│   │   ├── useForm.js         # 表单Hook
│   │   └── useResponsive.js   # 响应式Hook
│   ├── pages/                 # 页面组件
│   │   ├── login/             # 登录页面
│   │   ├── admin/             # 管理员页面
│   │   │   ├── BrandManagement/  # 品牌管理
│   │   │   ├── UserManagement/   # 用户管理
│   │   │   └── ProductManagement/  # 产品管理
│   │   └── seller/            # 销售员页面
│   │       ├── PalletManagement/  # 货盘管理
│   │       └── ProfileManagement/  # 个人信息管理
│   ├── store/                 # Redux状态管理
│   │   ├── slices/            # Redux切片
│   │   │   ├── authSlice.js   # 认证状态
│   │   │   ├── productSlice.js  # 产品状态
│   │   │   └── userSlice.js   # 用户状态
│   │   ├── actions/           # Redux行为
│   │   └── index.js           # Store配置
│   ├── utils/                 # 工具函数
│   │   ├── request.js         # 请求工具
│   │   ├── storage.js         # 存储工具
│   │   ├── format.js          # 格式化工具
│   │   └── validation.js      # 验证工具
│   ├── constants/             # 常量定义
│   │   ├── api.js             # API常量
│   │   └── enums.js           # 枚举常量
│   ├── config/                # 配置文件
│   │   ├── routes.js          # 路由配置
│   │   └── settings.js        # 全局设置
│   ├── App.js                 # 应用入口
│   ├── index.js               # 渲染入口
│   └── setupTests.js          # 测试配置
├── .env                       # 环境变量
├── .env.development           # 开发环境变量
├── .env.production            # 生产环境变量
├── package.json               # 依赖配置
├── jsconfig.json              # JS配置
├── .eslintrc.js               # ESLint配置
├── .prettierrc                # Prettier配置
└── README.md                  # 项目说明
```

### 3.2 核心模块说明

#### 授权与认证模块
- 登录页面与认证逻辑
- 权限控制与路由守卫
- Token管理（存储、刷新、失效处理）

#### 布局与导航模块
- 响应式主布局组件
- 可折叠侧边导航栏
- 顶部导航与用户信息展示

#### 基础数据管理模块
- 品牌管理
- 用户管理（管理员、销售员）
- 个人信息管理

#### 产品管理模块
- 产品列表与CRUD操作
- 产品详情与多级价格管理
- 文件上传（产品图片、素材包）

#### 货盘分享模块
- 货盘分享链接生成
- 分享页面预览
- 二维码生成与下载 

## 4. 开发规范

### 4.1 命名规范

#### 文件与目录命名
- **组件文件**：使用PascalCase（大驼峰），如`ProductTable.js`
- **非组件文件**：使用camelCase（小驼峰），如`formatDate.js`
- **样式文件**：与组件同名，后缀为`.module.less`，如`ProductTable.module.less`
- **测试文件**：与测试目标同名，后缀为`.test.js`，如`ProductTable.test.js`

#### 变量与函数命名
- **普通变量**：使用camelCase，如`productList`
- **常量**：使用UPPER_SNAKE_CASE，如`MAX_FILE_SIZE`
- **布尔变量**：使用`is`/`has`/`can`前缀，如`isLoading`、`hasError`
- **事件处理函数**：使用`handle`前缀，如`handleSubmit`
- **异步函数**：使用`async`前缀或`fetch`/`get`/`update`等动词，如`fetchUserData`

#### CSS类名命名
- 使用BEM命名规范（Block__Element--Modifier）
- 例如：`.product-card__image--large`

### 4.2 代码风格

#### JavaScript/React
- 使用函数组件和Hooks，避免使用类组件
- 使用解构赋值获取props和state
- 组件props使用propTypes或TypeScript类型进行类型检查
- 遵循React最佳实践，如列表项使用key属性

#### CSS/Less
- 优先使用CSS Modules隔离样式
- 使用Less变量和混合简化样式代码
- 遵循移动优先的响应式设计原则
- 避免使用!important

#### 注释规范
- 组件文件顶部添加组件功能描述
- 复杂逻辑需添加注释说明
- API函数添加参数和返回值说明
- 使用JSDoc风格的注释

### 4.3 Git提交规范

- 使用语义化的提交消息格式：`<type>(<scope>): <subject>`
- 类型包括：feat(新功能)、fix(修复)、docs(文档)、style(格式)、refactor(重构)等
- 每个提交应专注于单一变更
- 避免提交未使用或注释的代码 

## 5. 组件设计指南

### 5.1 组件分类

#### 基础组件
封装Ant Design组件，统一样式和行为：
- Button（按钮）
- Input（输入框）
- Modal（弹窗）
- Table（表格）
- Form（表单）
- Upload（上传）

#### 业务组件
根据业务需求封装的复合组件：
- ProductForm（产品表单）
- PriceTierTable（价格档位表格）
- BrandSelector（品牌选择器）
- UserTable（用户表格）
- FileUploader（文件上传器）

#### 布局组件
构建页面布局的组件：
- MainLayout（主布局）
- Sidebar（侧边栏）
- Header（页头）
- PageContainer（页面容器）
- Card（卡片容器）

### 5.2 组件设计原则

#### 单一职责
- 每个组件只负责一个功能点
- 复杂组件拆分为多个小组件

#### 可组合性
- 组件设计为可组合的小单元
- 使用组合而非继承扩展组件功能

#### 可测试性
- 组件逻辑与UI分离
- 避免组件内部直接操作DOM

#### 可重用性
- 抽象通用逻辑到自定义Hook
- 将可重用的样式抽取为公共样式类 

## 6. 响应式设计指南

### 6.1 断点设计

采用Ant Design的响应式断点：
- xs: < 576px（手机竖屏）
- sm: >= 576px（手机横屏）
- md: >= 768px（平板）
- lg: >= 992px（小桌面）
- xl: >= 1200px（中等桌面）
- xxl: >= 1600px（大桌面）

### 6.2 布局策略

#### PC优先的自适应布局
- 初始设计基于PC端布局
- 使用媒体查询适配小屏幕设备

#### 关键布局组件自适应方案
- **侧边导航**：PC端默认展开，小屏幕折叠或弹出式
- **表格组件**：PC端正常表格，小屏幕转为卡片式布局
- **表单布局**：PC端多列布局，小屏幕单列布局
- **按钮组**：小屏幕上使用更大的触控区域

### 6.3 响应式实现技术

- 使用Ant Design的Grid系统（Row, Col组件）
- 使用CSS媒体查询处理特定样式
- 使用自定义Hook `useResponsive` 处理响应式逻辑
- 使用相对单位（rem, em, %）而非固定像素值 

## 7. 状态管理指南

### 7.1 状态管理策略

采用"分层"状态管理策略：
- **组件内状态**：使用`useState`和`useReducer`管理组件内部状态
- **跨组件状态**：使用Context API管理中等复杂度的共享状态
- **全局状态**：使用Redux管理复杂的应用级状态

### 7.2 Redux使用指南

- 使用Redux Toolkit简化Redux代码
- 按领域划分状态切片（Slice）
- 遵循Redux不可变性原则
- 使用异步Thunk处理API请求
- 使用选择器（Selectors）优化渲染性能

### 7.3 Context使用指南

- 创建合理粒度的Context
- 避免Context值频繁变化
- 使用memo优化Context消费组件
- 配合useReducer管理复杂状态 

## 8. API请求处理

### 8.1 请求封装

使用Axios封装统一的请求处理：
```javascript
// utils/request.js
import axios from 'axios';
import { message } from 'antd';
import { getToken, removeToken } from './auth';

const request = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data } = response;
    // 统一处理业务层成功/错误情况
    if (data.code === 200) {
      return data.data;
    }
    message.error(data.message || '请求出错');
    return Promise.reject(new Error(data.message || '请求出错'));
  },
  (error) => {
    // 统一处理HTTP错误
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // 未登录或Token失效
        removeToken();
        window.location.href = '/login';
      } else {
        message.error(error.response.data?.message || '请求出错');
      }
    } else {
      message.error('网络错误，请检查网络连接');
    }
    return Promise.reject(error);
  }
);

export default request;
```

### 8.2 API模块组织

```javascript
// api/product.js
import request from '../utils/request';

export function getProductList(params) {
  return request({
    url: '/api/pallet/products',
    method: 'get',
    params,
  });
}

export function addProduct(data) {
  return request({
    url: '/api/pallet/products',
    method: 'post',
    data,
  });
}

export function updateProduct(id, data) {
  return request({
    url: `/api/pallet/products/${id}`,
    method: 'put',
    data,
  });
}

export function deleteProduct(id) {
  return request({
    url: `/api/pallet/products/${id}`,
    method: 'delete',
  });
}
```

### 8.3 数据请求Hook

```javascript
// hooks/useProducts.js
import { useState, useEffect } from 'react';
import { getProductList } from '../api/product';

export function useProducts(params = {}) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState(params);

  const fetchProducts = async (params) => {
    setLoading(true);
    try {
      const { list, total } = await getProductList(params);
      setProducts(list);
      setPagination({
        ...pagination,
        total,
      });
    } catch (error) {
      console.error('获取产品列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts({
      page: pagination.current,
      size: pagination.pageSize,
      ...filters,
    });
  }, [pagination.current, pagination.pageSize, filters]);

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination({
      ...pagination,
    });
    setFilters({
      ...params,
      ...filters,
      sort_field: sorter.field,
      sort_order: sorter.order === 'ascend' ? 'asc' : 'desc',
    });
  };

  return {
    loading,
    products,
    pagination,
    filters,
    setFilters,
    handleTableChange,
    refresh: () => fetchProducts({
      page: pagination.current,
      size: pagination.pageSize,
      ...filters,
    }),
  };
}
``` 

## 9. 路由与权限管理

### 9.1 路由配置

```javascript
// config/routes.js
import { lazy } from 'react';
import MainLayout from '../components/layout/MainLayout';
import LoginPage from '../pages/login';

// 懒加载路由组件
const BrandManagement = lazy(() => import('../pages/admin/BrandManagement'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));
const ProductManagement = lazy(() => import('../pages/admin/ProductManagement'));
const SellerProductManagement = lazy(() => import('../pages/seller/PalletManagement'));
const ProfileManagement = lazy(() => import('../pages/seller/ProfileManagement'));
const RecycleBin = lazy(() => import('../pages/common/RecycleBin'));

const routes = [
  {
    path: '/login',
    element: <LoginPage />,
    auth: false,
  },
  {
    path: '/',
    element: <MainLayout />,
    auth: true,
    children: [
      {
        path: 'admin',
        roles: ['admin'],
        children: [
          { path: 'brands', element: <BrandManagement /> },
          { path: 'users', element: <UserManagement /> },
          { path: 'products', element: <ProductManagement /> },
          { path: 'recycle', element: <RecycleBin /> },
        ],
      },
      {
        path: 'seller',
        roles: ['seller'],
        children: [
          { path: 'products', element: <SellerProductManagement /> },
          { path: 'profile', element: <ProfileManagement /> },
          { path: 'recycle', element: <RecycleBin /> },
        ],
      },
    ],
  },
];

export default routes;
```

### 9.2 权限控制

```javascript
// components/auth/PrivateRoute.js
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

function PrivateRoute({ children, roles = [] }) {
  const { isAuthenticated, userInfo } = useContext(AuthContext);
  const location = useLocation();

  // 未登录重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 无权限访问重定向到403页面
  const isAdmin = userInfo?.is_admin;
  const userRole = isAdmin ? 'admin' : 'seller';
  
  if (roles.length > 0 && !roles.includes(userRole)) {
    return <Navigate to="/403" replace />;
  }

  // 有权限则渲染子组件
  return children;
}

export default PrivateRoute;
``` 

## 10. 表单处理指南

### 10.1 表单封装

```javascript
// components/common/Form/DynamicForm.js
import { Form, Button, Space } from 'antd';
import FormBuilder from './FormBuilder';

const DynamicForm = ({
  formConfig,
  initialValues = {},
  onFinish,
  onCancel,
  submitButtonText = '提交',
  cancelButtonText = '取消',
  loading = false,
}) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <FormBuilder formConfig={formConfig} form={form} />
      
      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            {submitButtonText}
          </Button>
          {onCancel && (
            <Button onClick={onCancel}>
              {cancelButtonText}
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
};

export default DynamicForm;
```

### 10.2 表单构建器

```javascript
// components/common/Form/FormBuilder.js
import { Form, Input, Select, InputNumber, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const FormBuilder = ({ formConfig, form }) => {
  const renderFormItem = (item) => {
    const { type, name, label, rules, options, ...rest } = item;

    switch (type) {
      case 'input':
        return <Input {...rest} />;
      case 'textarea':
        return <Input.TextArea {...rest} />;
      case 'number':
        return <InputNumber style={{ width: '100%' }} {...rest} />;
      case 'select':
        return (
          <Select {...rest}>
            {options.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        );
      case 'upload':
        return (
          <Upload {...rest}>
            <Button icon={<UploadOutlined />}>{label}</Button>
          </Upload>
        );
      default:
        return <Input {...rest} />;
    }
  };

  return (
    <>
      {formConfig.map((item) => (
        <Form.Item
          key={item.name}
          name={item.name}
          label={item.label}
          rules={item.rules}
        >
          {renderFormItem(item)}
        </Form.Item>
      ))}
    </>
  );
};

export default FormBuilder;
```

### 10.3 表单验证

```javascript
// utils/validation.js
// 常用验证规则
export const validationRules = {
  required: (message = '此字段为必填项') => ({
    required: true,
    message,
  }),
  
  max: (max, message = `不能超过${max}个字符`) => ({
    max,
    message,
  }),
  
  min: (min, message = `不能少于${min}个字符`) => ({
    min,
    message,
  }),
  
  pattern: (pattern, message) => ({
    pattern,
    message,
  }),
  
  email: () => ({
    type: 'email',
    message: '请输入正确的邮箱格式',
  }),
  
  phone: () => ({
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入正确的手机号',
  }),
};
```

## 11. 文件上传处理

### 11.1 图片上传组件

```javascript
// components/common/Upload/ImageUpload.js
import { useState } from 'react';
import { Upload, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { uploadImage } from '../../../api/upload';

const ImageUpload = ({ 
  value, 
  onChange, 
  limit = 1, 
  maxSize = 20,  // MB
  description = '图片最大不超过20MB，支持JPG、PNG格式，建议尺寸800×800像素' 
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState(value ? [].concat(value) : []);
  const [uploading, setUploading] = useState(false);

  const handlePreview = async (file) => {
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
    const urls = fileList.map(file => file.url || (file.response && file.response.url)).filter(Boolean);
    onChange && onChange(limit === 1 ? urls[0] : urls);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传JPG/PNG格式的图片!');
      return false;
    }
    
    const isLessThanMaxSize = file.size / 1024 / 1024 < maxSize;
    if (!isLessThanMaxSize) {
      message.error(`图片大小不能超过${maxSize}MB!`);
      return false;
    }
    
    return true;
  };

  const customRequest = async ({ file, onProgress, onSuccess, onError }) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entity_type', 'PRODUCT');
      
      const res = await uploadImage(formData, {
        onUploadProgress: e => {
          onProgress({ percent: (e.loaded / e.total) * 100 });
        }
      });
      
      onSuccess(res);
      message.success('上传成功');
    } catch (error) {
      onError(error);
      message.error('上传失败');
    } finally {
      setUploading(false);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        customRequest={customRequest}
        disabled={uploading}
      >
        {fileList.length >= limit ? null : uploadButton}
      </Upload>
      
      <div style={{ marginTop: 8, color: '#888' }}>
        {description}
      </div>
      
      <Modal
        visible={previewVisible}
        title="图片预览"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="预览图片" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default ImageUpload;
``` 

## 12. 总结与后续规划

### 12.1 开发优先级

根据项目的开发顺序规划，我们应当优先完成以下任务：

1. **核心布局与组件**
   - 主布局框架搭建
   - 响应式侧边导航
   - 基础UI组件封装

2. **登录与认证系统**
   - 登录页面开发
   - 权限验证机制
   - 路由守卫实现

3. **关键业务页面**
   - 管理员端：品牌管理、产品管理、用户管理
   - 销售员端：货盘管理、个人信息管理
   - 共享功能：回收站管理

4. **手机端适配**
   - 已有页面的响应式调整
   - 移动特定交互优化
   - 触控体验优化

### 12.2 扩展规划

为未来的小程序开发做准备，应当注意：

1. **组件抽象层**
   - 开发时考虑逻辑与UI的分离
   - 保持数据处理逻辑的平台无关性

2. **资源管理**
   - 图片资源使用统一的命名和组织方式
   - 配置文件支持多环境、多平台

3. **API请求封装**
   - 设计适配器模式的请求封装
   - 便于未来替换为小程序API

### 12.3 开发建议

1. 采用渐进式开发策略，先实现核心功能，再增加高级特性
2. 使用组件驱动开发方法，自下而上构建系统
3. 定期进行代码审查和重构，确保质量
4. 保持组件文档和示例的更新，方便团队协作

## 结论

本文档提供了帮你品牌货盘管理系统前端开发的技术框架、项目结构和开发规范。通过遵循这些指南，可以确保项目开发的一致性、可维护性和可扩展性。

在实际开发过程中，应根据业务需求和技术变化灵活调整，但核心原则应保持不变：代码质量、用户体验和未来可扩展性。

随着项目的推进，本文档将继续更新，以反映最新的开发实践和经验总结。 