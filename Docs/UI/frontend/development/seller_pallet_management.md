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
│       └── TotalPallet/
│           ├── index.tsx                 # 页面主入口
│           ├── components/               # 页面组件
│           │   ├── ProductTable.tsx      # 产品表格组件
│           │   ├── AddProductModal.tsx   # 添加产品弹窗组件
│           │   ├── EditProductModal.tsx  # 编辑产品弹窗组件
│           │   ├── DeleteConfirmModal.tsx # 删除确认弹窗组件
│           │   ├── PriceTierForm.tsx     # 价格档位表单组件
│           │   ├── AttachmentUpload.tsx  # 附件上传组件
│           │   └── SharePalletModal.tsx  # 分享货盘弹窗组件
│           ├── hooks/                    # 自定义Hook
│           │   ├── useProductList.ts     # 产品列表数据Hook
│           │   └── useProductForm.ts     # 产品表单处理Hook
│           ├── services/                 # API服务
│           │   └── productService.ts     # 产品相关API
│           ├── models/                   # 类型定义
│           │   └── product.ts            # 产品相关类型定义
│           └── index.less                # 页面样式
```

## 数据模型

### 产品数据模型

```typescript
// src/pages/pallet/TotalPallet/models/product.ts

// 产品基础信息类型
export interface Product {
  id: number;
  name: string;                      // 产品名称(数据库中VARCHAR(255)，必填)
  brand_id: number;                  // 品牌ID(数据库中INTEGER，必填)
  brand_name?: string;               // 品牌名称(非数据库字段，联查获取)
  product_code: string;              // 产品货号(数据库中VARCHAR(100)，必填)
  specification?: string;            // 规格(数据库中VARCHAR(255))
  net_content?: string;              // 净含量(数据库中VARCHAR(100))
  product_size?: string;             // 产品尺寸(数据库中VARCHAR(100))
  shipping_method?: string;          // 发货方式(数据库中VARCHAR(100))
  shipping_spec?: string;            // 发货规格(数据库中VARCHAR(100))
  shipping_size?: string;            // 发货尺寸(数据库中VARCHAR(100))
  product_url?: string;              // 产品链接(数据库中VARCHAR(255))
  owner_type: 'COMPANY' | 'SELLER';  // 拥有者类型(数据库中VARCHAR(20)，必填)
  owner_id: number | null;           // 拥有者ID(数据库中INTEGER)
  created_by: number;                // 创建人ID(数据库中INTEGER)
  updated_by?: number;               // 更新人ID(数据库中INTEGER)
  created_at: string;                // 创建时间(数据库中TIMESTAMP)
  updated_at: string;                // 更新时间(数据库中TIMESTAMP)
  deleted_at?: string | null;        // 删除时间(数据库中TIMESTAMP)
}

// 价格档位类型
export interface PriceTier {
  id?: number;                       // 档位ID(数据库中SERIAL)
  product_id?: number;               // 产品ID(数据库中INTEGER，必填)
  quantity: string;                  // 数量(数据库中VARCHAR(100)，必填)
  price: string;                     // 价格(数据库中VARCHAR(100)，必填)
  created_at?: string;               // 创建时间(数据库中TIMESTAMP)
}

// 附件类型
export interface Attachment {
  id: number;                        // 附件ID(数据库中SERIAL)
  entity_type: 'PRODUCT';            // 实体类型(数据库中VARCHAR(50)，必填)
  entity_id: number;                 // 实体ID(数据库中INTEGER，必填)
  created_by: number;                // 创建人ID(数据库中INTEGER)
  file_name: string;                 // 文件名(数据库中VARCHAR(255))
  file_type: 'IMAGE' | 'MATERIAL';   // 文件类型(数据库中VARCHAR(20)，必填)
  file_path: string;                 // 文件路径(数据库中VARCHAR(255)，必填)
  file_size: number;                 // 文件大小(数据库中BIGINT)
  created_at: string;                // 创建时间(数据库中TIMESTAMP)
}

// 产品详情（包含价格档位和附件）
export interface ProductDetail extends Product {
  price_tiers: PriceTier[];
  attachments: Attachment[];
}

// 产品列表查询参数
export interface ProductQueryParams {
  page: number;
  size: number;
  search?: string;
  brand_id?: number;
  sort_field?: string;
  sort_order?: 'asc' | 'desc';
  owner_type: 'COMPANY';             // 查询公司货盘时固定值
}

// 产品列表响应类型
export interface ProductListResponse {
  items: Product[];
  pagination: {
    total: number;
    current_page: number;
    page_size: number;
    total_pages: number;
  };
}

// 产品表单数据类型
export interface ProductFormData {
  name: string;                      // 产品名称(必填)
  brand_id: number;                  // 品牌ID(必填)
  product_code: string;              // 产品货号(必填)
  specification?: string;            // 规格
  net_content?: string;              // 净含量
  product_size?: string;             // 产品尺寸
  shipping_method?: string;          // 发货方式
  shipping_spec?: string;            // 发货规格
  shipping_size?: string;            // 发货尺寸
  product_url?: string;              // 产品链接
  owner_type: 'COMPANY';             // 拥有者类型(固定为COMPANY)
  owner_id: null;                    // 拥有者ID(公司货盘为null)
  price_tiers: PriceTier[];          // 价格档位
  images?: File[];                   // 产品图片
  materials?: File[];                // 产品素材包
}

// 分享链接响应类型
export interface ShareResponse {
  token: string;                     // 分享令牌
  created_at: string;                // 创建时间
  share_url: string;                 // 分享链接
  is_admin: boolean;                 // 是否管理员
  pallet_type: 'COMPANY';            // 货盘类型
}

// 分享二维码响应类型
export interface QRCodeResponse {
  qrcode_url: string;                // 二维码URL
  share_url: string;                 // 分享链接
}
```

## API接口定义

### 产品相关API

```typescript
// src/pages/pallet/TotalPallet/services/productService.ts

import { api } from '@/services/api';
import { 
  Product, 
  ProductDetail, 
  ProductListResponse, 
  ProductFormData,
  ProductQueryParams,
  ShareResponse,
  QRCodeResponse
} from '../models/product';

// 获取产品列表
export const getProducts = async (params: ProductQueryParams): Promise<ProductListResponse> => {
  const response = await api.get('/api/pallet/products', { params });
  return response.data;
};

// 获取产品详情
export const getProductDetail = async (id: number): Promise<ProductDetail> => {
  const response = await api.get(`/api/pallet/products/${id}`);
  return response.data;
};

// 添加产品
export const addProduct = async (formData: ProductFormData): Promise<Product> => {
  const form = new FormData();
  
  // 添加基本产品信息
  Object.keys(formData).forEach(key => {
    if (key !== 'price_tiers' && key !== 'images' && key !== 'materials') {
      form.append(key, formData[key]);
    }
  });
  
  // 添加价格档位
  form.append('price_tiers', JSON.stringify(formData.price_tiers));
  
  // 添加图片附件
  if (formData.images) {
    Array.from(formData.images).forEach(file => {
      form.append('images', file);
    });
  }
  
  // 添加素材包附件
  if (formData.materials) {
    Array.from(formData.materials).forEach(file => {
      form.append('materials', file);
    });
  }
  
  const response = await api.post('/api/pallet/products', form, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

// 编辑产品
export const updateProduct = async (id: number, formData: ProductFormData): Promise<Product> => {
  const form = new FormData();
  
  // 添加基本产品信息
  Object.keys(formData).forEach(key => {
    if (key !== 'price_tiers' && key !== 'images' && key !== 'materials') {
      form.append(key, formData[key]);
    }
  });
  
  // 添加价格档位
  form.append('price_tiers', JSON.stringify(formData.price_tiers));
  
  // 添加图片附件
  if (formData.images) {
    Array.from(formData.images).forEach(file => {
      form.append('images', file);
    });
  }
  
  // 添加素材包附件
  if (formData.materials) {
    Array.from(formData.materials).forEach(file => {
      form.append('materials', file);
    });
  }
  
  const response = await api.put(`/api/pallet/products/${id}`, form, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

// 删除产品（移入回收站）
export const recycleProduct = async (id: number): Promise<any> => {
  const response = await api.post(`/api/pallet/products/${id}/recycle`);
  return response.data;
};

// 永久删除产品
export const deleteProduct = async (id: number): Promise<any> => {
  const response = await api.delete(`/api/pallet/products/${id}`);
  return response.data;
};

// 删除产品附件
export const deleteAttachment = async (attachmentId: number): Promise<any> => {
  const response = await api.delete(`/api/pallet/attachments/${attachmentId}`);
  return response.data;
};

// 生成分享链接
export const generateShareLink = async (): Promise<ShareResponse> => {
  const response = await api.post('/api/pallet/share', {
    share_type: 'COMPANY'
  });
  return response.data;
};

// 获取分享二维码
export const getShareQRCode = async (token: string, size: number = 300): Promise<QRCodeResponse> => {
  const response = await api.post('/api/pallet/share/qrcode', {
    token,
    size
  });
  return response.data;
};
```

## Redux状态管理

### Redux Slice

```typescript
// src/pages/pallet/TotalPallet/slices/productSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  getProducts, 
  getProductDetail, 
  addProduct, 
  updateProduct, 
  recycleProduct, 
  deleteProduct,
  generateShareLink,
  getShareQRCode
} from '../services/productService';
import { 
  Product, 
  ProductDetail, 
  ProductFormData, 
  ProductQueryParams,
  ShareResponse,
  QRCodeResponse
} from '../models/product';

// 状态类型定义
interface ProductState {
  list: {
    items: Product[];
    pagination: {
      total: number;
      current_page: number;
      page_size: number;
      total_pages: number;
    };
    loading: boolean;
    error: string | null;
  };
  detail: {
    data: ProductDetail | null;
    loading: boolean;
    error: string | null;
  };
  operation: {
    loading: boolean;
    success: boolean;
    error: string | null;
  };
  share: {
    data: ShareResponse | null;
    qrcode: string | null;
    loading: boolean;
    error: string | null;
  };
}

// 初始状态
const initialState: ProductState = {
  list: {
    items: [],
    pagination: {
      total: 0,
      current_page: 1,
      page_size: 10,
      total_pages: 0
    },
    loading: false,
    error: null
  },
  detail: {
    data: null,
    loading: false,
    error: null
  },
  operation: {
    loading: false,
    success: false,
    error: null
  },
  share: {
    data: null,
    qrcode: null,
    loading: false,
    error: null
  }
};

// 异步Action: 获取产品列表
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: ProductQueryParams, { rejectWithValue }) => {
    try {
      return await getProducts(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '获取产品列表失败');
    }
  }
);

// 异步Action: 获取产品详情
export const fetchProductDetail = createAsyncThunk(
  'products/fetchProductDetail',
  async (id: number, { rejectWithValue }) => {
    try {
      return await getProductDetail(id);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '获取产品详情失败');
    }
  }
);

// 异步Action: 添加产品
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (formData: ProductFormData, { rejectWithValue }) => {
    try {
      return await addProduct(formData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '添加产品失败');
    }
  }
);

// 异步Action: 编辑产品
export const updateProductById = createAsyncThunk(
  'products/updateProduct',
  async ({ id, formData }: { id: number; formData: ProductFormData }, { rejectWithValue }) => {
    try {
      return await updateProduct(id, formData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '编辑产品失败');
    }
  }
);

// 异步Action: 删除产品（移入回收站）
export const recycleProductById = createAsyncThunk(
  'products/recycleProduct',
  async (id: number, { rejectWithValue }) => {
    try {
      return await recycleProduct(id);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '删除产品失败');
    }
  }
);

// 异步Action: 永久删除产品
export const deleteProductById = createAsyncThunk(
  'products/deleteProduct',
  async (id: number, { rejectWithValue }) => {
    try {
      return await deleteProduct(id);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '永久删除产品失败');
    }
  }
);

// 异步Action: 分享货盘
export const sharePallet = createAsyncThunk(
  'products/sharePallet',
  async (_, { rejectWithValue }) => {
    try {
      const shareData = await generateShareLink();
      const qrcodeData = await getShareQRCode(shareData.token, 300);
      return {
        shareData,
        qrcodeUrl: qrcodeData.qrcode_url
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '生成分享链接失败');
    }
  }
);

// 产品Slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetOperationStatus: (state) => {
      state.operation = {
        loading: false,
        success: false,
        error: null
      };
    },
    resetShareData: (state) => {
      state.share = {
        data: null,
        qrcode: null,
        loading: false,
        error: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取产品列表
      .addCase(fetchProducts.pending, (state) => {
        state.list.loading = true;
        state.list.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.items = action.payload.items;
        state.list.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.payload as string;
      })
      
      // 获取产品详情
      .addCase(fetchProductDetail.pending, (state) => {
        state.detail.loading = true;
        state.detail.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.detail.loading = false;
        state.detail.data = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.detail.loading = false;
        state.detail.error = action.payload as string;
      })
      
      // 添加产品
      .addCase(createProduct.pending, (state) => {
        state.operation.loading = true;
        state.operation.success = false;
        state.operation.error = null;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.operation.loading = false;
        state.operation.success = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.operation.loading = false;
        state.operation.error = action.payload as string;
      })
      
      // 编辑产品
      .addCase(updateProductById.pending, (state) => {
        state.operation.loading = true;
        state.operation.success = false;
        state.operation.error = null;
      })
      .addCase(updateProductById.fulfilled, (state) => {
        state.operation.loading = false;
        state.operation.success = true;
      })
      .addCase(updateProductById.rejected, (state, action) => {
        state.operation.loading = false;
        state.operation.error = action.payload as string;
      })
      
      // 删除产品（移入回收站）
      .addCase(recycleProductById.pending, (state) => {
        state.operation.loading = true;
        state.operation.success = false;
        state.operation.error = null;
      })
      .addCase(recycleProductById.fulfilled, (state) => {
        state.operation.loading = false;
        state.operation.success = true;
      })
      .addCase(recycleProductById.rejected, (state, action) => {
        state.operation.loading = false;
        state.operation.error = action.payload as string;
      })
      
      // 永久删除产品
      .addCase(deleteProductById.pending, (state) => {
        state.operation.loading = true;
        state.operation.success = false;
        state.operation.error = null;
      })
      .addCase(deleteProductById.fulfilled, (state) => {
        state.operation.loading = false;
        state.operation.success = true;
      })
      .addCase(deleteProductById.rejected, (state, action) => {
        state.operation.loading = false;
        state.operation.error = action.payload as string;
      })
      
      // 分享货盘
      .addCase(sharePallet.pending, (state) => {
        state.share.loading = true;
        state.share.error = null;
      })
      .addCase(sharePallet.fulfilled, (state, action) => {
        state.share.loading = false;
        state.share.data = action.payload.shareData;
        state.share.qrcode = action.payload.qrcodeUrl;
      })
      .addCase(sharePallet.rejected, (state, action) => {
        state.share.loading = false;
        state.share.error = action.payload as string;
      });
  }
});

export const { resetOperationStatus, resetShareData } = productSlice.actions;
export default productSlice.reducer;
```

## 主页面组件实现

### 页面入口组件

```typescript
// src/pages/pallet/TotalPallet/index.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Input, 
  Select, 
  Space, 
  Divider, 
  message 
} from 'antd';
import { 
  PlusOutlined, 
  ShareAltOutlined, 
  SearchOutlined 
} from '@ant-design/icons';
import { RootState, AppDispatch } from '@/store';
import { 
  fetchProducts, 
  resetOperationStatus, 
  resetShareData, 
  sharePallet 
} from './slices/productSlice';
import { fetchBrands } from '@/services/brand';
import ProductTable from './components/ProductTable';
import AddProductModal from './components/AddProductModal';
import EditProductModal from './components/EditProductModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import SharePalletModal from './components/SharePalletModal';
import { ProductQueryParams } from './models/product';
import styles from './index.less';

const { Option } = Select;

const TotalPallet: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // 从Redux store获取状态
  const { 
    list: { items, pagination, loading: listLoading },
    share: { data: shareData, qrcode: shareQRCode, loading: shareLoading }
  } = useSelector((state: RootState) => state.products);
  
  const { brands } = useSelector((state: RootState) => state.brands);
  
  // 本地状态
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedBrandId, setSelectedBrandId] = useState<number | undefined>();
  const [queryParams, setQueryParams] = useState<ProductQueryParams>({
    page: 1,
    size: 10,
    owner_type: 'COMPANY'
  });
  
  // 模态框显示状态
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [shareModalVisible, setShareModalVisible] = useState<boolean>(false);
  
  // 选中的产品ID（用于编辑、删除操作）
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  
  // 初始加载品牌和产品列表
  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchProducts(queryParams));
  }, [dispatch]);
  
  // 搜索处理
  const handleSearch = () => {
    const newParams = {
      ...queryParams,
      page: 1, // 重置到第一页
      search: searchKeyword,
      brand_id: selectedBrandId
    };
    setQueryParams(newParams);
    dispatch(fetchProducts(newParams));
  };
  
  // 品牌筛选变化处理
  const handleBrandChange = (value: number | undefined) => {
    setSelectedBrandId(value);
  };
  
  // 分页变化处理
  const handlePageChange = (page: number, pageSize?: number) => {
    const newParams = {
      ...queryParams,
      page,
      size: pageSize || queryParams.size
    };
    setQueryParams(newParams);
    dispatch(fetchProducts(newParams));
  };
  
  // 打开添加产品模态框
  const showAddModal = () => {
    setAddModalVisible(true);
  };
  
  // 打开编辑产品模态框
  const showEditModal = (productId: number) => {
    setSelectedProductId(productId);
    setEditModalVisible(true);
  };
  
  // 打开删除确认模态框
  const showDeleteModal = (productId: number) => {
    setSelectedProductId(productId);
    setDeleteModalVisible(true);
  };
  
  // 分享货盘处理
  const handleShare = async () => {
    try {
      await dispatch(sharePallet()).unwrap();
      setShareModalVisible(true);
    } catch (error) {
      message.error('获取分享链接失败');
    }
  };
  
  // 模态框关闭处理
  const handleModalClose = () => {
    setAddModalVisible(false);
    setEditModalVisible(false);
    setDeleteModalVisible(false);
    setShareModalVisible(false);
    setSelectedProductId(null);
    
    // 重置操作状态
    dispatch(resetOperationStatus());
    
    // 关闭分享模态框后重置分享数据
    if (shareModalVisible) {
      dispatch(resetShareData());
    }
  };
  
  // 刷新产品列表（添加、编辑、删除操作后）
  const refreshProductList = () => {
    dispatch(fetchProducts(queryParams));
  };
  
  return (
    <div className={styles.container}>
      {/* 页面标题 */}
      <div className={styles.pageHeader}>
        <h1>公司货盘管理</h1>
      </div>
      
      {/* 搜索和筛选区域 */}
      <Card className={styles.filterCard}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Input
              placeholder="搜索产品名称、货号等信息"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              prefix={<SearchOutlined />}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="选择品牌"
              style={{ width: '100%' }}
              allowClear
              onChange={handleBrandChange}
              value={selectedBrandId}
            >
              {brands.map((brand) => (
                <Option key={brand.id} value={brand.id}>
                  {brand.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={handleSearch}>
              搜索
            </Button>
          </Col>
          <Col span={10} style={{ textAlign: 'right' }}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showAddModal}
              >
                添加产品
              </Button>
              <Button
                type="primary"
                icon={<ShareAltOutlined />}
                onClick={handleShare}
              >
                分享货盘
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
      
      <Divider />
      
      {/* 产品表格 */}
      <ProductTable
        products={items}
        pagination={pagination}
        loading={listLoading}
        onPageChange={handlePageChange}
        onEdit={showEditModal}
        onDelete={showDeleteModal}
      />
      
      {/* 添加产品模态框 */}
      {addModalVisible && (
        <AddProductModal
          visible={addModalVisible}
          onClose={handleModalClose}
          onSuccess={refreshProductList}
          brands={brands}
        />
      )}
      
      {/* 编辑产品模态框 */}
      {editModalVisible && selectedProductId && (
        <EditProductModal
          visible={editModalVisible}
          productId={selectedProductId}
          onClose={handleModalClose}
          onSuccess={refreshProductList}
          brands={brands}
        />
      )}
      
      {/* 删除确认模态框 */}
      {deleteModalVisible && selectedProductId && (
        <DeleteConfirmModal
          visible={deleteModalVisible}
          productId={selectedProductId}
          onClose={handleModalClose}
          onSuccess={refreshProductList}
        />
      )}
      
      {/* 分享货盘模态框 */}
      {shareModalVisible && shareData && (
        <SharePalletModal
          visible={shareModalVisible}
          shareUrl={shareData.share_url}
          qrcodeUrl={shareQRCode || ''}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default TotalPallet;
```

## 主要组件实现

### 价格档位表单组件

```typescript
// src/pages/pallet/TotalPallet/components/PriceTierForm.tsx

import React from 'react';
import { Button, Input, Space, Row, Col } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { PriceTier } from '../models/product';
import styles from './PriceTierForm.less';

interface PriceTierFormProps {
  tiers: PriceTier[];
  onChange: (tiers: PriceTier[]) => void;
}

const PriceTierForm: React.FC<PriceTierFormProps> = ({ tiers, onChange }) => {
  // 添加价格档位
  const handleAddTier = () => {
    const newTiers = [...tiers, { quantity: '', price: '' }];
    onChange(newTiers);
  };

  // 移除价格档位
  const handleRemoveTier = (index: number) => {
    const newTiers = [...tiers];
    newTiers.splice(index, 1);
    onChange(newTiers);
  };

  // 更新价格档位数据
  const handleTierChange = (index: number, field: 'quantity' | 'price', value: string) => {
    const newTiers = [...tiers];
    newTiers[index] = {
      ...newTiers[index],
      [field]: value
    };
    onChange(newTiers);
  };

  return (
    <div className={styles.priceTierForm}>
      {tiers.map((tier, index) => (
        <Row key={index} gutter={16} className={styles.tierRow}>
          <Col span={10}>
            <Input
              placeholder="一次性订购数量 如：500包"
              value={tier.quantity}
              onChange={(e) => handleTierChange(index, 'quantity', e.target.value)}
              addonAfter="包"
            />
          </Col>
          <Col span={10}>
            <Input
              placeholder="如：2.6元/包"
              value={tier.price}
              onChange={(e) => handleTierChange(index, 'price', e.target.value)}
              addonAfter="元"
            />
          </Col>
          <Col span={4}>
            {index > 0 && (
              <Button
                type="text"
                danger
                icon={<MinusCircleOutlined />}
                onClick={() => handleRemoveTier(index)}
                className={styles.removeBtn}
              />
            )}
          </Col>
        </Row>
      ))}
      
      <Button
        type="dashed"
        onClick={handleAddTier}
        icon={<PlusOutlined />}
        className={styles.addButton}
      >
        添加价格档位
      </Button>
      
      <div className={styles.tierTip}>
        注意：系统会自动按订购数量由小到大排序显示价格档位
      </div>
    </div>
  );
};

export default PriceTierForm;
```

### 附件上传组件

```typescript
// src/pages/pallet/TotalPallet/components/AttachmentUpload.tsx

import React, { useState } from 'react';
import { Upload, Button, message, Space } from 'antd';
import { UploadOutlined, DeleteOutlined, PaperClipOutlined, FileImageOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import styles from './AttachmentUpload.less';

interface AttachmentUploadProps {
  fileType: 'image' | 'file';
  maxCount: number;
  title: string;
  accept: string;
  tip: string;
  files: File[];
  onChange: (files: File[]) => void;
}

const AttachmentUpload: React.FC<AttachmentUploadProps> = ({
  fileType,
  maxCount,
  title,
  accept,
  tip,
  files,
  onChange
}) => {
  // 本地状态
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  
  // 文件列表变化处理
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // 过滤掉上传失败的文件
    const filteredFileList = newFileList.filter(file => !file.error);
    setFileList(filteredFileList);
    
    // 转换为File数组传递给父组件
    const newFiles = filteredFileList
      .filter(file => file.originFileObj)
      .map(file => file.originFileObj as File);
    
    onChange(newFiles);
  };
  
  // 文件上传前验证
  const beforeUpload = (file: File) => {
    // 检查文件类型
    const isAcceptedType = accept.split(',').some(type => {
      const suffix = type.toLowerCase();
      const fileName = file.name.toLowerCase();
      return fileName.endsWith(suffix.replace('.', ''));
    });
    
    if (!isAcceptedType) {
      message.error(`只支持${accept}格式的文件!`);
      return Upload.LIST_IGNORE;
    }
    
    // 检查文件大小
    const isLt20M = fileType === 'image' ? file.size / 1024 / 1024 < 20 : file.size / 1024 / 1024 < 50;
    if (!isLt20M) {
      message.error(`文件必须小于${fileType === 'image' ? '20MB' : '50MB'}!`);
      return Upload.LIST_IGNORE;
    }
    
    return true;
  };
  
  return (
    <div className={styles.uploadContainer}>
      <Upload
        listType={fileType === 'image' ? 'picture-card' : 'text'}
        fileList={fileList}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        maxCount={maxCount}
        accept={accept}
        multiple={maxCount > 1}
        customRequest={({ onSuccess }) => {
          setTimeout(() => {
            onSuccess?.({});
          }, 0);
        }}
        className={fileType === 'image' ? styles.imageUpload : styles.fileUpload}
      >
        {fileList.length >= maxCount ? null : (
          <div className={styles.uploadButton}>
            {fileType === 'image' ? (
              <Space direction="vertical" align="center">
                <FileImageOutlined className={styles.uploadIcon} />
                <div className={styles.uploadText}>{title}</div>
              </Space>
            ) : (
              <Button icon={<UploadOutlined />}>{title}</Button>
            )}
          </div>
        )}
      </Upload>
      
      <div className={styles.uploadTip}>{tip}</div>
      
      {fileList.length > 0 && fileType === 'file' && (
        <div className={styles.fileList}>
          {fileList.map((file, index) => (
            <div key={index} className={styles.fileItem}>
              <PaperClipOutlined className={styles.fileIcon} />
              <span className={styles.fileName}>{file.name}</span>
              <DeleteOutlined
                className={styles.deleteIcon}
                onClick={() => {
                  const newFileList = [...fileList];
                  newFileList.splice(index, 1);
                  setFileList(newFileList);
                  onChange(newFileList.map(f => f.originFileObj as File));
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentUpload;
```

## 表单验证规则

```typescript
// src/pages/pallet/TotalPallet/utils/validation.ts

import { Rule } from 'antd/es/form';

// 产品表单验证规则
export const productFormRules = {
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
    { max: 255, message: '产品链接最多255个字符' },
    {
      type: 'url',
      message: '请输入有效的URL地址'
    }
  ],
  owner_type: [
    { required: true, message: '拥有者类型不能为空' },
    {
      validator: (_, value) => {
        if (value && ['COMPANY', 'SELLER'].includes(value)) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('拥有者类型只能是COMPANY或SELLER'));
      }
    }
  ]
};

// 价格档位验证规则
export const priceTierRules = {
  quantity: [
    { required: true, message: '请输入订购数量' },
    {
      pattern: /^[1-9]\d*$/,
      message: '请输入正整数'
    }
  ],
  price: [
    { required: true, message: '请输入价格' },
    {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: '请输入合法的价格格式(最多两位小数)'
    }
  ]
};

// 自定义验证器：检查价格档位是否有重复
export const validatePriceTiers = (tiers: { quantity: string; price: string }[]) => {
  const quantities = tiers
    .filter(tier => tier.quantity)
    .map(tier => tier.quantity);
  
  const uniqueQuantities = new Set(quantities);
  
  return uniqueQuantities.size === quantities.length;
};
```

## 组件样式定义

### 产品表格样式

```less
// src/pages/pallet/TotalPallet/components/ProductTable.less

.productTable {
  :global {
    .ant-table-thead > tr > th {
      background-color: #f7f7f7;
      font-weight: 500;
    }
  }
}

.productImage {
  border-radius: 4px;
  object-fit: cover;
}

.noImage {
  width: 50px;
  height: 50px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;
  border-radius: 4px;
}

.editButton {
  padding: 0 4px;
}

.deleteButton {
  padding: 0 4px;
}
```

### 编辑产品模态框样式

```less
// src/pages/pallet/TotalPallet/components/EditProductModal.less

.editProductModal {
  :global {
    .ant-modal-body {
      padding: 24px;
    }
  }
}

.formContainer {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.loadingContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.sectionTitle {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  color: #333;
  border-left: 3px solid #1890ff;
  padding-left: 8px;
}

.tierDesc {
  color: #666;
  margin-bottom: 16px;
  font-size: 14px;
}

.existingAttachments {
  margin-bottom: 16px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  padding: 12px;
  background-color: #fafafa;
  
  h4 {
    margin-bottom: 12px;
    font-size: 14px;
    color: #333;
  }
}

.attachmentList {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.attachmentItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.attachmentImage {
  border-radius: 4px;
  object-fit: cover;
}

.materialList {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.materialItem {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.fileIcon {
  font-size: 16px;
  color: #1890ff;
}

.fileName {
  flex: 1;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.uploadSection {
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.uploadTitle {
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.formFooter {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
```

### 价格档位表单样式

```less
// src/pages/pallet/TotalPallet/components/PriceTierForm.less

.priceTierForm {
  margin-bottom: 16px;
}

.tierRow {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.removeBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff4d4f;
  
  &:hover {
    color: #ff7875;
  }
}

.addButton {
  width: 100%;
  margin-bottom: 12px;
}

.tierTip {
  color: #888;
  font-size: 13px;
  margin-top: 8px;
}
```

### 附件上传组件样式

```less
// src/pages/pallet/TotalPallet/components/AttachmentUpload.less

.uploadContainer {
  margin-bottom: 16px;
}

.imageUpload {
  :global {
    .ant-upload-list-picture-card-container {
      width: 104px;
      height: 104px;
    }
    
    .ant-upload.ant-upload-select-picture-card {
      width: 104px;
      height: 104px;
      border-radius: 4px;
    }
  }
}

.uploadButton {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.uploadIcon {
  font-size: 24px;
  color: #1890ff;
}

.uploadText {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

.uploadTip {
  color: #888;
  font-size: 12px;
  margin-top: 8px;
  line-height: 1.5;
}

.fileList {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fileItem {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.fileIcon {
  color: #1890ff;
  margin-right: 8px;
}

.fileName {
  flex: 1;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.deleteIcon {
  color: #ff4d4f;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    color: #ff7875;
  }
}
```

## 页面样式

```less
// src/pages/pallet/TotalPallet/index.less

.container {
  padding: 24px;
  background-color: #f0f2f5;
  min-height: 100vh;
}

.pageHeader {
  margin-bottom: 24px;
  
  h1 {
    font-size: 24px;
    font-weight: 500;
    margin: 0;
    color: #333;
  }
}

.filterCard {
  margin-bottom: 24px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

// 主题和品牌色定义
:global {
  .ant-btn-primary {
    background-color: #1890ff;
  }
  
  .ant-table-container {
    background-color: #fff;
    border-radius: 4px;
    overflow: hidden;
  }
}
```

## 权限与路由配置

```typescript
// src/routes/config.ts

import { lazy } from 'react';
import { RouteConfig } from '@/types/route';

// 懒加载组件
const TotalPallet = lazy(() => import('@/pages/pallet/TotalPallet'));

// 公司货盘管理路由配置
export const palletRoutes: RouteConfig[] = [
  {
    path: '/pallet/company',
    component: TotalPallet,
    exact: true,
    authority: ['admin'], // 仅管理员可访问
    name: '公司货盘管理',
    icon: 'AppstoreOutlined',
    menu: true
  }
];
```

## 数据一致性与校验

为确保前端表单数据与数据库字段严格一致，本规范中特别注意了以下几点：

1. **字段类型匹配**：
   - 所有字符串类型字段(VARCHAR)确保在前端做长度限制与数据库一致
   - 数字类型字段确保做数值范围校验
   - 日期时间类型统一使用ISO标准格式

2. **必填字段校验**：
   - 产品名称(name)：VARCHAR(255)，必填
   - 品牌ID(brand_id)：INTEGER，必填
   - 产品货号(product_code)：VARCHAR(100)，必填
   - 拥有者类型(owner_type)：VARCHAR(20)，必填，固定值'COMPANY'

3. **枚举值验证**：
   - owner_type：限制为'COMPANY'或'SELLER'，并在表单提交前验证
   - file_type：限制为'IMAGE'或'MATERIAL'，并在上传组件中验证

4. **价格档位校验**：
   - quantity(数量)：确保为正整数
   - price(价格)：确保为数字，最多两位小数
   - 确保每个档位的数量不重复

## 性能优化与最佳实践

1. **懒加载与代码分割**：
   - 使用React.lazy()懒加载组件
   - 优先考虑组件拆分，保持单一职责原则

2. **表单处理优化**：
   - 使用Form.Item的shouldUpdate属性控制表单项重渲染
   - 添加/编辑表单共用组件，通过属性控制不同行为

3. **数据流管理**：
   - 使用Redux集中管理状态
   - 通过ActionCreator统一处理异步操作
   - 本地状态与全局状态职责分明

4. **条件渲染优化**：
   - 使用短路求值和三元表达式优化条件渲染
   - Modal组件使用destroyOnClose属性避免状态污染

5. **API请求优化**：
   - 批量处理API请求，减少网络往返
   - 添加适当的错误处理和重试机制
   - 使用乐观更新提升用户体验

## 可访问性与兼容性

1. **支持键盘导航**：所有可交互元素均可通过键盘访问和操作

2. **响应式设计**：
   - 适配不同屏幕尺寸(桌面、平板)
   - 表格组件使用水平滚动处理小屏幕

3. **兼容性要求**：
   - 支持主流现代浏览器：Chrome、Firefox、Edge、Safari最新版
   - 不支持IE浏览器

4. **多语言支持准备**：
   - 文本内容使用国际化方案，便于后续支持多语言

## 开发与测试建议

1. **组件开发顺序**：
   - 先开发数据模型与API接口
   - 再开发Redux状态管理
   - 接着开发主要UI组件
   - 最后集成路由与权限

2. **测试重点**：
   - 表单验证逻辑：必填项、字段类型、长度限制等
   - API交互：请求参数、响应处理、错误处理
   - 用户权限：管理员/销售员权限区分
   - 性能测试：大量数据下的列表性能、图片加载性能

3. **关键业务逻辑测试**：
   - 价格档位排序与显示
   - 附件上传与删除
   - 产品添加/编辑/删除流程
   - 分享功能生成链接与二维码

通过严格遵循本规范，可以确保公司总货盘管理页面的开发质量与一致性，同时保证前后端数据交互的准确性。