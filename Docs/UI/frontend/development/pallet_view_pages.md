# 货盘查看页面开发规范

## 1. 页面概述

货盘查看页面分为两个功能场景：
1. **查看销售货盘页面**：管理员专用功能，可查看所有销售员货盘内容并复制到公司总货盘
2. **查看公司货盘页面**：销售员专用功能，可查看公司总货盘内容并复制到个人货盘

这两个页面共享相似的UI结构和功能逻辑，但针对不同用户角色提供不同的操作权限和数据视图。开发时采用组件复用策略，使用同一套核心组件构建两个独立页面。

### 1.1 访问路径

- **查看销售货盘**:
  - 路由路径：`/protected/admin/sales-pallets`
  - 权限要求：仅系统管理员可访问
  
- **查看公司货盘**:
  - 路由路径：`/protected/seller/company-pallets`
  - 权限要求：普通销售员可访问

### 1.2 功能特性

**查看销售货盘页面功能**:
- 销售员列表展示与选择
- 销售员货盘产品搜索与筛选
- 产品表格或卡片展示
- 复制产品到公司总货盘功能
- 素材下载功能

**查看公司货盘页面功能**:
- 公司总货盘产品搜索与筛选
- 产品表格或卡片展示
- 复制产品到个人货盘功能
- 素材下载功能

## 2. 开发方案

考虑到两个页面的相似性，采用以下开发方案：

1. 创建通用的`PalletView`组件，作为两个页面的核心展示组件
2. 根据不同用户角色和页面需求，为组件提供不同的配置和参数
3. 使用相同的通用API调用方法和数据处理逻辑，减少代码重复

### 2.1 主要组件结构

```
/protected/admin/sales-pallets 页面
└── SalesPalletView (管理员查看销售货盘页面组件)
    ├── SalesPersonList (销售员列表组件) - 仅管理员页面需要
    │   └── SalesPersonCard (销售员信息卡片)
    └── PalletView (通用货盘查看组件)
        ├── SearchFilter (搜索和筛选组件)
        ├── ViewToggle (视图切换组件)
        ├── ProductTable/ProductGrid (产品表格组件)
        ├── ProductCards (产品卡片组件)
        ├── Pagination (分页组件)
        └── Modals (弹窗组件)
            ├── CopyConfirmModal (复制确认弹窗)
            └── CopySuccessModal (复制成功弹窗)

/protected/seller/company-pallets 页面
└── CompanyPalletView (销售员查看公司货盘页面组件)
    └── PalletView (复用通用货盘查看组件)
        ├── SearchFilter (搜索和筛选组件)
        ├── ViewToggle (视图切换组件)
        ├── ProductTable/ProductGrid (产品表格组件)
        ├── ProductCards (产品卡片组件)
        ├── Pagination (分页组件)
        └── Modals (弹窗组件)
            ├── CopyConfirmModal (复制确认弹窗)
            └── CopySuccessModal (复制成功弹窗)
```

## 3. 数据模型

### 3.1 数据模型定义

以下是基于数据库结构定义的数据模型：

```typescript
// 销售员数据模型
interface Salesperson {
  id: number;              // 销售员ID
  username: string;        // 用户名
  name: string;            // 姓名
  avatar: string;          // 头像URL
  email: string;           // 邮箱
  phone: string;           // 电话
  company: string;         // 所属公司
  product_count: number;   // 产品数量
  last_update_time: string; // 最后更新时间
  status: UserStatus;      // 状态
}

// 用户状态枚举
enum UserStatus {
  ACTIVE = 'ACTIVE',       // 启用状态
  INACTIVE = 'INACTIVE'    // 禁用状态
}

// 产品数据模型
interface Product {
  id: number;              // 产品ID
  owner_type: OwnerType;   // 拥有者类型
  owner_id: number;        // 拥有者ID
  name: string;            // 产品名称
  brand_id: number;        // 品牌ID
  brand_name: string;      // 品牌名称
  product_code: string;    // 产品货号
  specification: string;   // 产品规格
  net_content: string;     // 净含量
  product_size: string;    // 产品尺寸
  package_method: string;  // 装箱方式
  packaging_spec: string;  // 装箱规格
  package_size: string;    // 装箱尺寸
  product_url: string;     // 产品链接
  created_at: string;      // 创建时间
  updated_at: string;      // 更新时间
  created_by: number;      // 创建人ID
  updated_by: number;      // 更新人ID
  price_tiers: PriceTier[]; // 价格档位
  attachments: Attachment[]; // 附件
}

// 拥有者类型枚举
enum OwnerType {
  COMPANY = 'COMPANY',     // 公司
  SELLER = 'SELLER'        // 销售员
}

// 价格档位数据模型
interface PriceTier {
  id: number;              // 价格档位ID
  product_id: number;      // 产品ID
  quantity: string;        // 订购数量
  price: string;           // 单价
  created_at: string;      // 创建时间
}

// 附件数据模型
interface Attachment {
  id: number;              // 附件ID
  entity_type: string;     // 实体类型
  entity_id: number;       // 实体ID
  file_name: string;       // 文件名
  file_type: string;       // 文件类型
  file_path: string;       // 文件路径
  file_size: number;       // 文件大小
  created_at: string;      // 创建时间
  created_by: number;      // 创建人ID
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

使用React Hooks管理组件状态，保持与项目中其他页面一致的状态管理方式：

```typescript
// 核心PalletView组件状态管理
function PalletView({ ownerType, ownerId, role, ...props }) {
  // UI状态
  const [viewMode, setViewMode] = useState('table'); // 'table' 或 'card'
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // 是否处于搜索模式
  
  // 数据状态
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10, 
    total: 0,
    totalPages: 0
  });
  
  // 搜索与筛选状态
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    brandId: null,
    sortField: 'updated_at',
    sortOrder: 'desc'
  });
  
  // 弹窗相关状态
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [copyModalVisible, setCopyModalVisible] = useState(false);
  const [copySuccessVisible, setCopySuccessVisible] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  
  // ... 组件逻辑和渲染
}

// 销售货盘页面组件状态管理
function SalesPalletView() {
  // 销售员相关状态
  const [salesList, setSalesList] = useState([]);
  const [salesLoading, setSalesLoading] = useState(false);
  const [currentSalesperson, setCurrentSalesperson] = useState(null);
  
  // ... 组件逻辑和渲染，集成PalletView组件
}

// 公司货盘页面组件状态管理
function CompanyPalletView() {
  const { user } = useSelector(state => state.auth);
  
  // ... 组件逻辑和渲染，集成PalletView组件
}
```

## 4. API调用

### 4.1 API接口定义

使用项目中现有的通用API方法进行数据获取和操作：

```typescript
// 从@/api/common.js导入通用搜索和分页查询方法
import { commonSearch } from '@/api/common';
import request from '@/utils/request';

/**
 * 获取产品列表 - 使用通用分页查询接口
 * @param {object} params - 查询参数
 */
export function getProducts(params) {
  return request({
    url: '/api/common/pagination/query',
    method: 'GET',
    params: {
      module: 'products',
      with_brand: true,
      with_price_tiers: true,
      with_attachments: true,
      ...params
    }
  });
}

/**
 * 搜索产品 - 使用通用搜索接口
 * @param {string} keyword - 搜索关键词
 * @param {object} params - 其他查询参数
 */
export function searchProducts(keyword, params = {}) {
  const fields = 'p.name,b.name,p.product_code,p.specification,p.net_content';
  return commonSearch('products', keyword, fields, false, params);
}

/**
 * 获取销售员列表
 * @param {object} params - 查询参数
 */
export function getSalespeople(params = {}) {
  return request({
    url: '/api/auth/users',
    method: 'GET',
    params: { 
      is_admin: false,
      status: 'ACTIVE',
      ...params 
    }
  });
}

/**
 * 获取品牌列表
 */
export function getBrands() {
  return request({
    url: '/api/pallet/brands',
    method: 'GET',
    params: { status: 'ACTIVE' }
  });
}

/**
 * 复制产品
 * @param {number} sourceId - 源产品ID
 * @param {string} targetOwnerType - 目标拥有者类型
 * @param {number|null} targetOwnerId - 目标拥有者ID
 */
export function copyProduct(sourceId, targetOwnerType, targetOwnerId = null) {
  return request({
    url: '/api/pallet/products/copy',
    method: 'POST',
    data: {
      source_id: sourceId,
      target_owner_type: targetOwnerType,
      target_owner_id: targetOwnerId
    }
  });
}

/**
 * 下载产品素材
 * @param {number} productId - 产品ID
 */
export function downloadProductMaterials(productId) {
  return request({
    url: `/api/pallet/products/${productId}/materials/download`,
    method: 'GET',
    responseType: 'blob'
  });
}
```

### 4.2 API调用时机与参数

| 功能 | 调用时机 | API方法 | 参数示例 |
|-----|---------|---------|--------|
| 获取销售员列表 | 管理员页面加载时 | `getSalespeople` | `{ page: 1, page_size: 20 }` |
| 获取销售员货盘产品 | 管理员选择销售员后 | `getProducts` | `{ owner_type: 'SELLER', owner_id: salesId, page: 1 }` |
| 获取公司货盘产品 | 销售员页面加载时 | `getProducts` | `{ owner_type: 'COMPANY', page: 1 }` |
| 搜索销售员货盘产品 | 管理员页面搜索时 | `searchProducts` | `keyword, { owner_type: 'SELLER', owner_id: salesId }` |
| 搜索公司货盘产品 | 销售员页面搜索时 | `searchProducts` | `keyword, { owner_type: 'COMPANY' }` |
| 获取品牌列表 | 页面加载时 | `getBrands` | - |
| 复制产品到公司货盘 | 管理员点击复制按钮 | `copyProduct` | `sourceId, 'COMPANY', null` |
| 复制产品到个人货盘 | 销售员点击复制按钮 | `copyProduct` | `sourceId, 'SELLER', userId` |
| 下载产品素材 | 点击下载素材按钮 | `downloadProductMaterials` | `productId` |

### 4.3 产品获取实现

按照货盘管理页面的实现方式，使用createProductFetcher模式：

```javascript
// 创建独立于组件的函数，避免循环引用
const createProductFetcher = (setLoading, setIsSearching, setProducts, setPagination, message) => {
  return async (page, pageSize, keyword, brandId, sortField, sortOrder, ownerType, ownerId) => {
    setLoading(true);
    
    // 使用updated_at降序排序作为默认值
    const actualSortField = sortField || 'updated_at';
    const actualSortOrder = sortOrder || 'desc';
    
    try {
      // 判断是否为搜索模式
      const isSearchMode = keyword && keyword.trim() !== '';
      setIsSearching(isSearchMode);

      // 构建通用的查询参数
      const commonParams = {
        sort_field: actualSortField,
        sort_order: actualSortOrder,
        with_price_tiers: true,
        with_attachments: true,
        owner_type: ownerType,
        owner_id: ownerId
      };

      // 添加品牌筛选参数（如果有）
      if (brandId !== null && brandId !== undefined && !isNaN(brandId)) {
        commonParams.brand_id = brandId;
      }

      let response;
      
      if (isSearchMode) {
        // 搜索模式 - 使用通用搜索API
        const fields = 'p.name,b.name,p.product_code,p.specification,p.net_content';
        response = await commonSearch('products', keyword, fields, false, commonParams);
      } else {
        // 分页模式 - 使用通用分页查询API
        response = await request({
          url: '/api/common/pagination/query',
          method: 'GET',
          params: {
            page,
            page_size: pageSize,
            module: 'products',
            with_brand: true,
            ...commonParams
          }
        });
      }
      
      // 统一处理响应
      if (response && response.code === 200 && response.data) {
        let productList = [];
        let total = 0;
        let totalPages = 1;
        
        if (isSearchMode) {
          // 处理搜索响应
          productList = response.data.list || [];
          total = productList.length;
          
          // 前端分页 - 计算当前页应该显示的数据
          const startIndex = (page - 1) * pageSize;
          const endIndex = Math.min(startIndex + pageSize, total);
          productList = productList.slice(startIndex, endIndex);
          totalPages = Math.ceil(total / pageSize);
        } else {
          // 处理分页响应
          productList = response.data.items || [];
          total = response.data.pagination?.total || 0;
          totalPages = response.data.pagination?.total_pages || 1;
        }
        
        // 确保产品数据包含所有必要字段
        const enhancedProducts = productList.map(product => ({
          ...product,
          price_tiers: Array.isArray(product.price_tiers) ? product.price_tiers : [],
          attachments: Array.isArray(product.attachments) ? product.attachments : [],
          // 确保这些字段存在
          package_method: product.package_method || '',
          packaging_spec: product.packaging_spec || '',
          package_size: product.package_size || ''
        }));
        
        // 添加序号
        const startIndex = (page - 1) * pageSize;
        const productsWithIndex = enhancedProducts.map((item, index) => ({
          ...item,
          index: startIndex + index + 1
        }));
        
        // 更新状态
        setProducts(productsWithIndex);
        setPagination({
          current: page,
          pageSize: pageSize,
          total: total,
          totalPages: totalPages
        });
      } else {
        // 错误处理
        setProducts([]);
        setPagination(prev => ({
          ...prev,
          current: 1,
          total: 0,
          totalPages: 0
        }));
        
        if (response?.message) {
          message.error(response.message);
        }
      }
    } catch (error) {
      console.error('获取产品列表失败:', error);
      setProducts([]);
      setPagination(prev => ({
        ...prev,
        current: 1,
        total: 0,
        totalPages: 0
      }));
      message.error('获取产品列表失败');
    } finally {
      setLoading(false);
    }
  };
};

// 使用示例
const fetchProductsRef = useRef(null);

useEffect(() => {
  fetchProductsRef.current = createProductFetcher(
    setLoading,
    setIsSearching,
    setProducts,
    setPagination,
    message
  );
  
  return () => {
    fetchProductsRef.current = null;
  };
}, [message]);

// 封装调用方法
const fetchProducts = useCallback((...args) => {
  if (fetchProductsRef.current) {
    return fetchProductsRef.current(...args, ownerType, ownerId);
  }
}, [ownerType, ownerId]);
```

## 5. 组件实现指南

### 5.1 PalletView通用组件

这是核心组件，负责产品列表的展示、搜索筛选和操作功能，实现与现有ProductManagement页面类似的功能。

#### 组件属性

```typescript
interface PalletViewProps {
  // 必需属性
  ownerType: 'COMPANY' | 'SELLER';   // 产品所有者类型
  ownerId: number | null;            // 产品所有者ID
  role: 'admin' | 'seller';          // 当前用户角色
  
  // 可选属性
  copyTargetType?: 'COMPANY' | 'SELLER'; // 复制目标类型
  copyTargetId?: number | null;      // 复制目标ID
  onCopySuccess?: (product: Product) => void; // 复制成功回调
  emptyText?: string;                // 空数据提示文本
  actionText?: string;               // 操作按钮文本
}
```

#### 组件结构和主要方法

```jsx
const PalletView = ({
  ownerType,
  ownerId,
  role,
  copyTargetType,
  copyTargetId,
  onCopySuccess,
  emptyText = '暂无产品数据',
  actionText = '复制产品'
}) => {
  const { message, modal } = App.useApp();
  const fetchProductsRef = useRef(null);
  const initializedRef = useRef(false);
  const searchTimerRef = useRef(null);
  
  // 状态声明（参见状态管理部分）
  
  // 初始化产品获取函数
  useEffect(() => {
    fetchProductsRef.current = createProductFetcher(
      setLoading,
      setIsSearching,
      setProducts,
      setPagination,
      message
    );
    
    return () => {
      fetchProductsRef.current = null;
    };
  }, [message]);
  
  // 获取产品数据
  const fetchProducts = useCallback((...args) => {
    if (fetchProductsRef.current) {
      return fetchProductsRef.current(...args, ownerType, ownerId);
    }
  }, [ownerType, ownerId]);
  
  // 初始化数据加载
  useEffect(() => {
    async function loadInitialData() {
      if (!initializedRef.current && fetchProductsRef.current) {
        initializedRef.current = true;
        
        try {
          // 获取品牌列表
          const brandsResponse = await getBrands();
          if (brandsResponse?.code === 200 && Array.isArray(brandsResponse.data?.list)) {
            setBrands(brandsResponse.data.list);
          }
          
          // 获取产品列表
          fetchProducts(
            pagination.current,
            pagination.pageSize,
            searchParams.keyword,
            searchParams.brandId,
            searchParams.sortField,
            searchParams.sortOrder
          );
        } catch (error) {
          console.error('初始化数据加载失败:', error);
          message.error('数据加载失败');
        }
      }
    }
    
    loadInitialData();
  }, [fetchProducts, pagination.current, pagination.pageSize, searchParams, message]);
  
  // 搜索处理（带防抖）
  const handleSearch = (value) => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    
    searchTimerRef.current = setTimeout(() => {
      setSearchParams(prev => ({ ...prev, keyword: value }));
      setPagination(prev => ({ ...prev, current: 1 }));
      
      fetchProducts(
        1,
        pagination.pageSize,
        value,
        searchParams.brandId,
        searchParams.sortField,
        searchParams.sortOrder
      );
    }, 500); // 500ms防抖
  };
  
  // 品牌筛选
  const handleBrandFilter = (value) => {
    setSearchParams(prev => ({ ...prev, brandId: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
    
    fetchProducts(
      1,
      pagination.pageSize,
      searchParams.keyword,
      value,
      searchParams.sortField,
      searchParams.sortOrder
    );
  };
  
  // 视图模式切换
  const handleViewModeChange = (e) => {
    setViewMode(e.target.value);
  };
  
  // 分页处理
  const handlePageChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }));
    
    fetchProducts(
      page,
      pageSize,
      searchParams.keyword,
      searchParams.brandId,
      searchParams.sortField,
      searchParams.sortOrder
    );
  };
  
  // 图片预览
  const handleImagePreview = (imageUrl, title) => {
    setPreviewImage(imageUrl);
    setPreviewTitle(title);
    setPreviewVisible(true);
  };
  
  // 产品复制
  const handleCopyProduct = (product) => {
    setSelectedProduct(product);
    setCopyModalVisible(true);
  };
  
  // 确认复制
  const handleConfirmCopy = async () => {
    if (!selectedProduct) return;
    
    setCopyLoading(true);
    
    try {
      const response = await copyProduct(
        selectedProduct.id,
        copyTargetType,
        copyTargetId
      );
      
      if (response?.code === 200) {
        setCopyModalVisible(false);
        setCopySuccessVisible(true);
        
        if (onCopySuccess && typeof onCopySuccess === 'function') {
          onCopySuccess(selectedProduct);
        }
      } else {
        message.error(response?.message || '复制失败');
      }
    } catch (error) {
      console.error('复制产品失败:', error);
      message.error('复制产品失败');
    } finally {
      setCopyLoading(false);
    }
  };
  
  // 下载素材
  const handleDownloadMaterials = async (product) => {
    try {
      message.loading('正在准备下载...', 0);
      const response = await downloadProductMaterials(product.id);
      
      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${product.name}-素材包.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      
      message.destroy();
      message.success('素材下载成功');
    } catch (error) {
      message.destroy();
      message.error('素材下载失败');
      console.error('下载失败:', error);
    }
  };
  
  // 组件渲染部分（参见JSX结构部分）
};
```

#### JSX结构

```jsx
return (
  <div className={styles.container}>
    {/* 工具栏：搜索、筛选和视图切换 */}
    <div className={styles.toolbar}>
      <div className={styles.toolbarLeft}>
        <Input.Search 
          placeholder="搜索产品名称、货号等信息"
          onSearch={handleSearch}
          allowClear
        />
        <Select
          placeholder="选择品牌"
          allowClear
          onChange={handleBrandFilter}
          value={searchParams.brandId}
          style={{ width: 200 }}
        >
          <Option value={null}>全部品牌</Option>
          {brands.map(brand => (
            <Option key={brand.id} value={brand.id}>{brand.name}</Option>
          ))}
        </Select>
      </div>
      <div className={styles.toolbarRight}>
        <Radio.Group 
          value={viewMode} 
          onChange={handleViewModeChange}
          buttonStyle="solid"
        >
          <Radio.Button value="table"><BarsOutlined /> 表格</Radio.Button>
          <Radio.Button value="card"><AppstoreOutlined /> 卡片</Radio.Button>
        </Radio.Group>
      </div>
    </div>

    {/* 产品列表 - 表格视图 */}
    {viewMode === 'table' && (
      <div className="product-grid-container">
        <div className="product-grid-scroll-container">
          <div className="product-grid-content">
            {/* 表头 */}
            <div className="product-grid-header">
              <div className="grid-col grid-col-index">序号</div>
              <div className="grid-col grid-col-image">图片</div>
              <div className="grid-col grid-col-name">名称</div>
              <div className="grid-col grid-col-brand">品牌</div>
              <div className="grid-col grid-col-code">货号</div>
              <div className="grid-col grid-col-spec">规格</div>
              <div className="grid-col grid-col-content">净含量</div>
              <div className="grid-col grid-col-size">产品尺寸</div>
              <div className="grid-col grid-col-shipping">装箱方式</div>
              <div className="grid-col grid-col-ship-spec">装箱规格</div>
              <div className="grid-col grid-col-ship-size">装箱尺寸</div>
              <div className="grid-col grid-col-price-tier">价格档位</div>
              <div className="grid-col grid-col-material">素材包</div>
              <div className="grid-col grid-col-url">产品链接</div>
              <div className="grid-col grid-col-action">操作</div>
            </div>
            
            {/* 表格主体 */}
            <div className="product-grid-body">
              {products.length > 0 ? (
                products.map(product => (
                  <div key={product.id} className="product-grid-row">
                    {/* 序号 */}
                    <div className="grid-col grid-col-index">
                      {product.index}
                    </div>
                    
                    {/* 图片 */}
                    <div className="grid-col grid-col-image">
                      {renderProductImage(product, handleImagePreview)}
                    </div>
                    
                    {/* 其他字段... */}
                    <div className="grid-col grid-col-name" title={product.name}>
                      {product.name}
                    </div>
                    
                    <div className="grid-col grid-col-brand">
                      {product.brand_name || '-'}
                    </div>
                    
                    <div className="grid-col grid-col-code">
                      {product.product_code || '-'}
                    </div>
                    
                    <div className="grid-col grid-col-spec" title={product.specification}>
                      {product.specification || '-'}
                    </div>
                    
                    <div className="grid-col grid-col-content">
                      {product.net_content || '-'}
                    </div>
                    
                    <div className="grid-col grid-col-size">
                      {product.product_size || '-'}
                    </div>
                    
                    <div className="grid-col grid-col-shipping">
                      {product.package_method || '-'}
                    </div>
                    
                    <div className="grid-col grid-col-ship-spec">
                      {product.packaging_spec || '-'}
                    </div>
                    
                    <div className="grid-col grid-col-ship-size">
                      {product.package_size || '-'}
                    </div>
                    
                    <div className="grid-col grid-col-price-tier">
                      {renderPriceTiers(product.price_tiers)}
                    </div>
                    
                    <div className="grid-col grid-col-material">
                      {product.attachments?.some(att => att.file_type === 'MATERIAL') ? (
                        <Button 
                          type="link" 
                          icon={<DownloadOutlined />} 
                          onClick={() => handleDownloadMaterials(product)}
                        />
                      ) : (
                        <span className="no-material">暂无</span>
                      )}
                    </div>
                    
                    <div className="grid-col grid-col-url">
                      {product.product_url ? (
                        <a 
                          href={product.product_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <LinkOutlined />
                        </a>
                      ) : (
                        <span className="no-material">暂无</span>
                      )}
                    </div>
                    
                    <div className="grid-col grid-col-action">
                      <Button
                        type="link"
                        onClick={() => handleCopyProduct(product)}
                        icon={<CopyOutlined />}
                        title={actionText}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="product-grid-empty">
                  <Empty description={loading ? "加载中..." : emptyText} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
    
    {/* 产品列表 - 卡片视图 */}
    {viewMode === 'card' && (
      <div className={styles.productCardGrid}>
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              onDownload={handleDownloadMaterials}
              onCopy={handleCopyProduct}
              actionText={actionText}
            />
          ))
        ) : (
          <div className={styles.emptyContainer}>
            <Empty description={loading ? "加载中..." : emptyText} />
          </div>
        )}
      </div>
    )}
    
    {/* 分页控件 */}
    {products.length > 0 && (
      <div className={styles.pagination}>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePageChange}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `共 ${total} 条记录`}
        />
      </div>
    )}
    
    {/* 弹窗组件 */}
    <Modal
      open={previewVisible}
      title={previewTitle}
      footer={null}
      onCancel={() => setPreviewVisible(false)}
    >
      <img
        alt="产品图片"
        style={{ width: '100%' }}
        src={previewImage}
      />
    </Modal>
    
    <Modal
      title="确认复制产品"
      open={copyModalVisible}
      onCancel={() => setCopyModalVisible(false)}
      confirmLoading={copyLoading}
      onOk={handleConfirmCopy}
      okText="确认复制"
      cancelText="取消"
    >
      <p>确定要将产品"{selectedProduct?.name}"复制到{copyTargetType === 'COMPANY' ? '公司总货盘' : '个人货盘'}吗？</p>
    </Modal>
    
    <Modal
      title="复制成功"
      open={copySuccessVisible}
      onCancel={() => setCopySuccessVisible(false)}
      footer={[
        <Button key="ok" type="primary" onClick={() => setCopySuccessVisible(false)}>
          确定
        </Button>
      ]}
    >
      <Result
        status="success"
        title="产品复制成功"
        subTitle={`产品"${selectedProduct?.name}"已成功复制到${copyTargetType === 'COMPANY' ? '公司总货盘' : '个人货盘'}`}
      />
    </Modal>
  </div>
);
```

### 5.2 SalesPersonList组件

这是管理员查看销售货盘页面专用的组件，用于展示销售员列表。

```jsx
const SalesPersonList = ({ 
  salesList, 
  loading, 
  onSelectSalesperson,
  currentSalesperson
}) => {
  // 搜索状态
  const [searchValue, setSearchValue] = useState('');
  
  // 处理搜索
  const handleSearch = (value) => {
    setSearchValue(value);
  };
  
  // 筛选销售员
  const filteredSalesList = useMemo(() => {
    if (!searchValue || !salesList.length) return salesList;
    
    return salesList.filter(person => 
      person.name?.toLowerCase().includes(searchValue.toLowerCase()) || 
      person.username?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [salesList, searchValue]);
  
  return (
    <div className={styles.salesPersonList}>
      <div className={styles.listHeader}>
        <Title level={4}>公司销售员</Title>
        <Input.Search
          placeholder="搜索销售员"
          onSearch={handleSearch}
          style={{ width: 200 }}
          allowClear
        />
      </div>
      
      {loading ? (
        <div className={styles.loading}>
          <Spin />
        </div>
      ) : (
        <div className={styles.cardContainer}>
          {filteredSalesList.length > 0 ? (
            filteredSalesList.map(person => (
              <SalesPersonCard
                key={person.id}
                salesperson={person}
                onSelect={onSelectSalesperson}
                selected={currentSalesperson?.id === person.id}
              />
            ))
          ) : (
            <Empty description="暂无销售员信息" />
          )}
        </div>
      )}
    </div>
  );
};
```

### 5.3 SalesPersonCard组件

```jsx
const SalesPersonCard = ({ salesperson, onSelect, selected }) => {
  return (
    <Card
      hoverable
      className={`${styles.salesCard} ${selected ? styles.selected : ''}`}
      onClick={() => onSelect(salesperson)}
    >
      <div className={styles.cardHeader}>
        <Avatar 
          size={48} 
          src={salesperson.avatar} 
          icon={!salesperson.avatar && <UserOutlined />}
        />
        <div className={styles.userInfo}>
          <div className={styles.name}>{salesperson.name}</div>
          <div className={styles.username}>@{salesperson.username}</div>
        </div>
      </div>
      
      <div className={styles.cardBody}>
        <div className={styles.company}>
          {salesperson.company || '未设置公司'}
        </div>
        <div className={styles.stats}>
          <span><InboxOutlined /> {salesperson.product_count || 0} 个产品</span>
          <span><ClockCircleOutlined /> 最后更新: {
            salesperson.last_update_time 
              ? dayjs(salesperson.last_update_time).format('YYYY-MM-DD') 
              : '无更新'
          }</span>
        </div>
      </div>
      
      <Button 
        type="primary" 
        className={styles.viewButton}
      >
        查看{salesperson.name}的货盘
      </Button>
    </Card>
  );
};
```

## 6. 样式实现指南

### 6.1 样式设计原则

为确保表格布局的稳定性和一致性，需遵循以下样式设计原则，这些原则解决了项目中曾经遇到的表格水平滚动问题：

1. **文件组织**：使用CSS Modules，样式分离为独立的CSS文件
2. **命名规范**：使用有意义的类名，遵循BEM命名法或项目特定规范
3. **标准边框使用**：使用标准CSS边框属性而非伪元素，确保边框在滚动时的连续性
4. **正确的嵌套结构**：使用三层嵌套容器结构确保横向滚动正常工作：
   ```
   容器 → 滚动容器 → 内容容器 → 表头/表体
   ```
5. **合理的CSS属性**：使用Grid布局和适当的`min-width`属性确保表格内容不被挤压
6. **响应式设计**：使用媒体查询处理不同屏幕尺寸下的显示效果
7. **样式一致性**：与现有页面保持一致的视觉风格和DOM结构

### 6.2 表格水平滚动关键实现

以下是实现稳定的表格水平滚动的关键代码：

```css
/* 表格最外层容器 */
.product-grid-container {
  width: 100%;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden; /* 避免内容溢出 */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

/* 滚动容器 - 关键部分 */
.product-grid-scroll-container {
  overflow-x: auto;
  width: 100%;
  position: relative;
}

/* 内容容器 - 关键部分 */
.product-grid-content {
  display: inline-block;
  min-width: 100%;
}

/* 在窄屏幕下设置内容最小宽度，确保表格内容不被挤压 */
@media screen and (max-width: 1440px) {
  .product-grid-content {
    min-width: max-content;
  }
}

/* 表头和行使用直接边框，避免使用伪元素 */
.product-grid-header {
  border-top: 1px solid #e8e8e8;
  border-left: 1px solid #e8e8e8;
}

.product-grid-row {
  border-bottom: 1px solid #e8e8e8;
}

.grid-col {
  border-right: 1px solid #e8e8e8;
}
```

对应的表格JSX结构必须遵循这种嵌套模式：

```jsx
{/* 外层容器 */}
<div className="product-grid-container">
  {/* 滚动容器 */}
  <div className="product-grid-scroll-container">
    {/* 内容容器 */}
    <div className="product-grid-content">
      {/* 表头 */}
      <div className="product-grid-header">
        {/* 表头单元格 */}
        <div className="grid-col">...</div>
        {/* ... 更多表头单元格 */}
      </div>
      
      {/* 表格主体 */}
      <div className="product-grid-body">
        {/* 表格行 */}
        <div className="product-grid-row">
          {/* 单元格 */}
          <div className="grid-col">...</div>
          {/* ... 更多单元格 */}
        </div>
        {/* ... 更多行 */}
      </div>
    </div>
  </div>
</div>
```

### 6.3 PalletView组件样式

```css
/* PalletView.module.css */
.container {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.toolbarLeft {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toolbarRight {
  display: flex;
  align-items: center;
}

.productCardGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.pagination {
  margin-top: 24px;
  text-align: right;
}

.emptyContainer {
  padding: 48px 0;
  text-align: center;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .toolbarLeft {
    margin-bottom: 16px;
    width: 100%;
  }
  
  .toolbarRight {
    width: 100%;
  }
  
  .productCardGrid {
    grid-template-columns: 1fr;
  }
}
```

### 6.4 SalesPersonList组件样式

```css
/* SalesPersonList.module.css */
.salesPersonList {
  margin-bottom: 24px;
}

.listHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.cardContainer {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 48px 0;
}

/* SalesPersonCard样式 */
.salesCard {
  border-radius: 8px;
  transition: all 0.3s;
}

.salesCard.selected {
  border-color: #1890ff;
  box-shadow: 0 0 8px rgba(24, 144, 255, 0.2);
}

.cardHeader {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.userInfo {
  margin-left: 12px;
}

.name {
  font-size: 16px;
  font-weight: 500;
}

.username {
  font-size: 13px;
  color: #8c8c8c;
}

.cardBody {
  margin-bottom: 16px;
}

.company {
  margin-bottom: 8px;
  font-weight: 500;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #595959;
  font-size: 13px;
}

.viewButton {
  width: 100%;
}
```

### 6.5 产品表格关键样式重点

产品表格样式的关键点在于:

1. 使用**CSS Grid**定义列布局，确保列宽比例一致
2. 使用**标准边框**而非伪元素实现边框线
3. 确保**正确的容器嵌套结构**：容器 → 滚动容器 → 内容容器
4. 表头使用`position: sticky`保持固定
5. 在媒体查询中添加`min-width: max-content`确保内容不被挤压

```css
/* 表格布局中的关键样式 */
.product-grid-header,
.product-grid-row {
  display: grid;
  min-width: 100%;
  width: auto;
  grid-template-columns: 
    60px               /* 序号 */
    100px              /* 图片 */
    minmax(150px, 1fr) /* 名称 - 可伸缩 */
    120px              /* 品牌 */
    120px              /* 货号 */
    minmax(120px, 1fr) /* 规格 - 可伸缩 */
    minmax(100px, 0.8fr) /* 净含量 - 可伸缩 */
    minmax(120px, 0.8fr) /* 产品尺寸 - 可伸缩 */
    minmax(120px, 0.8fr) /* 装箱方式 - 可伸缩 */
    minmax(120px, 0.8fr) /* 装箱规格 - 可伸缩 */
    minmax(120px, 1fr) /* 装箱尺寸 - 可伸缩 */
    180px              /* 价格档位 */
    80px               /* 素材包 */
    80px               /* 产品链接 */
    80px;              /* 操作 */
}

/* 表头固定 */
.product-grid-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background-color: #e6f7ff;
}

/* 图片容器样式 */
.product-image {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

/* 图片样式 */
.product-thumbnail {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  cursor: pointer;
  transition: transform 0.3s;
}

/* 价格档位容器样式 */
.price-tiers {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.price-tier-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
  border-bottom: 1px solid #f0f0f0;
}

.price-tier-item:last-child {
  border-bottom: none;
}
```

## 7. 辅助函数

### 7.1 图片渲染函数

```jsx
/**
 * 渲染产品图片
 * @param {Object} product - 产品数据
 * @param {Function} onPreview - 预览回调函数
 * @returns {JSX.Element}
 */
const renderProductImage = (product, onPreview) => {
  // 查找类型为IMAGE的第一个附件
  const imageAttachment = product.attachments?.find(
    att => att.file_type === 'IMAGE'
  );
  
  if (imageAttachment) {
    const imageUrl = imageAttachment.file_path;
    return (
      <div className="product-image">
        <img
          src={imageUrl}
          alt={product.name || '产品图片'}
          onClick={() => onPreview(imageUrl, product.name)}
          className="product-thumbnail"
        />
      </div>
    );
  }
  
  // 无图片时显示占位图
  return (
    <div className="product-image no-image">
      <PictureOutlined style={{ fontSize: 36, color: '#d9d9d9' }} />
    </div>
  );
};
```

### 7.2 价格档位渲染函数

```jsx
/**
 * 渲染价格档位
 * @param {Array} priceTiers - 价格档位数组
 * @returns {JSX.Element}
 */
const renderPriceTiers = (priceTiers) => {
  if (!priceTiers || priceTiers.length === 0) {
    return <span className="no-price">暂无</span>;
  }
  
  // 按数量排序
  const sortedTiers = [...priceTiers].sort((a, b) => {
    const numA = parseInt(a.quantity, 10);
    const numB = parseInt(b.quantity, 10);
    return numA - numB;
  });
  
  return (
    <div className="price-tiers">
      {sortedTiers.map((tier, index) => (
        <div key={tier.id || index} className="price-tier-item">
          <span className="quantity">{tier.quantity}件</span>
          <span className="price">¥{tier.price}</span>
        </div>
      ))}
    </div>
  );
};
```

### 7.3 产品卡片组件

```jsx
/**
 * 产品卡片组件
 */
const ProductCard = ({ product, onDownload, onCopy, actionText = '复制产品' }) => {
  // 查找产品图片
  const imageAttachment = product.attachments?.find(
    att => att.file_type === 'IMAGE'
  );
  const imageUrl = imageAttachment?.file_path;
  
  // 检查是否有素材包
  const hasMaterials = product.attachments?.some(att => att.file_type === 'MATERIAL');
  
  return (
    <Card
      hoverable
      cover={
        imageUrl ? (
          <img
            alt={product.name}
            src={imageUrl}
            className={styles.productCardImage}
          />
        ) : (
          <div className={styles.noImagePlaceholder}>
            <PictureOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
          </div>
        )
      }
      className={styles.productCard}
      actions={[
        hasMaterials && (
          <Tooltip title="下载素材包" key="download">
            <DownloadOutlined onClick={() => onDownload(product)} />
          </Tooltip>
        ),
        <Tooltip title={actionText} key="copy">
          <CopyOutlined onClick={() => onCopy(product)} />
        </Tooltip>,
        product.product_url && (
          <Tooltip title="访问产品链接" key="link">
            <a
              href={product.product_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
            >
              <LinkOutlined />
            </a>
          </Tooltip>
        )
      ].filter(Boolean)}
    >
      <Card.Meta
        title={product.name}
        description={
          <div className={styles.productCardInfo}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>品牌:</span>
              <span className={styles.infoValue}>{product.brand_name || '-'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>货号:</span>
              <span className={styles.infoValue}>{product.product_code || '-'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>规格:</span>
              <span className={styles.infoValue}>{product.specification || '-'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>价格:</span>
              <span className={styles.infoValue}>
                {product.price_tiers && product.price_tiers.length > 0
                  ? `¥${product.price_tiers[0].price}起`
                  : '-'}
              </span>
            </div>
          </div>
        }
      />
    </Card>
  );
};
```

## 8. 开发注意事项

### 8.1 代码组织原则

1. **组件分离原则**: 将功能划分为独立的组件，减少组件复杂度
2. **状态提升原则**: 共享状态放在父组件，通过props传递给子组件
3. **命名统一**: 保持与现有项目一致的命名规范
4. **复用优先**: 优先复用现有组件和功能，避免重复开发

### 8.2 注意问题

1. **表格横向滚动**: 确保使用正确的HTML结构和CSS样式，解决表格横向滚动问题
2. **产品列表布局**: 严格按照现有商品管理页面的布局方式实现，确保一致性和稳定性
3. **字段命名一致性**: 确保与后端API返回的字段完全一致，关键字段包括：
   - `package_method`: 装箱方式（而非shipping_method）
   - `packaging_spec`: 装箱规格（而非shipping_spec）
   - `package_size`: 装箱尺寸（而非shipping_size）
4. **字段默认值处理**: 对于API可能未返回的字段，确保提供默认空字符串值，避免渲染出现undefined
5. **权限控制**: 不同角色（管理员/销售员）有不同的操作权限，需在组件中做好判断
6. **错误处理**: 加强异常捕获和错误处理，提供友好的用户反馈
7. **搜索防抖**: 实现搜索输入防抖，避免频繁API请求 
8. **复制功能**: 确保正确处理产品复制时的所有字段，包括图片与素材包物理复制
9. **排序参数**: 使用后端支持的排序字段，默认按`updated_at`降序排序

### 8.3 移动端适配

虽然系统主要面向PC端用户，但应通过CSS确保在平板等较小屏幕上的基本可用性：

1. 表格视图在小屏幕上确保横向滚动正常工作
2. 工具栏在小屏幕上合理换行或重排
3. 卡片视图在小屏幕上单列显示

## 9. 联合开发方案

鉴于两个页面高度相似，建议采用以下联合开发方案：

1. 先开发通用的`PalletView`组件，确保其可复用性和稳定性
2. 开发销售员列表组件`SalesPersonList`和销售员卡片组件`SalesPersonCard`
3. 分别实现两个页面组件，集成上述通用组件
4. 确保路由配置正确，限制不同角色的访问权限

### 9.1 开发次序

1. 开发并测试通用组件
2. 开发销售货盘页面（管理员页面）
3. 开发公司货盘页面（销售员页面）
4. 整合测试

### 9.2 代码文件结构

```
src/
├── components/
│   └── business/
│       ├── PalletView/
│       │   ├── index.jsx           // 主组件
│       │   ├── ProductCard.jsx     // 产品卡片组件
│       │   ├── utils.js            // 辅助函数
│       │   └── styles.module.css   // 样式文件
│       └── SalesPersonList/
│           ├── index.jsx           // 销售员列表组件
│           ├── SalesPersonCard.jsx // 销售员卡片组件
│           └── styles.module.css   // 样式文件
│
└── pages/
    ├── admin/
    │   └── ViewSalesPallets.jsx    // 管理员查看销售货盘页面
    └── seller/
        └── ViewCompanyPallets.jsx  // 销售员查看公司货盘页面
```

## 10. 测试清单

在开发完成后，应对以下功能点进行详细测试：

1. **表格布局稳定性**
   - 表头与数据行对齐
   - 横向滚动正常
   - 表格边框完整显示
   
2. **数据加载与展示**
   - 初始加载正常
   - 分页功能正常
   - 表格/卡片视图切换正常
   
3. **搜索与筛选**
   - 关键词搜索功能
   - 品牌筛选功能
   - 搜索防抖功能
   
4. **产品复制功能**
   - 弹窗确认流程
   - 复制成功提示
   - 数据完整性
   - 附件物理复制
   
5. **角色权限测试**
   - 管理员权限验证
   - 销售员权限验证
   - 页面访问限制

## 11. 后期优化

### 11.1 性能优化

1. **懒加载**: 实现图片懒加载，提高页面加载速度
2. **数据缓存**: 适当缓存数据，减少重复请求
3. **虚拟列表**: 考虑在大数据量场景下使用虚拟列表技术

### 11.2 功能扩展

1. **批量操作**: 后续可考虑支持批量复制产品功能
2. **数据导出**: 添加数据导出为Excel等格式的功能
3. **高级筛选**: 增加更多字段的筛选条件