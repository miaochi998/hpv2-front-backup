# 公司总货盘管理页面开发规范

## 页面概述

公司总货盘管理页面是系统管理员专用功能，用于管理公司所有产品信息。管理员可通过此页面添加、编辑、删除和共享产品信息，以及管理产品图片、素材包和多级价格档位等内容。此功能页面仅对管理员开放，销售员只能查看而不能编辑公司总货盘。

## 技术栈要求

- **前端框架**：React 18+
- **UI组件库**：Ant Design 5.x
- **状态管理**：Redux Toolkit
- **路由管理**：React Router 6.x
- **HTTP请求**：Axios
- **类型检查**：TypeScript 5.x
- **样式处理**：Less + CSS Modules

## 目录结构

```
src/
├── pages/
│   └── pallet/
│       └── CompanyProducts/
│           ├── index.tsx                 # 页面主入口
│           ├── components/               # 页面组件
│           │   ├── ProductTable.tsx      # 产品表格组件
│           │   ├── AddProductModal.tsx   # 添加产品弹窗组件
│           │   ├── EditProductModal.tsx  # 编辑产品弹窗组件
│           │   ├── DeleteConfirmModal.tsx # 删除确认弹窗组件
│           │   ├── DeleteSuccessModal.tsx # 删除成功弹窗组件
│           │   └── SharePalletModal.tsx  # 分享货盘弹窗组件
│           ├── hooks/                    # 自定义Hook
│           │   ├── useProductList.ts     # 产品列表数据Hook
│           │   └── useProductForm.ts     # 产品表单处理Hook
│           ├── services/                 # API服务
│           │   └── productService.ts     # 产品相关API
│           ├── models/                   # 类型定义
│           │   └── product.ts            # 产品相关类型定义
│           └── index.less                # 页面样式
└── api/
    └── pallet/
        └── products.ts                   # 产品API封装
```

## 数据模型

### 产品(Product)

```typescript
interface Product {
  id: number;
  owner_type: 'COMPANY' | 'SELLER'; // 拥有者类型
  owner_id: number | null;          // 拥有者ID，公司产品为null
  name: string;                     // 产品名称
  brand_id: number;                 // 品牌ID
  brand_name: string;               // 品牌名称(关联信息，非数据库字段)
  product_code: string;             // 产品货号
  specification: string | null;     // 产品规格
  net_content: string | null;       // 净含量
  product_size: string | null;      // 产品尺寸
  shipping_method: string | null;   // 发货方式
  shipping_spec: string | null;     // 发货规格
  shipping_size: string | null;     // 发货尺寸
  product_url: string | null;       // 产品链接
  created_by: number;               // 创建人ID
  updated_by: number | null;        // 更新人ID
  created_at: string;               // 创建时间
  updated_at: string;               // 更新时间
  deleted_at: string | null;        // 删除时间，非null表示已移入回收站
  price_tiers: PriceTier[];         // 价格档位(关联数据，非数据库字段)
  images: Attachment[];             // 产品图片(关联数据，非数据库字段)
  materials: Attachment[];          // 产品素材包(关联数据，非数据库字段)
}
```

### 价格档位(PriceTier)

```typescript
interface PriceTier {
  id: number;           // 主键ID
  product_id: number;   // 产品ID
  quantity: string;     // 订购数量
  price: string;        // 单价
  created_at: string;   // 创建时间
}
```

### 附件(Attachment)

```typescript
interface Attachment {
  id: number;                // 主键ID
  entity_type: string;       // 实体类型，例如'PRODUCT_IMAGE'或'PRODUCT_MATERIAL'
  entity_id: number;         // 实体ID，产品ID
  created_by: number | null; // 创建人ID
  file_name: string | null;  // 文件名称
  file_type: string;         // 文件类型
  file_path: string;         // 文件路径
  file_size: number | null;  // 文件大小
  created_at: string;        // 创建时间
}
```

## API接口

### 1. 获取产品列表

- **接口路径**：`GET /api/pallet/products`
- **请求参数**：
  ```typescript
  interface ProductListParams {
    page: number;        // 页码
    size: number;        // 每页条数
    search?: string;     // 搜索关键词(可选)
    brand_id?: number;   // 品牌筛选(可选)
  }
  ```
- **响应数据**：
  ```typescript
  interface ProductListResponse {
    success: boolean;
    data: {
      items: Product[];  // 产品列表
      total: number;     // 总记录数
      page: number;      // 当前页码
      size: number;      // 每页条数
    };
    message: string;
  }
  ```

### 2. 添加产品

- **接口路径**：`POST /api/pallet/products`
- **请求参数**：
  ```typescript
  interface AddProductParams {
    name: string;              // 产品名称
    brand_id: number;          // 品牌ID
    product_code: string;      // 产品货号
    specification?: string;    // 规格
    net_content?: string;      // 净含量
    product_size?: string;     // 产品尺寸
    shipping_method?: string;  // 发货方式
    shipping_spec?: string;    // 发货规格
    shipping_size?: string;    // 发货尺寸
    product_url?: string;      // 产品链接
  }
  ```
- **响应数据**：
  ```typescript
  interface AddProductResponse {
    success: boolean;
    data: Product;  // 创建的产品信息
    message: string;
  }
  ```

### 3. 编辑产品

- **接口路径**：`PUT /api/pallet/products/:id`
- **请求参数**：
  ```typescript
  interface UpdateProductParams {
    name?: string;              // 产品名称
    brand_id?: number;          // 品牌ID
    product_code?: string;      // 产品货号
    specification?: string;     // 规格
    net_content?: string;       // 净含量
    product_size?: string;      // 产品尺寸
    shipping_method?: string;   // 发货方式
    shipping_spec?: string;     // 发货规格
    shipping_size?: string;     // 发货尺寸
    product_url?: string;       // 产品链接
    deleted_attachment_ids?: number[]; // 要删除的附件ID列表
  }
  ```
- **响应数据**：
  ```typescript
  interface UpdateProductResponse {
    success: boolean;
    data: Product;  // 更新后的产品信息
    message: string;
  }
  ```

### 4. 删除产品

- **接口路径**：`DELETE /api/pallet/products/:id`
- **请求参数**：
  ```typescript
  interface DeleteProductParams {
    permanent?: boolean; // 是否永久删除，true=永久删除，false=移入回收站(默认)
  }
  ```
- **响应数据**：
  ```typescript
  interface DeleteProductResponse {
    success: boolean;
    data: null;
    message: string;
  }
  ```

### 5. 上传产品图片

- **接口路径**：`POST /api/pallet/products/:id/images`
- **请求参数**：FormData格式，包含image文件
- **响应数据**：
  ```typescript
  interface UploadImageResponse {
    success: boolean;
    data: Attachment;  // 上传成功的附件信息
    message: string;
  }
  ```

### 6. 上传产品素材包

- **接口路径**：`POST /api/pallet/products/:id/materials`
- **请求参数**：FormData格式，包含material文件(支持ZIP、RAR、7Z格式)
- **响应数据**：
  ```typescript
  interface UploadMaterialResponse {
    success: boolean;
    data: Attachment;  // 上传成功的附件信息
    message: string;
  }
  ```

### 7. 管理价格档位

- **接口路径**：`POST /api/pallet/products/:id/price-tiers`
- **请求参数**：
  ```typescript
  interface PriceTiersParams {
    price_tiers: Array<{
      quantity: string;  // 订购数量
      price: string;     // 单价
    }>;
  }
  ```
- **响应数据**：
  ```typescript
  interface PriceTiersResponse {
    success: boolean;
    data: PriceTier[];  // 更新后的价格档位列表
    message: string;
  }
  ```

### 8. 获取货盘分享链接

- **接口路径**：`POST /api/pallet/share`
- **请求参数**：
  ```typescript
  interface SharePalletParams {
    share_type: 'COMPANY';  // 分享类型，固定为COMPANY
  }
  ```
- **响应数据**：
  ```typescript
  interface SharePalletResponse {
    success: boolean;
    data: {
      token: string;       // 分享令牌
      share_url: string;   // 完整分享链接
      qrcode_url: string;  // 二维码图片链接
    };
    message: string;
  }
  ```

## 组件设计

### 1. 产品表格(ProductTable)

产品表格组件负责展示产品列表，支持分页、排序和搜索。

**Props定义**:
```typescript
interface ProductTableProps {
  loading: boolean;                     // 加载状态
  dataSource: Product[];                // 产品数据数组
  pagination: {                         // 分页信息
    current: number;                    // 当前页码
    pageSize: number;                   // 每页条数
    total: number;                      // 总记录数
  };
  onPageChange: (page: number, pageSize: number) => void;  // 页码变化回调
  onEdit: (product: Product) => void;                      // 编辑按钮点击回调
  onDelete: (product: Product) => void;                    // 删除按钮点击回调
}
```

**字段渲染**:
- ID: 数字
- 产品图片: 图片缩略图，若无图片则显示占位图
- 产品名称: 文本，支持过长自动省略
- 品牌: 文本，显示品牌名称
- 货号: 文本，显示产品货号
- 规格: 文本，显示产品规格
- 净含量: 文本，显示净含量
- 产品尺寸: 文本，显示产品尺寸
- 发货方式: 文本，显示发货方式
- 发货规格: 文本，显示发货规格
- 发货尺寸: 文本，显示发货尺寸
- 价格档位: 渲染为"订购数量: 单价"的格式，多个档位垂直排列
-.素材包: 有无状态图标，有则显示下载图标
- 产品链接: 可点击的外部链接图标
- 更新时间: 日期格式，格式为YYYY-MM-DD HH:mm
- 操作: 编辑按钮(绿色)和删除按钮(红色)

### 2. 添加产品弹窗(AddProductModal)

添加产品弹窗组件，包含产品信息表单、价格档位设置、图片和素材包上传。

**Props定义**:
```typescript
interface AddProductModalProps {
  visible: boolean;                                        // 弹窗显示状态
  loading: boolean;                                        // 提交按钮加载状态
  brands: Array<{ id: number; name: string }>;            // 品牌列表
  onSubmit: (values: AddProductFormValues) => Promise<void>; // 提交回调
  onCancel: () => void;                                    // 取消回调
}

interface AddProductFormValues extends AddProductParams {
  price_tiers?: Array<{ quantity: string; price: string }>;  // 价格档位
  image?: File;                                             // 产品图片
  material?: File;                                          // 产品素材包
}
```

**表单字段**:
- 产品名称(name): Input，必填
- 所属品牌(brand_id): Select，必填，下拉选择框
- 货号(product_code): Input，必填
- 规格(specification): Input，选填
- 净含量(net_content): Input，选填
- 产品尺寸(product_size): Input，选填
- 发货方式(shipping_method): Input，选填
- 发货规格(shipping_spec): Input，选填
- 发货尺寸(shipping_size): Input，选填
- 产品链接(product_url): Input，选填，带URL验证
- 价格档位: 使用PriceTierFormList组件，可添加多个档位
- 产品图片: 使用Upload组件，仅支持图片文件
- 产品素材包: 使用Upload组件，仅支持压缩文件

### 3. 价格档位组件(PriceTierFormList)

价格档位动态表单组件，支持添加和删除多个档位。

**Props定义**:
```typescript
interface PriceTierFormListProps {
  value?: Array<{ quantity: string; price: string }>;  // 当前值
  onChange?: (value: Array<{ quantity: string; price: string }>) => void;  // 值变化回调
  maxItems?: number;  // 最大允许条数，默认10
}
```

**组件功能**:
- 显示现有的价格档位列表
- 每个档位包含"订购数量"和"单价"两个输入框
- 支持添加新档位（"+"按钮）
- 支持删除现有档位（"-"按钮）
- 自动按订购数量从小到大排序
- 输入时进行实时验证

### 4. 文件上传组件(FileUploadForm)

处理图片和素材包上传的表单组件。

**Props定义**:
```typescript
interface FileUploadFormProps {
  productId: number;                                 // 产品ID
  fileType: 'image' | 'material';                    // 文件类型
  existingFiles: Attachment[];                       // 已上传的文件列表
  onUploadSuccess: (file: Attachment) => void;       // 上传成功回调
  onDeleteFile: (fileId: number) => void;            // 删除文件回调
  rules: {                                           // 验证规则
    accept: string;                                  // 接受的文件类型
    maxSize: number;                                 // 最大文件大小
    typeError: string;                               // 类型错误提示
    sizeError: string;                               // 大小错误提示
    sizeHint?: string;                               // 尺寸建议提示
  }
}
```

**组件功能**:
- 支持拖拽上传和点击上传
- 显示上传进度条
- 上传成功后显示文件预览（图片类型）或文件名（其他类型）
- 支持删除已上传文件
- 显示文件大小和格式限制提示
- 错误处理和错误提示

## 状态管理

使用Redux Toolkit管理产品列表和相关状态。

### 产品状态切片(productSlice)

```typescript
interface ProductState {
  list: {
    items: Product[];
    total: number;
    page: number;
    size: number;
    loading: boolean;
    error: string | null;
  };
  form: {
    loading: boolean;
    error: string | null;
  };
  filter: {
    search: string;
    brandId: number | null;
  };
}

// 创建异步thunk
const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: ProductListParams, { rejectWithValue }) => {
    try {
      const response = await productApi.getProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '获取产品列表失败');
    }
  }
);

// 其他异步thunk: addProduct, updateProduct, deleteProduct 等
```

## 页面功能实现

### 1. 产品列表展示

```typescript
// 在页面组件中
const { products, loading, pagination } = useProductList();

// 分页处理
const handlePageChange = (page: number, pageSize: number) => {
  dispatch(fetchProducts({ page, size: pageSize, ...currentFilters }));
};

// 渲染表格
return (
  <ProductTable
    loading={loading}
    dataSource={products}
    pagination={pagination}
    onPageChange={handlePageChange}
    onEdit={handleEdit}
    onDelete={handleDelete}
  />
);
```

### 2. 搜索和筛选

```typescript
// 搜索处理
const handleSearch = (value: string) => {
  setCurrentFilters({ ...currentFilters, search: value });
  dispatch(fetchProducts({ page: 1, size: pagination.pageSize, search: value, brand_id: currentFilters.brand_id }));
};

// 品牌筛选
const handleBrandChange = (brandId: number | null) => {
  setCurrentFilters({ ...currentFilters, brand_id: brandId });
  dispatch(fetchProducts({ page: 1, size: pagination.pageSize, search: currentFilters.search, brand_id: brandId }));
};
```

### 3. 添加产品

```typescript
// 添加产品处理
const handleAdd = async (values: AddProductParams) => {
  try {
    const response = await dispatch(addProduct(values)).unwrap();
    const productId = response.id;
    
    // 上传图片(如果有)
    if (productImage) {
      await uploadProductImage(productId, productImage);
    }
    
    // 上传素材包(如果有)
    if (productMaterial) {
      await uploadProductMaterial(productId, productMaterial);
    }
    
    // 添加价格档位(如果有)
    if (priceTiers && priceTiers.length > 0) {
      await updatePriceTiers(productId, priceTiers);
    }
    
    message.success('添加产品成功');
    setAddModalVisible(false);
    dispatch(fetchProducts(currentListParams)); // 刷新列表
  } catch (error) {
    message.error(error.message || '添加产品失败');
  }
};
```

### 4. 编辑产品

```typescript
// 编辑产品处理
const handleEdit = async (productId: number, values: UpdateProductParams) => {
  try {
    await dispatch(updateProduct({ id: productId, ...values })).unwrap();
    
    // 处理附件删除
    if (deletedAttachmentIds.length > 0) {
      await deleteProductAttachments(productId, deletedAttachmentIds);
    }
    
    // 上传新图片(如果有)
    if (newProductImage) {
      await uploadProductImage(productId, newProductImage);
    }
    
    // 上传新素材包(如果有)
    if (newProductMaterial) {
      await uploadProductMaterial(productId, newProductMaterial);
    }
    
    // 更新价格档位(如果有变化)
    if (priceTiersChanged) {
      await updatePriceTiers(productId, priceTiers);
    }
    
    message.success('编辑产品成功');
    setEditModalVisible(false);
    dispatch(fetchProducts(currentListParams)); // 刷新列表
  } catch (error) {
    message.error(error.message || '编辑产品失败');
  }
};
```

### 5. 删除产品

```typescript
// 删除产品处理
const handleDelete = async (productId: number, permanent: boolean) => {
  try {
    await dispatch(deleteProduct({ id: productId, permanent })).unwrap();
    message.success(permanent ? '产品已永久删除' : '产品已放入回收站');
    dispatch(fetchProducts(currentListParams)); // 刷新列表
  } catch (error) {
    message.error(error.message || '删除产品失败');
  }
};
```

### 6. 分享货盘

```typescript
// 分享货盘处理
const handleShare = async () => {
  try {
    const response = await dispatch(sharePallet({ share_type: 'COMPANY' })).unwrap();
    setShareData({
      shareUrl: response.share_url,
      qrcodeUrl: response.qrcode_url
    });
    setShareModalVisible(true);
  } catch (error) {
    message.error(error.message || '获取分享链接失败');
  }
};
```

## 表单验证规则

### 产品表单验证

```typescript
const productFormRules = {
  name: [
    { required: true, message: '请输入产品名称' },
    { max: 255, message: '产品名称最多255个字符' }
  ],
  brand_id: [
    { required: true, message: '请选择所属品牌' }
  ],
  product_code: [
    { required: true, message: '请输入产品货号' },
    { max: 100, message: '产品货号最多100个字符' }
  ],
  specification: [
    { max: 255, message: '规格最多255个字符' }
  ],
  net_content: [
    { max: 100, message: '净含量最多100个字符' }
  ],
  product_size: [
    { max: 100, message: '产品尺寸最多100个字符' }
  ],
  shipping_method: [
    { max: 100, message: '发货方式最多100个字符' }
  ],
  shipping_spec: [
    { max: 100, message: '发货规格最多100个字符' }
  ],
  shipping_size: [
    { max: 100, message: '发货尺寸最多100个字符' }
  ],
  product_url: [
    { type: 'url', message: '请输入有效的产品链接' },
    { max: 255, message: '产品链接最多255个字符' }
  ]
};
```

### 价格档位验证

```typescript
const priceTierRules = {
  quantity: [
    { required: true, message: '请输入订购数量' },
    { max: 100, message: '订购数量最多100个字符' }
  ],
  price: [
    { required: true, message: '请输入单价' },
    { max: 100, message: '单价最多100个字符' }
  ]
};
```

### 文件上传验证

```typescript
// 产品图片上传验证
const imageUploadRules = {
  // 文件类型限制
  accept: '.jpg,.jpeg,.png',
  // 文件大小限制：20MB
  maxSize: 20 * 1024 * 1024,
  // 文件类型错误提示
  typeError: '只支持JPG、PNG格式的图片',
  // 文件大小错误提示
  sizeError: '图片大小不能超过20MB',
  // 建议尺寸提示
  sizeHint: '建议尺寸800×800像素'
};

// 产品素材包上传验证
const materialUploadRules = {
  // 文件类型限制
  accept: '.zip,.rar,.7z',
  // 文件大小限制：50MB
  maxSize: 50 * 1024 * 1024,
  // 文件类型错误提示
  typeError: '只支持ZIP、RAR、7Z格式的压缩包',
  // 文件大小错误提示
  sizeError: '素材包大小不能超过50MB'
};
```

## 样式指南

### 颜色变量

```less
// 主题色
@primary-color: #1890ff;        // 主色调
@success-color: #52c41a;        // 成功色
@warning-color: #faad14;        // 警告色
@error-color: #f5222d;          // 错误色
@heading-color: rgba(0, 0, 0, 0.85); // 标题文字颜色
@text-color: rgba(0, 0, 0, 0.65);    // 正文文字颜色
@text-color-secondary: rgba(0, 0, 0, 0.45); // 次要文字颜色
@disabled-color: rgba(0, 0, 0, 0.25);       // 失效文字颜色
@border-color-base: #d9d9d9;    // 边框颜色
@background-color-light: #f5f5f5; // 背景色
```

### 按钮样式

```less
// 主要按钮
.primary-button {
  background-color: @primary-color;
  color: #fff;
  border: none;
  
  &:hover, &:focus {
    background-color: lighten(@primary-color, 10%);
  }
}

// 成功按钮
.success-button {
  background-color: @success-color;
  color: #fff;
  border: none;
  
  &:hover, &:focus {
    background-color: lighten(@success-color, 10%);
  }
}

// 危险按钮
.danger-button {
  background-color: @error-color;
  color: #fff;
  border: none;
  
  &:hover, &:focus {
    background-color: lighten(@error-color, 10%);
  }
}
```

### 表格样式

```less
.product-table {
  margin-top: 16px;
  
  .ant-table-thead > tr > th {
    background-color: #f0f0f0;
    font-weight: 500;
  }
  
  .product-image-cell {
    width: 80px;
    
    .product-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
    }
  }
  
  .product-name-cell {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .actions-cell {
    .action-button {
      margin-right: 8px;
      
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
```

## 性能优化

1. **列表分页与筛选**：
   - 使用服务端分页，避免一次加载大量数据
   - 实现防抖搜索，减少频繁请求

2. **表单组件优化**：
   - 使用React.memo包装纯展示组件
   - 使用useMemo和useCallback缓存计算结果和事件处理函数

3. **图片优化**：
   - 实现图片懒加载
   - 在表格中使用缩略图，点击可查看原图

4. **代码分割**：
   - 使用React.lazy和Suspense实现组件懒加载
   - 将大型模态框拆分为独立的代码块

## 错误处理

1. **API错误处理**：
   - 统一处理HTTP请求错误
   - 显示用户友好的错误消息

2. **表单验证错误**：
   - 实时显示字段验证错误
   - 提交前进行整体表单验证

3. **文件上传错误**：
   - 处理文件类型和大小限制错误
   - 网络错误时提供重试机制

## 辅助功能

1. **键盘导航**：
   - 表单支持Tab键导航
   - 提供快捷键操作

2. **屏幕阅读器支持**：
   - 为交互元素添加aria属性
   - 确保适当的焦点管理

## 测试要点

1. **单元测试**：
   - 测试关键组件的渲染和行为
   - 测试表单验证逻辑

2. **集成测试**：
   - 测试组件之间的交互
   - 测试表单提交和API调用

3. **端到端测试**：
   - 测试完整的用户流程
   - 测试边缘情况和错误处理 