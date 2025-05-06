# 货盘分享浏览页面开发规范

## 1. 页面概述

货盘分享浏览页面是一个无需登录即可访问的公开页面，用于展示管理员或销售员分享的货盘产品列表。客户可通过分享的链接或扫描二维码查看对应销售员的货盘产品详情、价格档位、图片、附件等信息，并可直接联系销售员。分享的链接永不过期，确保客户可随时查看最新的产品信息。

### 1.1 访问路径

- 路由路径：`/share/{token}`
- 权限要求：无需登录，公开访问
- 特性说明：链接永不过期，基于唯一分享token

### 1.2 功能特性

- 销售员个人信息展示（头像、姓名、联系方式、微信二维码）
- 销售员店铺链接展示和访问
- 产品列表展示（支持表格视图和卡片视图切换）
- 产品筛选功能（按关键词搜索和按品牌筛选）
- 产品价格档位查看
- 产品图片浏览和素材包下载
- 支持响应式布局，适配PC端和移动端
- 分页浏览功能

## 2. 页面组件结构

### 2.1 组件树

```
PalletShareView (父容器)
├── PageHeader (页面头部)
│   └── BrandLogo (品牌标识)
├── SellerInfoCard (销售员信息卡片组件) 
│   ├── SellerAvatar (销售员头像)
│   ├── SellerContactInfo (销售员联系信息)
│   ├── SellerWechatQR (销售员微信二维码)
│   └── StoreLinks (店铺链接组件)
├── ProductListHeader (产品列表头部组件)
│   ├── ViewToggle (视图切换组件)
│   └── FilterSection (产品筛选区域)
│       ├── ProductSearch (产品搜索组件)
│       └── BrandFilter (品牌筛选下拉框)
├── ProductList (产品列表容器)
│   ├── TableView (表格视图组件)
│   │   └── PriceTierCell (价格档位单元格)
│   └── CardView (卡片视图组件)
│       └── ProductCard (产品卡片)
│           └── PriceTierPanel (价格档位面板)
├── ProductImageViewer (产品图片查看器)
└── PaginationControl (分页控制组件)
```

### 2.2 核心组件职责

#### SellerInfoCard (销售员信息卡片组件)
- 以卡片形式集中展示销售员相关信息
- 包含销售员头像、姓名、联系电话、微信二维码等
- 提供店铺链接列表，包括不同平台的店铺
- 样式：采用卡片样式，顶部突出显示，明亮友好的UI

#### FilterSection (产品筛选区域)
- 集成产品搜索和品牌筛选功能
- 搜索框支持按产品名称、货号等关键词搜索
- 品牌下拉框支持按品牌筛选产品
- 提供重置筛选条件功能

#### TableView (表格视图组件)
- 表格形式展示产品列表
- 实现水平滚动功能，保证在窄屏设备上正确显示
- 显示产品的所有字段信息，包括产品图片、基本信息和价格档位
- 特性：列头固定，支持自定义列宽，处理水平滚动边框问题

#### CardView (卡片视图组件)
- 卡片形式展示产品列表
- 采用网格布局展示产品卡片
- 每个卡片包含产品图片、名称、品牌、价格档位等核心信息
- 特性：响应式布局，根据屏幕宽度自动调整卡片大小和布局

#### PriceTierPanel (价格档位面板)
- 展示产品的不同数量档位和对应价格
- 支持多条目展示，包括数量范围和单价
- 特性：价格突出显示，不同档位区分明显

#### ProductImageViewer (产品图片查看器)
- 提供产品图片全屏预览功能
- 支持图片缩放和滑动浏览
- 支持多图片切换预览

## 3. 数据模型与状态管理

### 3.1 数据模型

```typescript
// 分享链接数据模型
interface ShareData {
  id: number;              // 分享ID
  user_id: number;         // 用户ID
  token: string;           // 分享令牌
  share_type: string;      // 分享类型
  created_at: string;      // 创建时间
  last_accessed: string;   // 最后访问时间
  access_count: number;    // 访问次数
}

// 销售员数据模型
interface Seller {
  id: number;              // 销售员ID
  username: string;        // 用户名
  name: string;            // 销售员姓名
  phone: string;           // 电话号码
  email: string;           // 邮箱
  status: string;          // 状态
  is_admin: boolean;       // 是否管理员
  avatar: string;          // 用户头像URL
  wechat_qrcode: string;   // 微信二维码URL
  company: string;         // 所属公司
  created_at: string;      // 创建时间
  updated_at: string;      // 更新时间
  stores: Store[];         // 销售员的店铺列表
}

// 店铺数据模型
interface Store {
  id: number;              // 店铺ID
  platform: string;        // 平台名称
  name: string;            // 店铺名称
  url: string;             // 店铺URL
  created_at: string;      // 创建时间
  updated_at: string;      // 更新时间
}

// 品牌数据模型
interface Brand {
  id: number;              // 品牌ID
  name: string;            // 品牌名称
  status: string;          // 状态
  created_by: number;      // 创建人ID 
  updated_by: number;      // 更新人ID
  created_at: string;      // 创建时间
  updated_at: string;      // 更新时间
}

// 产品价格档位模型
interface PriceTier {
  id: number;              // 价格档位ID
  product_id: number;      // 产品ID
  quantity: string;        // 数量区间
  price: string;           // 价格
  created_at: string;      // 创建时间
}

// 产品数据模型
interface Product {
  id: number;              // 产品ID
  owner_type: string;      // 拥有者类型(COMPANY/SELLER)
  owner_id: number;        // 拥有者ID(销售员ID，公司产品为NULL)
  name: string;            // 产品名称
  brand_id: number;        // 品牌ID
  brand_name: string;      // 品牌名称
  product_code: string;    // 产品货号
  specification: string;   // 产品规格
  net_content: string;     // 净含量
  product_size: string;    // 产品尺寸
  shipping_method: string; // 发货方式
  shipping_spec: string;   // 发货规格
  shipping_size: string;   // 发货尺寸
  product_url: string;     // 产品链接
  created_by: number;      // 创建人ID
  updated_by: number;      // 更新人ID
  created_at: string;      // 创建时间
  updated_at: string;      // 更新时间
  deleted_at: string;      // 删除时间，NULL表示未删除
  price_tiers: PriceTier[]; // 价格档位列表
  attachments: Attachment[]; // 产品图片和附件列表
}

// 附件模型
interface Attachment {
  id: number;              // 附件ID
  entity_type: string;     // 实体类型
  entity_id: number;       // 实体ID
  created_by: number;      // 创建人ID
  file_name: string;       // 文件名
  file_type: string;       // 文件类型
  file_path: string;       // 文件路径
  file_size: number;       // 文件大小
  created_at: string;      // 创建时间
}

// 分页数据模型
interface PaginationData {
  current_page: number;    // 当前页码
  total_pages: number;     // 总页数
  total_count: number;     // 总记录数
  per_page: number;        // 每页记录数
}
```

### 3.2 状态管理

使用React Hooks管理组件状态：

```typescript
function PalletShareView() {
  // 共享数据状态
  const [shareData, setShareData] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 筛选相关状态
  const [brands, setBrands] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  
  // 产品列表状态
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' 或 'card'
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // 分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  });
  
  // 图片预览状态
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  
  // 处理品牌筛选变更
  const handleBrandChange = (brandId) => {
    setSelectedBrandId(brandId);
    setPagination(prev => ({...prev, current: 1})); // 重置到第一页
    fetchProducts(1, pagination.pageSize, searchKeyword, brandId);
  };
  
  // 处理搜索关键词变更
  const handleSearchChange = (keyword) => {
    setSearchKeyword(keyword);
    setPagination(prev => ({...prev, current: 1})); // 重置到第一页
    fetchProducts(1, pagination.pageSize, keyword, selectedBrandId);
  };
  
  // 重置筛选条件
  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedBrandId(null);
    setPagination(prev => ({...prev, current: 1}));
    fetchProducts(1, pagination.pageSize, '', null);
  };
  
  // ... 其他组件状态和逻辑
}
```

## 4. API接口

### 4.1 API定义

```typescript
import request from '@/utils/request';

/**
 * 获取分享链接信息和产品列表
 * @param {string} token - 分享链接token
 * @param {object} params - 分页和过滤参数
 */
export function getPalletShareData(token, params = {}) {
  return request({
    url: `/api/pallet/share/${token}`,
    method: 'GET',
    params: {
      page: params.page || 1,
      page_size: params.pageSize || 10,
      keyword: params.keyword || '',
      brand_id: params.brandId || undefined,
      ...params
    }
  });
}

/**
 * 获取可用品牌列表
 * @param {string} token - 分享链接token
 */
export function getAvailableBrands(token) {
  return request({
    url: `/api/pallet/share/${token}/brands`,
    method: 'GET'
  });
}

/**
 * 记录客户访问日志
 * @param {string} token - 分享链接token
 */
export function logPalletShareAccess(token) {
  return request({
    url: `/api/pallet/share/${token}/access`,
    method: 'POST'
  });
}

/**
 * 下载产品素材包
 * @param {string} token - 分享链接token
 * @param {number} productId - 产品ID
 */
export function downloadProductMaterials(token, productId) {
  return request({
    url: `/api/pallet/share/${token}/product/${productId}/download`,
    method: 'GET',
    responseType: 'blob'
  });
}
```

## 5. 界面设计与样式规范

### 5.1 布局规范

- 页面采用响应式设计，支持从移动设备到桌面设备的多种屏幕尺寸
- 页面顶部为销售员信息卡片，下方为产品列表
- 产品筛选区域放置在产品列表上方，包含搜索框和品牌筛选下拉框
- 产品列表支持表格和卡片两种视图模式
- 使用Flex布局和Grid布局组织页面元素，不使用Table布局结构

### 5.2 筛选区域样式

```css
/* 筛选区域样式 */
.filter-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.search-box {
  flex: 1;
  min-width: 200px;
}

.brand-filter {
  width: 180px;
}

.filter-actions {
  display: flex;
  gap: 8px;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box,
  .brand-filter {
    width: 100%;
  }
}
```

### 5.3 表格视图样式

- 表格视图使用`display: grid`或`display: flex`实现，不使用HTML Table标签
- 表格列宽根据内容自适应，但设置最小宽度防止内容挤压
- 表头固定，表格内容可滚动
- 实现水平滚动效果，确保在移动设备上正确显示

#### 5.3.1 表格水平滚动解决方案

为解决表格在窄屏幕下的水平滚动问题，特别是边框不连续和背景色不完整的问题：

```css
/* 表格容器结构 */
.table-container {
  width: 100%;
  overflow: hidden;
}

.table-scroll-container {
  overflow-x: auto;
  width: 100%;
}

.table-content {
  min-width: 100%;
}

/* 在窄屏幕下设置内容最小宽度 */
@media screen and (max-width: 1440px) {
  .table-content {
    min-width: max-content;
  }
}

/* 表格行和单元格样式 */
.table-row {
  display: grid;
  grid-template-columns: [index] 60px [image] 120px [name] 180px [brand] 120px [code] 120px [spec] 150px [content] 120px [size] 150px [method] 120px [ship-spec] 150px [ship-size] 150px [price] 200px [materials] 100px;
  border-bottom: 1px solid #e8e8e8;
}

.table-header {
  font-weight: bold;
  background-color: #fafafa;
  position: sticky;
  top: 0;
  z-index: 1;
  border-top: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}

.table-cell {
  padding: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  border-right: 1px solid #e8e8e8;
}

.table-cell:first-child {
  border-left: 1px solid #e8e8e8;
}
```

### 5.4 卡片视图样式

- 卡片视图使用CSS Grid布局，响应式调整每行卡片数量
- 卡片内容包括产品图片、基本信息和价格档位
- 卡片阴影和过渡效果提高用户体验

```css
/* 卡片布局 */
.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  padding: 16px;
}

.product-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .card-container {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}
```

## 6. 用户交互设计

### 6.1 筛选与搜索交互

- 品牌筛选下拉框：提供所有可用品牌选项，包含"全部"选项
- 搜索框：支持即时搜索，用户可输入产品名称、货号等关键词
- 重置按钮：一键清除所有筛选条件
- 筛选条件变更自动触发数据更新，无需额外点击按钮
- 移动端适配：筛选组件在窄屏下垂直堆叠

```jsx
// 品牌筛选下拉框示例
<Select
  className="brand-filter"
  placeholder="选择品牌"
  value={selectedBrandId}
  onChange={handleBrandChange}
  allowClear
>
  <Option value={null}>全部品牌</Option>
  {brands.map(brand => (
    <Option key={brand.id} value={brand.id}>{brand.name}</Option>
  ))}
</Select>

// 搜索框示例
<Input.Search
  className="search-box"
  placeholder="搜索产品名称、货号..."
  value={searchKeyword}
  onChange={e => setSearchKeyword(e.target.value)}
  onSearch={handleSearchChange}
  allowClear
/>

// 重置筛选按钮
<Button onClick={handleResetFilters} icon={<ReloadOutlined />}>
  重置筛选
</Button>
```

### 6.2 视图切换

- 提供简洁的切换按钮，默认为表格视图
- 切换视图时保持当前的分页和筛选状态
- 视图切换状态保存在本地存储中，下次访问时恢复上次的视图模式

### 6.3 图片预览

- 点击产品图片可全屏预览
- 支持图片缩放和左右滑动查看多张图片
- 提供图片下载功能

### 6.4 素材包下载

- 提供明显的下载按钮
- 点击下载按钮直接下载产品的素材包
- 下载过程中显示加载指示器

### 6.5 分页控制

- 分页控件位于页面底部
- 提供页码和快速翻页按钮
- 显示总记录数和当前页码

## 7. 性能优化

### 7.1 图片优化

- 列表中使用缩略图，减少初始加载时间
- 图片使用懒加载技术，只加载可视区域的图片
- 使用合适的图片格式和压缩方式

```jsx
// 图片懒加载示例
import { LazyLoadImage } from 'react-lazy-load-image-component';

<LazyLoadImage
  src={getImageUrl(product.attachments[0].file_path)}
  alt={product.name}
  effect="blur"
  placeholderSrc={placeholderImage}
/>
```

### 7.2 列表渲染优化

- 使用虚拟列表技术，只渲染可视区域的产品项
- 合理使用React.memo和useCallback减少不必要的重渲染
- 分页数据使用缓存优化

### 7.3 筛选性能优化

- 搜索操作添加防抖处理，避免频繁请求
- 品牌数据缓存，避免重复加载
- 筛选操作状态本地化，减少不必要的服务器请求

```javascript
// 搜索防抖示例
const debounceTimeout = useRef(null);

const handleSearchInputChange = (value) => {
  setSearchKeyword(value);
  
  if (debounceTimeout.current) {
    clearTimeout(debounceTimeout.current);
  }
  
  debounceTimeout.current = setTimeout(() => {
    handleSearchChange(value);
  }, 300);
};
```

## 8. 开发实施与测试

### 8.1 开发步骤

1. 创建基础页面结构和组件
2. 实现API数据获取和状态管理
3. 开发销售员信息卡片组件
4. 开发产品筛选组件（搜索框和品牌筛选）
5. 开发产品列表的表格视图和卡片视图
6. 实现视图切换功能
7. 开发分页和图片预览功能
8. 添加响应式布局和移动端适配
9. 性能优化和测试

### 8.2 测试要点

- 测试品牌筛选和关键词搜索功能的准确性
- 测试筛选条件组合使用的效果
- 在不同屏幕尺寸设备上测试页面布局和响应式效果
- 测试表格水平滚动时的边框和背景显示
- 测试图片预览和素材包下载功能
- 验证分页和视图切换功能
- 检查在不同网络条件下的性能表现

## 9. 注意事项

1. 确保所有的API请求都包含分享token
2. 处理产品数据为空的情况，显示适当的提示信息
3. 注意图片和附件的权限控制
4. 品牌筛选需考虑品牌数量较多的情况，可能需要实现分组或搜索功能
5. 保证在移动设备上有良好的用户体验
6. 表格水平滚动时要特别注意边框连续性问题的解决
