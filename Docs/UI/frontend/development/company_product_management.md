# 货盘管理页面原型说明

## 页面概述

货盘管理页面是系统的核心功能之一，用于管理产品信息。根据用户角色和权限的不同，页面会展示不同的货盘内容：
- 管理员用户：只能管理公司总货盘（`owner_type='COMPANY'`）
- 销售员用户：只能管理个人货盘（`owner_type='SELLER'`且`owner_id`等于当前用户ID）

用户可通过此页面进行产品的添加、编辑、删除等操作，以及管理产品图片、素材包和多级价格档位等内容。

## 页面布局

整体分为两部分：
- **左侧**：系统导航侧边栏（窄导航模式）
- **右侧**：货盘管理主内容区

## 页面元素

### 左侧导航侧边栏

1. **系统Logo**：
   - 顶部显示"帮你"品牌简化标识
   
2. **功能导航图标**：
   - 垂直排列的功能导航图标
   - "货盘管理"图标处于选中状态
   
3. **用户头像**：
   - 侧边栏底部显示当前登录用户的头像
   
4. **退出系统**：
   - 电源图标按钮，用于退出系统

### 右侧内容区

1. **页面标题**：
   - "货盘管理"文字（左侧对齐）
   
2. **搜索和过滤区**：
   - 搜索框：可按产品名称、货号搜索
   - 品牌筛选下拉菜单：显示所有可选品牌
   - 添加产品按钮：绿色背景，白色文字"添加产品"，右侧对齐
   
3. **产品列表表格**：
   - 表头包含：序号、产品名称、品牌、货号、规格、创建时间、操作
   - 支持分页浏览
   - 支持按创建时间排序

### 列表项元素

1. **序号**：
   - 按顺序显示的数字
   
2. **产品名称**：
   - 产品名称文本
   
3. **品牌**：
   - 产品所属品牌名称
   
4. **货号**：
   - 产品货号
   
5. **规格**：
   - 产品规格信息
   
6. **创建时间**：
   - 产品创建的日期和时间，格式：YYYY-MM-DD HH:MM:SS
   
7. **操作按钮**：
   - 编辑按钮：蓝色文字"编辑"
   - 删除按钮：红色文字"删除"
   - 分享按钮：绿色文字"分享"

## 弹窗元素

系统包含多个模态框，用于不同的产品管理操作：

### 1. 添加产品弹窗

1. **标题**：
   - "添加产品"
   
2. **表单元素**：
   - **产品名称**：
     - 标签："产品名称"
     - 输入框：占位文本"请输入产品名称"
     - 必填项标记（红色星号）
   
   - **品牌**：
     - 标签："品牌"
     - 下拉选择框：显示所有可选品牌
     - 必填项标记（红色星号）
   
   - **货号**：
     - 标签："货号"
     - 输入框：占位文本"请输入产品货号"
     - 必填项标记（红色星号）
   
   - **规格**：
     - 标签："规格"
     - 输入框：占位文本"请输入产品规格"
   
   - **净含量**：
     - 标签："净含量"
     - 输入框：占位文本"请输入产品净含量"
   
   - **产品尺寸**：
     - 标签："产品尺寸"
     - 输入框：占位文本"请输入产品尺寸"
   
   - **发货方式**：
     - 标签："发货方式"
     - 输入框：占位文本"请输入发货方式"
   
   - **发货规格**：
     - 标签："发货规格"
     - 输入框：占位文本"请输入发货规格"
   
   - **发货尺寸**：
     - 标签："发货尺寸"
     - 输入框：占位文本"请输入发货尺寸"
   
   - **产品链接**：
     - 标签："产品链接"
     - 输入框：占位文本"请输入产品链接"
   
   - **产品图片**：
     - 标签："产品图片"
     - 图片上传区域：支持多图上传
   
   - **产品素材包**：
     - 标签："产品素材包"
     - 文件上传区域：支持ZIP、RAR、7Z格式
   
   - **价格档位**：
     - 标签："价格档位"
     - 动态表单：可添加多个价格档位
     - 每个档位包含：数量、单价
   
3. **提交按钮**：
   - 绿色背景，白色文字："提交"
   - 灰色背景，黑色文字："取消"
   
4. **关闭图标**：
   - 右上角红色叉号

### 2. 编辑产品弹窗

1. **标题**：
   - "编辑产品"
   
2. **表单元素**：
   - 与添加产品弹窗相同，但已填入当前产品信息
   
3. **提交按钮**：
   - 绿色背景，白色文字："提交"
   - 灰色背景，黑色文字："取消"
   
4. **关闭图标**：
   - 右上角红色叉号

### 3. 删除确认弹窗

1. **标题**：
   - "确定删除该产品吗？"
   
2. **提示文字**：
   - "删除后，该产品将移入回收站，可以在回收站中恢复或永久删除。"
   
3. **按钮**：
   - 灰色背景，黑色文字："取消"
   - 红色背景，白色文字："删除"
   
4. **关闭图标**：
   - 右上角红色叉号

### 4. 分享产品弹窗

1. **标题**：
   - "分享产品"
   
2. **表单元素**：
   - **分享对象**：
     - 标签："分享对象"
     - 多选框列表：显示所有可选用户
     - 全选/取消全选按钮
   
3. **提交按钮**：
   - 绿色背景，白色文字："确认分享"
   - 灰色背景，黑色文字："取消"
   
4. **关闭图标**：
   - 右上角红色叉号

## 交互说明

1. **添加产品**：
   - 点击"添加产品"按钮打开添加产品弹窗
   - 填写必要的产品信息和上传相关文件
   - 点击"提交"按钮创建产品
   - 成功后刷新产品列表
   
2. **编辑产品**：
   - 点击列表中对应该产品行的"编辑"按钮打开编辑产品弹窗
   - 修改产品信息或相关文件
   - 点击"提交"按钮保存修改
   - 成功后刷新产品列表
   
3. **删除产品**：
   - 点击列表中对应该产品行的"删除"按钮打开删除确认弹窗
   - 确认删除或取消操作
   - 删除成功后刷新产品列表
   
4. **分享产品**：
   - 点击列表中对应该产品行的"分享"按钮打开分享产品弹窗
   - 选择要分享的用户
   - 点击"确认分享"按钮完成分享
   - 成功后显示分享成功提示

## 权限说明

### 管理员用户权限
- 可以管理公司总货盘（`owner_type='COMPANY'`）
- 可以查看所有销售员的货盘（只读）
- 不能管理任何销售员的个人货盘

### 销售员用户权限
- 可以管理自己的个人货盘（`owner_type='SELLER'`且`owner_id`等于当前用户ID）
- 可以查看公司总货盘（只读）
- 不能管理其他销售员的货盘

## 技术栈要求

- **前端框架**：React 18+
- **UI组件库**：Ant Design 5.x
- **状态管理**：Redux
- **路由管理**：React Router 6.x
- **HTTP请求**：Axios
- **样式处理**：Less + CSS Modules
- **数据获取**：React Query
- **表单处理**：Formik + Yup

## 页面组件结构

### 组件树

```
PalletManagementPage
├── MainLayout                   // 主布局组件
│   ├── Sidebar                  // 侧边导航栏组件
│   └── PageContent              // 页面内容区域
│       ├── PageHeader           // 页面标题区域
│       ├── SearchFilterBar      // 搜索和过滤区域
│       ├── ProductTable         // 产品表格组件
│       └── PaginationControls   // 分页控制组件
├── AddProductModal              // 添加产品弹窗
├── EditProductModal             // 编辑产品弹窗
├── DeleteConfirmModal           // 删除确认弹窗
├── ShareProductModal            // 分享产品弹窗
├── PriceTierForm                // 价格档位表单组件
├── AttachmentUpload             // 附件上传组件
└── SuccessModal                 // 操作成功提示弹窗
```

### 组件职责

#### MainLayout（布局组件）
- 提供整体页面布局结构
- 集成侧边导航栏和内容区域

#### Sidebar（侧边导航组件）
- 显示系统导航菜单
- 高亮"货盘管理"菜单项
- 提供折叠/展开功能

#### PageHeader（页面标题组件）
- 显示"货盘管理"标题
- 维持与其他管理页面的一致性

#### SearchFilterBar（搜索过滤组件）
- 提供产品搜索功能
- 提供品牌筛选功能
- 提供添加产品按钮

#### ProductTable（产品表格组件）
- 展示产品列表数据
- 支持分页和排序
- 提供产品操作按钮（编辑、删除、分享）

#### 各类弹窗组件
- 负责各自对应的业务操作
- 提供表单输入、确认操作或显示结果
- 统一的弹窗样式和交互方式

## 目录结构

```
src/
├── pages/
│   └── pallet/
│       └── PalletManagement/
│           ├── index.jsx                 # 页面主入口
│           └── PalletManagement.module.css # 页面样式
├── components/
│   └── pallet/
│       ├── ProductTable.jsx              # 产品表格组件
│       ├── ProductTable.module.css       # 产品表格样式
│       ├── AddProductModal.jsx           # 添加产品弹窗组件
│       ├── AddProductModal.module.css    # 添加产品弹窗样式
│       ├── EditProductModal.jsx          # 编辑产品弹窗组件
│       ├── EditProductModal.module.css   # 编辑产品弹窗样式
│       ├── DeleteConfirmModal.jsx        # 删除确认弹窗组件
│       ├── PriceTierForm.jsx             # 价格档位表单组件
│       ├── PriceTierForm.module.css      # 价格档位表单样式
│       ├── AttachmentUpload.jsx          # 附件上传组件
│       ├── AttachmentUpload.module.css   # 附件上传样式
│       ├── ShareProductModal.jsx         # 分享产品弹窗组件
│       └── ShareProductModal.module.css  # 分享产品弹窗样式
├── hooks/
│   └── pallet/
│       ├── useProductList.js             # 产品列表数据Hook
│       ├── useProductForm.js             # 产品表单处理Hook
│       └── usePalletStats.js             # 货盘统计数据Hook
├── services/
│   └── pallet/
│       └── productService.js             # 产品相关API
└── models/
    └── pallet/
        └── product.js                    # 产品相关类型定义
```

## 数据模型

### 产品(Product)

```javascript
// 产品数据模型
const Product = {
  id: Number,                // 产品ID
  owner_type: String,        // 拥有者类型，'COMPANY'或'SELLER'
  owner_id: Number,          // 拥有者ID，公司产品为null
  name: String,              // 产品名称
  brand_id: Number,          // 品牌ID
  brand_name: String,        // 品牌名称(关联信息)
  product_code: String,      // 产品货号
  specification: String,     // 产品规格
  net_content: String,       // 净含量
  product_size: String,      // 产品尺寸
  shipping_method: String,   // 发货方式
  shipping_spec: String,     // 发货规格
  shipping_size: String,     // 发货尺寸
  product_url: String,       // 产品链接
  created_by: Number,        // 创建人ID
  updated_by: Number,        // 更新人ID
  created_at: String,        // 创建时间
  updated_at: String,        // 更新时间
  deleted_at: String,        // 删除时间，非null表示已移入回收站
  price_tiers: Array,        // 价格档位
  images: Array,             // 产品图片
  materials: Array           // 产品素材包
};
```

### 价格档位(PriceTier)

```javascript
// 价格档位数据模型
const PriceTier = {
  id: Number,           // 主键ID
  product_id: Number,   // 产品ID
  quantity: String,     // 订购数量
  price: String,        // 单价
  created_at: String    // 创建时间
};
```

### 附件(Attachment)

```javascript
// 附件数据模型
const Attachment = {
  id: Number,                // 主键ID
  entity_type: String,       // 实体类型，例如'PRODUCT_IMAGE'或'PRODUCT_MATERIAL'
  entity_id: Number,         // 实体ID，产品ID
  created_by: Number,        // 创建人ID
  file_name: String,         // 文件名称
  file_type: String,         // 文件类型
  file_path: String,         // 文件路径
  file_size: Number,         // 文件大小
  created_at: String         // 创建时间
};
```

## API接口

### 1. 获取产品列表

- **接口路径**：`GET /api/pallet/products`
- **请求参数**：
  ```javascript
  const ProductListParams = {
    page: Number,        // 页码
    size: Number,        // 每页条数
    search: String,      // 搜索关键词(可选)
    brand_id: Number,    // 品牌筛选(可选)
    owner_type: String,  // 货盘类型，'COMPANY'或'SELLER'
    owner_id: Number     // 拥有者ID，公司货盘时为null
  };
  ```
- **响应数据**：
  ```javascript
  const ProductListResponse = {
    success: Boolean,
    data: {
      items: Array,      // 产品列表
      total: Number,     // 总记录数
      page: Number,      // 当前页码
      size: Number       // 每页条数
    },
    message: String
  };
  ```

### 2. 添加产品

- **接口路径**：`POST /api/pallet/products`
- **请求参数**：
  ```javascript
  const AddProductParams = {
    name: String,              // 产品名称
    brand_id: Number,          // 品牌ID
    product_code: String,      // 产品货号
    specification: String,     // 规格
    net_content: String,       // 净含量
    product_size: String,      // 产品尺寸
    shipping_method: String,   // 发货方式
    shipping_spec: String,     // 发货规格
    shipping_size: String,     // 发货尺寸
    product_url: String,       // 产品链接
    owner_type: String,        // 货盘类型，'COMPANY'或'SELLER'
    owner_id: Number           // 拥有者ID，公司货盘时为null
  };
  ```
- **响应数据**：
  ```javascript
  const AddProductResponse = {
    success: Boolean,
    data: Object,              // 创建的产品信息
    message: String
  };
  ```

### 3. 编辑产品

- **接口路径**：`PUT /api/pallet/products/:id`
- **请求参数**：
  ```javascript
  const UpdateProductParams = {
    name: String,              // 产品名称
    brand_id: Number,          // 品牌ID
    product_code: String,      // 产品货号
    specification: String,     // 规格
    net_content: String,       // 净含量
    product_size: String,      // 产品尺寸
    shipping_method: String,   // 发货方式
    shipping_spec: String,     // 发货规格
    shipping_size: String,     // 发货尺寸
    product_url: String,       // 产品链接
    deleted_attachment_ids: Array // 要删除的附件ID列表
  };
  ```
- **响应数据**：
  ```javascript
  const UpdateProductResponse = {
    success: Boolean,
    data: Object,              // 更新后的产品信息
    message: String
  };
  ```

### 4. 删除产品

- **接口路径**：`DELETE /api/pallet/products/:id`
- **请求参数**：
  ```javascript
  const DeleteProductParams = {
    permanent: Boolean // 是否永久删除，true=永久删除，false=移入回收站(默认)
  };
  ```
- **响应数据**：
  ```javascript
  const DeleteProductResponse = {
    success: Boolean,
    data: null,
    message: String
  };
  ```

### 5. 上传产品图片

- **接口路径**：`POST /api/pallet/products/:id/images`
- **请求参数**：FormData格式，包含image文件
- **响应数据**：
  ```javascript
  const UploadImageResponse = {
    success: Boolean,
    data: Object,              // 上传成功的附件信息
    message: String
  };
  ```

### 6. 上传产品素材包

- **接口路径**：`POST /api/pallet/products/:id/materials`
- **请求参数**：FormData格式，包含material文件(支持ZIP、RAR、7Z格式)
- **响应数据**：
  ```javascript
  const UploadMaterialResponse = {
    success: Boolean,
    data: Object,              // 上传成功的附件信息
    message: String
  };
  ```

### 7. 管理价格档位

- **接口路径**：`POST /api/pallet/products/:id/price-tiers`
- **请求参数**：
  ```javascript
  const PriceTiersParams = {
    price_tiers: Array({
      quantity: String,  // 订购数量
      price: String     // 单价
    })
  };
  ```
- **响应数据**：
  ```javascript
  const PriceTiersResponse = {
    success: Boolean,
    data: Array,              // 更新后的价格档位列表
    message: String
  };
  ```

## 页面路由

```javascript
// 路由配置
const routes = [
  {
    path: '/pallet/management/:type',
    element: <PalletManagement />,
    loader: ({ params }) => {
      const { type } = params;
      if (type !== 'company' && type !== 'seller') {
        throw new Error('Invalid pallet type');
      }
      return { type };
    }
  }
];
```

## 权限控制

```javascript
// 权限检查Hook
const usePalletPermission = (type) => {
  const { user } = useAuth();
  
  const canManage = useMemo(() => {
    if (type === 'company') {
      return user.is_admin;
    }
    return !user.is_admin && type === 'seller';
  }, [type, user.is_admin]);
  
  const canView = useMemo(() => {
    return true; // 所有用户都可以查看
  }, []);
  
  return {
    canManage,
    canView
  };
};
```

## 组件开发规范

1. **组件命名**
   - 使用大驼峰命名法
   - 文件名与组件名保持一致
   - 使用有意义的描述性名称

2. **组件结构**
   - 使用函数组件和Hooks
   - 使用PropTypes进行类型检查
   - 使用CSS Modules进行样式隔离

3. **状态管理**
   - 使用React Query管理服务端状态
   - 使用Redux管理全局状态
   - 使用React.useState管理组件本地状态

4. **错误处理**
   - 使用try-catch处理异步操作
   - 使用错误边界处理渲染错误
   - 提供友好的错误提示

5. **性能优化**
   - 使用React.memo优化渲染
   - 使用useMemo和useCallback优化计算和回调
   - 实现虚拟滚动处理大量数据

## 测试规范

1. **单元测试**
   - 使用Jest和React Testing Library
   - 测试组件渲染和交互
   - 测试Hook逻辑

2. **集成测试**
   - 测试组件间交互
   - 测试路由导航
   - 测试权限控制

3. **E2E测试**
   - 使用Cypress
   - 测试完整用户流程
   - 测试错误场景

## 代码规范

1. **代码风格**
   - 使用ESLint和Prettier
   - 遵循Airbnb JavaScript Style Guide
   - 使用ES6+语法特性

2. **注释规范**
   - 使用JSDoc注释
   - 注释复杂逻辑
   - 注释函数参数和返回值

3. **Git提交规范**
   - 使用语义化提交信息
   - 遵循Conventional Commits规范
   - 每个功能独立分支开发

## 部署规范

1. **构建优化**
   - 代码分割
   - 资源压缩
   - 缓存策略

2. **环境配置**
   - 开发环境
   - 测试环境
   - 生产环境

3. **监控告警**
   - 错误监控
   - 性能监控
   - 用户行为分析 