# 货盘分享浏览页面开发规范

## 1. 页面概述

货盘分享浏览页面是一个无需登录即可访问的公开页面，用于展示销售员分享的货盘产品列表。客户可以通过链接查看销售员的产品详情、价格档位，并可直接联系销售员。此页面支持多种设备访问，确保在不同屏幕尺寸下都能良好显示。

### 1.1 访问路径

- 路由路径：`/share/{token}`
- 权限要求：无需登录，公开访问
- 特性说明：链接永不过期，确保客户可随时访问销售员的最新货盘产品

### 1.2 功能特性

- 销售员信息展示（联系方式、微信二维码）
- 销售员店铺链接展示
- 产品列表展示（表格形式）
- 产品价格档位查看
- 多平台适配（PC端、移动端）
- 分页浏览功能

## 2. 页面组件结构

### 2.1 组件树

```
PalletShareViewPage
├── ShareHeader                  // 顶部品牌展示区
│   ├── BrandLogo               // 品牌标识
│   └── BrandSlogan             // 品牌宣传语
├── SellerInfoSection           // 销售员信息区域
│   ├── SellerContactCard       // 销售员联系信息卡片
│   │   ├── SellerAvatar        // 销售员头像
│   │   ├── SellerInfo          // 销售员基本信息
│   │   └── WechatQRCode        // 微信二维码
│   └── StoreLinksSection       // 店铺链接区域
│       └── StoreLinkButton     // 店铺链接按钮（多个）
├── ProductsTableSection        // 产品列表区域
│   ├── ProductsTable           // 产品数据表格
│   │   └── PriceTierCell       // 价格档位单元格
│   └── PaginationControls      // 分页控制组件
└── FooterSection               // 页脚区域
```

### 2.2 组件职责

#### ShareHeader（顶部展示组件）
- 展示帮你(BāngNí)品牌Logo
- 展示品牌标语
- 展示功能标签（"厂家直供"、"质量产品"等）

#### SellerInfoSection（销售员信息组件）
- 显示销售员基本信息（头像、姓名、电话）
- 展示销售员微信二维码
- 提供店铺链接区域

#### SellerContactCard（联系信息卡片）
- 展示销售员头像
- 显示"产品专家"标签和销售员姓名
- 提供销售员联系电话
- 展示微信号和提示文本

#### StoreLinksSection（店铺链接区域）
- 提供各平台店铺链接按钮
- 每个按钮显示平台图标、平台名称和店铺名称

#### ProductsTableSection（产品列表区域）
- 以表格形式展示产品列表
- 提供产品图片、名称、规格等信息的展示
- 提供价格档位展示
- 支持表格排序功能

#### ProductsTable（产品数据表格）
- 负责产品数据的表格渲染
- 处理表格列的显示与隐藏
- 处理移动端适配（响应式设计）

#### PriceTierCell（价格档位单元格）
- 展示产品的不同价格档位
- 展示对应的数量区间
- 特殊样式突出显示价格信息

#### PaginationControls（分页控制组件）
- 显示总记录数
- 提供页码导航
- 支持每页显示数量调整

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
  name: string;            // 销售员姓名
  phone: string;           // 电话号码
  email: string;           // 邮箱
  status: string;          // 状态
  wechat_qrcode: string;   // 微信二维码URL
  stores: Store[];         // 销售员的店铺列表
}

// 店铺数据模型
interface Store {
  id: number;              // 店铺ID
  platform: string;        // 平台名称
  name: string;            // 店铺名称
  url: string;             // 店铺URL
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
  owner_type: string;      // 拥有者类型
  owner_id: number;        // 拥有者ID
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
  created_at: string;      // 创建时间
  updated_at: string;      // 更新时间
  price_tiers: PriceTier[]; // 价格档位列表
  attachments: Attachment[]; // 产品图片列表
}

// 分页数据模型
interface PaginationData {
  current_page: number;    // 当前页码
  total_pages: number;     // 总页数
  total_count: number;     // 总记录数
}

// 附件模型
interface Attachment {
  id: number;              // 附件ID
  entity_type: string;     // 实体类型
  entity_id: number;       // 实体ID
  file_name: string;       // 文件名
  file_type: string;       // 文件类型
  file_path: string;       // 文件路径
  file_size: number;       // 文件大小
  created_at: string;      // 创建时间
}

// 货盘分享响应模型
interface ShareResponse {
  code: number;            // 状态码
  data: {
    share: ShareData;      // 分享数据
    seller: Seller;        // 销售员信息
    products: {
      items: Product[];    // 产品列表
      meta: PaginationData; // 分页信息
    }
  };
  message: string;         // 消息
}
``` 

# 货盘分享浏览页面开发规范（续）

### 3.2 状态管理

使用Redux Toolkit管理货盘分享页面的状态：

```typescript
// palletShare Slice
const palletShareSlice = createSlice({
  name: 'palletShare',
  initialState: {
    share: null,            // 分享信息
    seller: null,           // 销售员信息
    products: {             // 产品相关
      list: [],             // 产品列表
      loading: false,       // 加载状态
      error: null           // 错误信息
    },
    pagination: {           // 分页信息
      current: 1,           // 当前页码
      pageSize: 20,         // 每页显示数量
      total: 0              // 总记录数
    },
    detailVisible: false,   // 产品详情弹窗可见状态
    currentProduct: null,   // 当前查看的产品
    imagePreviewVisible: false,  // 图片预览可见状态
    currentImage: ''        // 当前预览的图片URL
  },
  reducers: {
    // 设置分享信息
    setShareInfo: (state, action) => {
      state.share = action.payload;
    },
    // 设置销售员信息
    setSellerInfo: (state, action) => {
      state.seller = action.payload;
    },
    // 设置产品列表
    setProducts: (state, action) => {
      state.products.list = action.payload;
    },
    // 设置分页信息
    setPagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload
      };
    },
    // 切换产品详情弹窗
    toggleDetailModal: (state, action) => {
      state.detailVisible = action.payload;
    },
    // 设置当前产品
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    // 切换图片预览
    toggleImagePreview: (state, action) => {
      state.imagePreviewVisible = action.payload.visible;
      if (action.payload.imageUrl) {
        state.currentImage = action.payload.imageUrl;
      }
    }
  },
  extraReducers: (builder) => {
    // 处理异步action
    builder
      .addCase(fetchShareData.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(fetchShareData.fulfilled, (state, action) => {
        state.products.loading = false;
        state.share = action.payload.share;
        state.seller = action.payload.seller;
        state.products.list = action.payload.products.items;
        state.pagination = {
          current: action.payload.products.meta.current_page,
          pageSize: state.pagination.pageSize,
          total: action.payload.products.meta.total_count
        };
      })
      .addCase(fetchShareData.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload;
      });
  }
});
```

## 4. API调用

### 4.1 API接口定义

```typescript
// api/share.js
import request from '../utils/request';

// 获取货盘分享数据
export function getShareData(token, params) {
  return request({
    url: `/api/pallet/share/${token}`,
    method: 'get',
    params
  });
}

// 记录客户访问日志
export function logCustomerAccess(shareId, data) {
  return request({
    url: `/api/pallet/stats/customer-log`,
    method: 'post',
    data: {
      share_id: shareId,
      ...data
    }
  });
}

// 获取产品素材包
export function getProductAssets(productId) {
  return request({
    url: `/api/pallet/products/${productId}/assets`,
    method: 'get',
    responseType: 'blob'
  });
}
```

### 4.2 API调用时机

| 功能 | 调用时机 | API方法 |
|------|----------|---------|
| 获取分享数据 | 页面加载、分页切换、筛选条件变更 | `getShareData` |
| 记录访问日志 | 页面首次加载完成后 | `logCustomerAccess` |
| 下载产品素材 | 点击素材包图标时 | `getProductAssets` |

### 4.3 异步操作处理

使用Redux Toolkit的createAsyncThunk处理异步操作：

```typescript
// 获取货盘分享数据异步action
export const fetchShareData = createAsyncThunk(
  'palletShare/fetchData',
  async ({ token, params }, { rejectWithValue }) => {
    try {
      const response = await getShareData(token, params);
      
      // 记录客户访问日志
      if (response.data?.share?.id) {
        try {
          await logCustomerAccess(response.data.share.id, {
            ip_address: window.clientIP || '',
            user_agent: navigator.userAgent
          });
        } catch (error) {
          console.error('记录访问日志失败', error);
          // 不影响主流程，忽略此错误
        }
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 下载产品素材包异步action
export const downloadProductAssets = createAsyncThunk(
  'palletShare/downloadAssets',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await getProductAssets(productId);
      
      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `产品素材包_${productId}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
```

### 4.4 请求响应格式

#### 获取分享数据接口

- **请求路径**：`GET /api/pallet/share/{token}`
- **请求参数**：
  ```json
  {
    "page": 1,
    "page_size": 20,
    "search": "关键词",
    "brand_id": 123,
    "sort_field": "created_at",
    "sort_order": "desc"
  }
  ```

- **响应格式**：
  ```json
  {
    "code": 200,
    "data": {
      "share": {
        "id": 123,
        "user_id": 456,
        "token": "abc123xyz456...",
        "share_type": "FULL",
        "created_at": "2025-03-20T08:00:00Z",
        "last_accessed": "2025-04-10T10:15:00Z",
        "access_count": 27
      },
      "seller": {
        "id": 456,
        "name": "销售员姓名",
        "phone": "13800138000",
        "email": "seller@example.com",
        "status": "ACTIVE",
        "wechat_qrcode": "/uploads/qrcode/123.jpg",
        "stores": [
          {
            "id": 789,
            "platform": "抖音",
            "name": "店铺名称", 
            "url": "https://example.com/shop"
          }
        ]
      },
      "products": {
        "items": [
          {
            "id": 1001,
            "owner_type": "SELLER",
            "owner_id": 456,
            "name": "产品名称",
            "brand_id": 789,
            "brand_name": "品牌名称",
            "product_code": "PD001",
            "specification": "产品规格",
            "net_content": "净含量",
            "product_size": "产品尺寸",
            "shipping_method": "发货方式",
            "shipping_spec": "发货规格",
            "shipping_size": "发货尺寸",
            "product_url": "https://example.com/product",
            "created_at": "2025-03-15T08:00:00Z",
            "updated_at": "2025-04-01T10:15:00Z",
            "price_tiers": [
              {
                "id": 101,
                "product_id": 1001,
                "quantity": "1-9",
                "price": "100.00",
                "created_at": "2025-03-15T08:00:00Z"
              },
              {
                "id": 102,
                "product_id": 1001,
                "quantity": "10-99",
                "price": "95.00",
                "created_at": "2025-03-15T08:00:00Z"
              },
              {
                "id": 103,
                "product_id": 1001,
                "quantity": "100+",
                "price": "90.00",
                "created_at": "2025-03-15T08:00:00Z"
              }
            ],
            "attachments": [
              {
                "id": 201,
                "entity_type": "PRODUCT",
                "entity_id": 1001,
                "file_name": "product_image.jpg",
                "file_type": "IMAGE",
                "file_path": "/uploads/products/1001/product_image.jpg",
                "file_size": 1024000,
                "created_at": "2025-03-15T08:00:00Z"
              }
            ]
          }
        ],
        "meta": {
          "current_page": 1,
          "total_pages": 5,
          "total_count": 100
        }
      }
    },
    "message": "获取成功"
  }
```

## 5. UI组件实现

### 5.1 主页面组件

```tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  Layout, 
  Typography, 
  Spin, 
  Empty, 
  Pagination, 
  Select,
  Alert
} from 'antd';
import { fetchShareData } from '../store/actions/palletShareActions';
import ShareHeader from '../components/PalletShare/ShareHeader';
import SellerInfoSection from '../components/PalletShare/SellerInfoSection';
import ProductsTableSection from '../components/PalletShare/ProductsTableSection';
import FooterSection from '../components/PalletShare/FooterSection';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const PalletShareViewPage = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const { 
    share, 
    seller, 
    products, 
    pagination,
    loading,
    error 
  } = useSelector(state => state.palletShare);
  
  const [pageSize, setPageSize] = useState(20);
  
  useEffect(() => {
    if (token) {
      dispatch(fetchShareData({
        token,
        params: {
          page: 1,
          page_size: pageSize
        }
      }));
    }
  }, [dispatch, token, pageSize]);
  
  const handlePageChange = (page, pageSize) => {
    dispatch(fetchShareData({
      token,
      params: {
        page,
        page_size: pageSize
      }
    }));
  };
  
  const handlePageSizeChange = (size) => {
    setPageSize(size);
  };
  
  if (error) {
    return (
      <Layout>
        <Content className="pallet-share-container">
          <Alert 
            message="无法加载货盘信息" 
            description="该分享链接可能已失效或不存在，请联系销售员获取新的链接。" 
            type="error" 
            showIcon 
          />
        </Content>
      </Layout>
    );
  }
  
  return (
    <Layout className="pallet-share-layout">
      <ShareHeader />
      
      <Content className="pallet-share-container">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" tip="加载中..." />
          </div>
        ) : (
          <>
            {seller ? (
              <>
                <SellerInfoSection seller={seller} />
                
                {products.list.length > 0 ? (
                  <>
                    <ProductsTableSection 
                      products={products.list} 
                      loading={products.loading}
                    />
                    
                    <div className="pagination-container">
                      <div className="pagination-info">
                        总计：{pagination.total}条记录
                      </div>
                      <div className="pagination-size-changer">
                        <span>每页显示：</span>
                        <Select 
                          value={pageSize} 
                          onChange={handlePageSizeChange}
                        >
                          <Option value={10}>10条/页</Option>
                          <Option value={20}>20条/页</Option>
                          <Option value={50}>50条/页</Option>
                          <Option value={100}>100条/页</Option>
                        </Select>
                      </div>
                      <Pagination 
                        current={pagination.current}
                        total={pagination.total}
                        pageSize={pagination.pageSize}
                        onChange={handlePageChange}
                        showQuickJumper
                        showSizeChanger={false}
                      />
                    </div>
                  </>
                ) : (
                  <Empty 
                    description="暂无产品信息" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  />
                )}
              </>
            ) : (
              <Empty 
                description="销售员信息不存在" 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
              />
            )}
          </>
        )}
      </Content>
      
      <FooterSection />
    </Layout>
  );
};

export default PalletShareViewPage;
```

### 5.2 ShareHeader组件

```tsx
import React from 'react';
import { Layout, Typography, Space, Tag } from 'antd';
import styled from 'styled-components';
import LogoImage from '../../assets/images/brand-logo.png';

const { Header } = Layout;
const { Title, Text } = Typography;

const StyledHeader = styled(Header)`
  background-color: #fff;
  padding: 16px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  height: auto;
  
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }
  
  .logo-section {
    display: flex;
    align-items: center;
    
    .brand-logo {
      width: 120px;
      height: 40px;
      margin-right: 16px;
    }
    
    .brand-slogan {
      color: #666;
      max-width: 500px;
      
      @media (max-width: 768px) {
        max-width: 100%;
        margin-top: 8px;
      }
    }
  }
  
  .tags-section {
    display: flex;
    flex-wrap: wrap;
    margin-top: 12px;
    
    .feature-tag {
      margin-right: 8px;
      margin-bottom: 8px;
    }
  }
`;

const ShareHeader = () => {
  // 功能标签数据
  const featureTags = [
    { key: 'direct', label: '厂家直供', color: '#1890ff' },
    { key: 'quality', label: '质量产品', color: '#52c41a' },
    { key: 'original', label: '品质正品', color: '#faad14' },
    { key: 'trust', label: '信任售卖', color: '#722ed1' },
    { key: 'fast', label: '快速发货', color: '#eb2f96' },
    { key: 'dropship', label: '一件代发', color: '#fa541c' },
    { key: 'renewal', label: '可续费率', color: '#13c2c2' }
  ];

  return (
    <StyledHeader>
      <div className="header-container">
        <div className="logo-section">
          <img 
            src={LogoImage} 
            alt="帮你(BāngNí)品牌" 
            className="brand-logo" 
          />
          <Text className="brand-slogan">
            严苛产品品控 极速发货确保时效 保证无售售后 为您提供全方位的优质代发服务！
          </Text>
        </div>
      </div>
      
      <div className="tags-section">
        {featureTags.map(tag => (
          <Tag 
            key={tag.key} 
            color={tag.color} 
            className="feature-tag"
          >
            {tag.label}
          </Tag>
        ))}
      </div>
    </StyledHeader>
  );
};

export default ShareHeader;
```

### 5.3 SellerContactCard组件

```tsx
import React from 'react';
import { Card, Avatar, Typography, Space, Divider } from 'antd';
import { PhoneOutlined, UserOutlined, WechatOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Text, Title } = Typography;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
  .seller-card-content {
    display: flex;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
  
  .seller-info-section {
    flex: 1;
    
    .seller-avatar {
      width: 64px;
      height: 64px;
      margin-bottom: 12px;
    }
    
    .seller-role {
      color: #8c8c8c;
      margin-bottom: 4px;
    }
    
    .seller-name {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    
    .seller-phone {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 16px;
    }
    
    .wechat-tip {
      color: #666;
    }
  }
  
  .qrcode-section {
    width: 160px;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    @media (max-width: 768px) {
      width: 100%;
      margin-top: 16px;
    }
    
    .qrcode-image {
      width: 140px;
      height: 140px;
      border: 1px solid #eee;
      padding: 4px;
    }
  }
`;

const SellerContactCard = ({ seller }) => {
  return (
    <StyledCard>
      <div className="seller-card-content">
        <div className="seller-info-section">
          <Avatar 
            size={64} 
            icon={<UserOutlined />} 
            src={seller.avatar} 
            className="seller-avatar" 
          />
          
          <Text className="seller-role">产品专家：</Text>
          <Title level={4} className="seller-name">{seller.name}</Title>
          
          <Space className="seller-phone">
            <PhoneOutlined />
            <a href={`tel:${seller.phone}`}>{seller.phone}</a>
          </Space>
          
          <Space className="wechat-hint">
            <WechatOutlined />
            <Text className="wechat-tip">右侧二维码是我的微信，欢迎扫码！</Text>
          </Space>
        </div>
        
        <Divider type="vertical" style={{ height: 'auto' }} />
        
        <div className="qrcode-section">
          {seller.wechat_qrcode ? (
            <img 
              src={seller.wechat_qrcode} 
              alt="微信二维码" 
              className="qrcode-image" 
            />
          ) : (
            <Text>暂无微信二维码</Text>
          )}
        </div>
      </div>
    </StyledCard>
  );
};

export default SellerContactCard;
```

### 5.4 ProductsTable组件

```tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Table, 
  Button, 
  Image, 
  Tooltip, 
  Tag,
  Space
} from 'antd';
import { 
  FileZipOutlined, 
  LinkOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { toggleImagePreview, downloadProductAssets } from '../../store/actions/palletShareActions';
import styled from 'styled-components';

const StyledTable = styled(Table)`
  .product-img-cell {
    width: 80px;
    height: 80px;
    cursor: pointer;
    border: 1px solid #f0f0f0;
    transition: all 0.3s;
    
    &:hover {
      border-color: #1890ff;
      transform: scale(1.05);
    }
  }
  
  .price-tier-tag {
    margin-bottom: 8px;
    width: 100%;
    text-align: center;
    
    .quantity {
      color: #666;
    }
    
    .price {
      color: #f5222d;
      font-weight: 500;
    }
  }
  
  .action-button {
    margin-right: 8px;
  }
`;

const ProductsTable = ({ products, loading }) => {
  const dispatch = useDispatch();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  
  const handleImagePreview = (imageUrl) => {
    dispatch(toggleImagePreview({ 
      visible: true, 
      imageUrl 
    }));
  };
  
  const handleDownloadAssets = (productId) => {
    dispatch(downloadProductAssets(productId));
  };
  
  const handleExpand = (expanded, record) => {
    setExpandedRowKeys(expanded ? [record.id] : []);
  };
  
  // 获取产品主图URL
  const getProductMainImage = (product) => {
    if (product.attachments && product.attachments.length > 0) {
      const mainImage = product.attachments.find(
        att => att.file_type === 'IMAGE'
      );
      return mainImage ? mainImage.file_path : '';
    }
    return '';
  };
  
  // 表格列定义
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      fixed: 'left',
      render: (_, __, index) => index + 1
    },
    {
      title: '产品图片',
      dataIndex: 'attachments',
      key: 'image',
      width: 100,
      render: (_, record) => {
        const imageUrl = getProductMainImage(record);
        return imageUrl ? (
          <Image 
            src={imageUrl}
            alt={record.name}
            className="product-img-cell"
            preview={false}
            onClick={() => handleImagePreview(imageUrl)}
          />
        ) : (
          <div className="no-image">暂无图片</div>
        );
      }
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: 200,
    },
    {
      title: '品牌',
      dataIndex: 'brand_name',
      key: 'brand',
      width: 100,
    },
    {
      title: '货号',
      dataIndex: 'product_code',
      key: 'product_code',
      width: 120,
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      width: 120,
      ellipsis: true,
    },
    {
      title: '净含量',
      dataIndex: 'net_content',
      key: 'net_content',
      width: 100,
    },
    {
      title: '产品尺寸',
      dataIndex: 'product_size',
      key: 'product_size',
      width: 100,
    },
    {
      title: '发货方式',
      dataIndex: 'shipping_method',
      key: 'shipping_method',
      width: 100,
    },
    {
      title: '发货规格',
      dataIndex: 'shipping_spec',
      key: 'shipping_spec',
      width: 100,
    },
    {
      title: '发货尺寸',
      dataIndex: 'shipping_size',
      key: 'shipping_size',
      width: 100,
    },
    {
      title: '价格档位',
      dataIndex: 'price_tiers',
      key: 'price_tiers',
      width: 180,
      render: (priceTiers) => (
        <div className="price-tiers-container">
          {priceTiers && priceTiers.length > 0 ? (
            priceTiers.map(tier => (
              <Tag key={tier.id} className="price-tier-tag">
                <span className="quantity">{tier.quantity}</span>：
                <span className="price">¥{tier.price}</span>
              </Tag>
            ))
          ) : (
            <span>暂无价格信息</span>
          )}
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="下载素材包">
            <Button
              icon={<FileZipOutlined />}
              className="action-button"
              onClick={() => handleDownloadAssets(record.id)}
            />
          </Tooltip>
          
          {record.product_url && (
            <Tooltip title="查看产品链接">
              <Button
                icon={<LinkOutlined />}
                className="action-button"
                onClick={() => window.open(record.product_url, '_blank')}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];
  
  return (
    <StyledTable
      columns={columns}
      dataSource={products}
      rowKey="id"
      loading={loading}
      pagination={false}
      scroll={{ x: 1500 }}
      expandable={{
        expandedRowKeys,
        onExpand: handleExpand,
        expandIcon: ({ expanded, onExpand, record }) => (
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={e => onExpand(record, e)}
          >
            {expanded ? '收起详情' : '查看详情'}
          </Button>
        ),
        expandedRowRender: record => (
          <div className="product-detail-expanded">
            <p><strong>产品名称：</strong> {record.name}</p>
            <p><strong>产品规格：</strong> {record.specification}</p>
            <p><strong>净含量：</strong> {record.net_content}</p>
            <p><strong>产品尺寸：</strong> {record.product_size}</p>
            <p><strong>发货方式：</strong> {record.shipping_method}</p>
            <p><strong>发货规格：</strong> {record.shipping_spec}</p>
            <p><strong>发货尺寸：</strong> {record.shipping_size}</p>
            {record.product_url && (
              <p>
                <strong>产品链接：</strong> 
                <a href={record.product_url} target="_blank" rel="noopener noreferrer">
                  {record.product_url}
                </a>
              </p>
            )}
          </div>
        )
      }}
    />
  );
};

export default ProductsTable;
```

## 6. 交互逻辑

### 6.1 页面加载流程

1. 根据URL中的token参数初始化页面
2. 发起API请求获取分享数据
3. 显示加载状态(Loading)
4. 数据加载完成后渲染页面内容
5. 后台记录客户访问日志

### 6.2 用户交互处理

#### 6.2.1 产品图片预览

```tsx
// 图片预览组件
const ImagePreviewModal = ({ visible, imageUrl, onClose }) => {
  return (
    <Image
      preview={{
        visible,
        src: imageUrl,
        onVisibleChange: onClose
      }}
      src={imageUrl}
      style={{ display: 'none' }}
    />
  );
};

// 在主页面中使用
const PalletShareViewPage = () => {
  // ...其他代码
  const { imagePreviewVisible, currentImage } = useSelector(state => state.palletShare);
  
  const handleCloseImagePreview = () => {
    dispatch(toggleImagePreview({ visible: false }));
  };
  
  return (
    <Layout>
      {/* ...其他组件 */}
      
      <ImagePreviewModal
        visible={imagePreviewVisible}
        imageUrl={currentImage}
        onClose={handleCloseImagePreview}
      />
    </Layout>
  );
};
```

#### 6.2.2 分页控制处理

```tsx
// 分页组件封装
const PaginationControls = ({ 
  current, 
  total, 
  pageSize, 
  onPageChange, 
  onPageSizeChange 
}) => {
  return (
    <div className="pagination-container">
      <div className="pagination-info">
        总计：{total}条记录
      </div>
      <div className="pagination-size-changer">
        <span>每页显示：</span>
        <Select 
          value={pageSize} 
          onChange={onPageSizeChange}
        >
          <Option value={10}>10条/页</Option>
          <Option value={20}>20条/页</Option>
          <Option value={50}>50条/页</Option>
          <Option value={100}>100条/页</Option>
        </Select>
      </div>
      <Pagination 
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={onPageChange}
        showQuickJumper
        showSizeChanger={false}
      />
    </div>
  );
};
```

#### 6.2.3 联系销售员功能

```tsx
// 在SellerContactCard组件中实现
const SellerContactCard = ({ seller }) => {
  const handlePhoneCall = (phoneNumber) => {
    // 使用tel:协议在移动设备上直接拨打电话
    window.location.href = `tel:${phoneNumber}`;
  };
  
  return (
    <StyledCard>
      {/* ...其他内容 */}
      <Space className="seller-phone">
        <PhoneOutlined />
        <a onClick={() => handlePhoneCall(seller.phone)}>
          {seller.phone}
        </a>
      </Space>
      {/* ...其他内容 */}
    </StyledCard>
  );
};
```

## 7. 响应式设计

### 7.1 断点设置

```scss
// 响应式断点变量
$breakpoints: (
  'xs': 576px,   // 超小屏幕，如手机竖屏
  'sm': 768px,   // 小屏幕，如手机横屏、小平板
  'md': 992px,   // 中等屏幕，如平板、小显示器
  'lg': 1200px,  // 大屏幕，如桌面显示器
  'xl': 1600px   // 超大屏幕，如大显示器
);

// 响应式混合宏
@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (max-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  } @else {
    @warn "未知的断点: #{$breakpoint}";
  }
}
```

### 7.2 响应式布局策略

#### 7.2.1 整体布局响应

```scss
// 容器响应式适配
.pallet-share-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  
  @include respond-to('lg') {
    max-width: 100%;
    padding: 20px;
  }
  
  @include respond-to('md') {
    padding: 16px;
  }
  
  @include respond-to('sm') {
    padding: 12px;
  }
  
  @include respond-to('xs') {
    padding: 8px;
  }
}

// Flex布局响应式调整
.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  
  @include respond-to('md') {
    gap: 16px;
  }
  
  @include respond-to('sm') {
    gap: 12px;
    flex-direction: column;
  }
}
```

#### 7.2.2 组件响应式处理

1. **顶部标题区域**

```scss
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @include respond-to('md') {
    flex-direction: column;
    align-items: flex-start;
    
    .brand-slogan {
      margin-top: 12px;
      max-width: 100%;
    }
  }
  
  .feature-tags {
    @include respond-to('sm') {
      width: 100%;
      margin-top: 16px;
      
      .feature-tag {
        margin-bottom: 8px;
      }
    }
  }
}
```

2. **销售员信息卡片**

```scss
.seller-info-card {
  @include respond-to('md') {
    .seller-card-content {
      flex-direction: column;
      
      .seller-info-section {
        margin-bottom: 16px;
      }
      
      .qrcode-section {
        width: 100%;
        justify-content: center;
        margin-top: 16px;
      }
    }
  }
}
```

3. **店铺链接区域**

```scss
.store-links-container {
  @include respond-to('sm') {
    flex-direction: column;
    
    .store-link-button {
      width: 100%;
      margin-right: 0;
      margin-bottom: 8px;
    }
  }
}
```

### 7.3 移动端适配

#### 7.3.1 表格组件适配

针对移动设备，表格显示需要特殊处理：

```tsx
// 移动端表格列定义
const getMobileColumns = () => [
  {
    title: '产品信息',
    key: 'product',
    render: (_, record) => {
      const imageUrl = getProductMainImage(record);
      return (
        <div className="mobile-product-cell">
          <div className="product-image">
            {imageUrl ? (
              <Image 
                src={imageUrl}
                alt={record.name}
                className="product-img-cell"
                preview={false}
                onClick={() => handleImagePreview(imageUrl)}
              />
            ) : (
              <div className="no-image">暂无图片</div>
            )}
          </div>
          <div className="product-info">
            <div className="product-name">{record.name}</div>
            <div className="product-code">货号: {record.product_code}</div>
            <div className="product-brand">品牌: {record.brand_name}</div>
          </div>
        </div>
      );
    }
  },
  {
    title: '价格档位',
    key: 'prices',
    render: (_, record) => (
      <div className="mobile-price-cell">
        {record.price_tiers && record.price_tiers.length > 0 ? (
          record.price_tiers.map(tier => (
            <Tag key={tier.id} className="price-tier-tag">
              <span className="quantity">{tier.quantity}</span>：
              <span className="price">¥{tier.price}</span>
            </Tag>
          ))
        ) : (
          <span>暂无价格信息</span>
        )}
      </div>
    )
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space>
        <Button
          icon={<EyeOutlined />}
          onClick={() => handleExpand(!expandedRowKeys.includes(record.id), record)}
        >
          详情
        </Button>
        <Button
          icon={<FileZipOutlined />}
          onClick={() => handleDownloadAssets(record.id)}
        >
          素材
        </Button>
      </Space>
    )
  }
];

// 在ProductsTable组件中实现响应式表格
const ProductsTable = ({ products, loading }) => {
  // ...其他代码
  
  // 使用useMediaQuery钩子检测屏幕尺寸
  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  // 根据屏幕尺寸选择不同的列配置
  const tableColumns = isMobile ? getMobileColumns() : columns;
  
  return (
    <StyledTable
      columns={tableColumns}
      dataSource={products}
      rowKey="id"
      loading={loading}
      pagination={false}
      scroll={isMobile ? undefined : { x: 1500 }}
      // 移动端特殊样式配置
      className={isMobile ? 'mobile-table' : ''}
      expandable={{
        // ...展开配置
      }}
    />
  );
};
```

#### 7.3.2 移动端样式调整

```scss
// 移动端专用样式
@include respond-to('sm') {
  .mobile-table {
    .ant-table-thead {
      display: none;
    }
    
    .ant-table-tbody > tr > td {
      display: block;
      width: 100%;
      border-bottom: none;
      padding: 8px;
      
      &:last-child {
        border-bottom: 1px solid #f0f0f0;
        padding-bottom: 16px;
      }
    }
    
    .mobile-product-cell {
      display: flex;
      
      .product-image {
        width: 80px;
        margin-right: 12px;
      }
      
      .product-info {
        flex: 1;
        
        .product-name {
          font-weight: 500;
          font-size: 16px;
          margin-bottom: 4px;
        }
        
        .product-code,
        .product-brand {
          color: #666;
          font-size: 14px;
          margin-bottom: 4px;
        }
      }
    }
  }
  
  // 分页控件移动端适配
  .pagination-container {
    flex-direction: column;
    align-items: flex-start;
    
    .pagination-info {
      margin-bottom: 12px;
    }
    
    .pagination-size-changer {
      margin-bottom: 12px;
    }
    
    .ant-pagination {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
}
```

### 7.4 图片响应式处理

为确保在各种设备上图片显示正常，需要实现响应式图片处理：

```scss
// 响应式图片基础样式
.responsive-image {
  max-width: 100%;
  height: auto;
}

// 产品图片响应式处理
.product-img-cell {
  width: 80px;
  height: 80px;
  object-fit: cover;
  
  @include respond-to('xs') {
    width: 60px;
    height: 60px;
  }
}

// 二维码图片响应式处理
.qrcode-image {
  width: 140px;
  height: 140px;
  
  @include respond-to('sm') {
    width: 120px;
    height: 120px;
  }
  
  @include respond-to('xs') {
    width: 100px;
    height: 100px;
  }
}
```

### 7.5 响应式字体大小

使用响应式字体大小，确保在各种设备上文字易于阅读：

```scss
// 响应式字体大小
html {
  font-size: 16px;
  
  @include respond-to('lg') {
    font-size: 15px;
  }
  
  @include respond-to('md') {
    font-size: 14px;
  }
  
  @include respond-to('sm') {
    font-size: 13px;
  }
}

// 使用rem单位的字体大小
.text-xl {
  font-size: 1.25rem; // 20px at 16px base
}

.text-lg {
  font-size: 1.125rem; // 18px at 16px base
}

.text-md {
  font-size: 1rem; // 16px at 16px base
}

.text-sm {
  font-size: 0.875rem; // 14px at 16px base
}

.text-xs {
  font-size: 0.75rem; // 12px at 16px base
}
```

### 7.6 多设备测试策略

为确保响应式设计在各类设备上正常工作，应制定以下测试策略：

1. **设备测试矩阵**：
   - 桌面浏览器：Chrome, Firefox, Safari, Edge
   - iOS设备：iPhone (各种尺寸), iPad
   - Android设备：不同尺寸的手机和平板
   
2. **测试要点**：
   - 布局是否正确响应不同屏幕尺寸
   - 交互元素是否易于触控操作
   - 文字是否清晰可读
   - 图片是否正确加载和缩放
   - 表格内容是否完整显示
   
3. **测试工具**：
   - Chrome DevTools 设备模拟器
   - BrowserStack 跨设备测试平台
   - 真实设备测试
```

## 8. 用户交互流程

### 8.1 页面流程图

```
+-------------------+     +-----------------+     +--------------------+
| 用户访问分享链接  | --> | 加载销售员信息  | --> | 展示产品列表数据   |
+-------------------+     +-----------------+     +--------------------+
          |                       |                         |
          v                       v                         v
+-------------------+     +-----------------+     +--------------------+
| 记录客户访问日志  |     | 点击联系方式    |     | 分页/查看详情      |
+-------------------+     +-----------------+     +--------------------+
                                  |                         |
                                  v                         v
                          +-----------------+     +--------------------+
                          | 联系销售员      |     | 下载产品素材       |
                          +-----------------+     +--------------------+
                                                            |
                                                            v
                                                  +--------------------+
                                                  | 访问产品链接       |
                                                  +--------------------+
```

### 8.2 状态转换图

```
                     +-------------+
                     |   初始状态  |
                     |  (未加载)   |
                     +-------------+
                            |
                            | 输入分享token
                            v
                     +-------------+
                     |  加载中状态 |
                     +-------------+
                            |
                    +-------+-------+
                    |               |
                    v               v
           +----------------+ +----------------+
           |  加载成功状态  | |  加载失败状态  |
           +----------------+ +----------------+
                    |               |
            +-------+-------+       |
            |       |       |       |
            v       v       v       v
      +----------+ +----+ +----+ +-------+
      | 浏览产品 | |分页| |筛选| | 重试  |
      +----------+ +----+ +----+ +-------+
            |       |       |
            +-------+-------+
                    |
                    v
           +----------------+
           | 产品详情/交互  |
           +----------------+
                    |
            +-------+-------+
            |       |       |
            v       v       v
      +----------+ +----+ +------+
      | 图片预览 | |下载| |联系  |
      +----------+ +----+ +------+
```

### 8.3 关键交互点详解

1. **页面加载过程**：
   - 用户通过分享链接访问页面时，系统获取URL中的token参数
   - 使用token调用分享数据接口，获取销售员信息和产品列表
   - 页面处于加载状态时显示加载动画
   - 数据加载完成后渲染页面内容

2. **产品浏览交互**：
   - 产品默认以表格形式分页展示
   - 用户可调整每页显示数量(10/20/50/100)
   - 切换页码时重新加载对应页的数据
   - 点击产品图片可查看大图
   - 点击"查看详情"可展开产品详细信息

3. **销售员联系路径**：
   - 查看销售员基本信息(姓名、电话)
   - 扫描微信二维码添加销售员好友
   - 点击电话号码在移动设备上直接拨号
   - 点击店铺链接按钮访问对应电商平台店铺

4. **产品资源获取**：
   - 点击素材包图标下载产品相关素材
   - 点击产品链接访问原始产品页面

## 9. 测试策略

### 9.1 组件测试计划

针对关键组件进行单元测试：

```jsx
// ProductsTable组件测试用例
describe('ProductsTable Component', () => {
  const mockProducts = [...]; // 模拟产品数据
  
  it('should render correct number of rows', () => {
    const { container } = render(<ProductsTable products={mockProducts} />);
    expect(container.querySelectorAll('tbody tr')).toHaveLength(mockProducts.length);
  });
  
  it('should render price tiers correctly', () => {
    const { getAllByTestId } = render(<ProductsTable products={mockProducts} />);
    const priceTierCells = getAllByTestId('price-tier-cell');
    expect(priceTierCells.length).toBeGreaterThan(0);
    // 进一步测试价格内容
  });
  
  it('should handle image preview click', () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    
    const { getAllByTestId } = render(<ProductsTable products={mockProducts} />);
    const productImage = getAllByTestId('product-image')[0];
    
    fireEvent.click(productImage);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('toggleImagePreview')
      })
    );
  });
});
```

### 9.2 集成测试场景

| 测试场景 | 测试步骤 | 预期结果 |
|---------|---------|---------|
| 分享链接访问 | 1. 使用有效token访问<br>2. 等待页面加载 | 页面正确加载，显示销售员信息和产品列表 |
| 分页功能 | 1. 点击下一页<br>2. 修改每页显示数量 | 成功切换到对应页面，数据正确更新 |
| 产品详情查看 | 1. 点击产品行中的"查看详情"按钮 | 详情内容正确展开显示 |
| 产品图片预览 | 1. 点击产品图片 | 弹出图片预览框，显示大图 |
| 素材包下载 | 1. 点击素材包图标 | 成功触发下载操作，获取素材文件 |
| 微信二维码查看 | 1. 查看销售员信息卡片中的二维码 | 正确显示微信二维码图片 |
| 响应式布局 | 1. 在不同设备上访问<br>2. 调整浏览器窗口大小 | 布局自适应调整，内容正确显示 |

### 9.3 性能测试指标

| 测试项 | 目标值 | 测试工具 |
|-------|-------|---------|
| 首屏加载时间 | < 2秒 | Lighthouse |
| 首次可交互时间 | < 3秒 | WebPageTest |
| 图片加载时间 | < 1秒 | Chrome DevTools |
| 页面切换响应时间 | < 300ms | 自定义性能记录 |
| 内存占用 | < 100MB | Chrome Performance Monitor |
| 页面大小 | < 2MB | Lighthouse |
