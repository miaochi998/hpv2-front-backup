# 销售员货盘查看页面开发规范

## 1. 页面概述

销售员货盘查看页面是系统管理员专用功能，用于查看所有销售员的货盘列表和货盘内容。此页面仅供查看，管理员不能在此页面直接编辑或删除销售员的产品，但可以将销售员货盘中的产品复制到公司总货盘中。这一功能使管理员能够快速发现和收集有价值的销售员产品，统一管理和分发。

### 1.1 访问路径

- 路由路径：`/admin/sales-pallets`
- 权限要求：仅系统管理员可访问

### 1.2 功能特性

- 销售员选择功能（查看特定销售员的货盘）
- 产品搜索和筛选功能
- 产品表格展示
- 复制产品到公司总货盘功能
- 产品详情查看功能
- 素材下载功能

## 2. 页面组件结构

### 2.1 组件树

```
SalesPalletViewPage
├── MainLayout                   // 主布局组件
│   ├── Sidebar                  // 侧边导航栏组件
│   └── PageContent              // 页面内容区域
│       ├── PageHeader           // 页面标题区域
│       │   ├── SalesSelectButton   // 销售员选择按钮
│       │   └── SalesInfoCard    // 销售员信息卡片
│       ├── SearchFilterBar      // 搜索和筛选栏
│       │   ├── SearchInput      // 搜索输入框
│       │   └── BrandFilter      // 品牌筛选下拉菜单
│       ├── ProductTable         // 产品表格
│       └── PaginationControls   // 分页控制组件
├── SalesSelectModal             // 销售员选择弹窗
├── CopyProductConfirmModal      // 复制产品确认弹窗
├── CopySuccessModal             // 复制成功弹窗
├── ProductDetailModal           // 产品详情弹窗
└── DownloadMaterialsModal       // 素材下载弹窗
```

### 2.2 组件职责

#### MainLayout（布局组件）
- 提供整体页面布局结构
- 集成侧边导航栏和内容区域

#### Sidebar（侧边导航组件）
- 显示系统导航菜单
- 高亮"查看销售货盘"菜单项
- 提供折叠/展开功能

#### PageHeader（页面标题组件）
- 显示销售员选择按钮和当前选中销售员信息
- 包含销售员货盘标签

#### SalesSelectButton（销售员选择按钮）
- 蓝色背景按钮，显示"公司销售员"文本
- 点击触发销售员选择弹窗

#### SalesInfoCard（销售员信息卡片）
- 显示当前选中销售员的基本信息（头像、姓名）
- 显示货盘统计信息（详情记录数、最后更新时间）

#### SearchFilterBar（搜索和筛选栏）
- 整合搜索输入框和品牌筛选器
- 布局为一行两列（左侧搜索框，右侧筛选器）

#### SearchInput（搜索输入框）
- 带放大镜图标的搜索框
- 占位文本："搜索产品名称、货号等信息"
- 支持实时搜索或按回车键搜索

#### BrandFilter（品牌筛选下拉菜单）
- 下拉式品牌选择器
- 默认显示"全部品牌"
- 包含所有可用品牌列表

#### ProductTable（产品表格组件）
- 响应式表格，展示产品信息
- 包含产品图片、基本信息和操作按钮
- 支持分页、排序功能
- 列配置与数据库字段对应

#### PaginationControls（分页控制组件）
- 显示总记录数
- 页码导航按钮
- 每页显示数量选择器

#### 各类弹窗组件
- 负责各自对应的业务操作
- 提供表单输入、确认操作或显示结果
- 统一的弹窗样式和交互方式

## 3. 数据模型与状态管理

### 3.1 数据模型

```typescript
// 销售员数据模型
interface Salesperson {
  id: number;              // 销售员ID
  username: string;        // 用户名
  name: string;            // 姓名
  phone: string;           // 电话
  email: string;           // 邮箱
  avatar: string;          // 头像URL
  company: string;         // 所属公司
  status: UserStatus;      // 状态
  product_count: number;   // 产品数量
  last_update_time: string; // 最后更新时间
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
  shipping_method: string; // 发货方式
  shipping_spec: string;   // 发货规格
  shipping_size: string;   // 发货尺寸
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
  page_size: number;       // 每页记录数
}

// 销售员列表响应模型
interface SalespersonListResponse {
  code: number;            // 状态码
  data: {
    list: Salesperson[];   // 销售员列表
    meta: PaginationData;  // 分页信息
  };
  message: string;         // 消息
}

// 产品列表响应模型
interface ProductListResponse {
  code: number;            // 状态码
  data: {
    list: Product[];       // 产品列表
    meta: PaginationData;  // 分页信息
  };
  message: string;         // 消息
}

// 复制产品响应模型
interface CopyProductResponse {
  code: number;            // 状态码
  data: {
    id: number;            // 新产品ID
    name: string;          // 产品名称
    owner_type: OwnerType; // 拥有者类型
    owner_id: number;      // 拥有者ID
    created_at: string;    // 创建时间
    created_by: number;    // 创建人ID
  };
  message: string;         // 消息
}
```

### 3.2 状态管理

使用Redux Toolkit管理销售员货盘相关状态：

```typescript
// salesPallet Slice
const salesPalletSlice = createSlice({
  name: 'salesPallet',
  initialState: {
    salesList: [],           // 销售员列表
    salesLoading: false,     // 销售员加载状态
    currentSalesperson: null, // 当前选中的销售员
    products: [],            // 产品列表
    productsLoading: false,  // 产品加载状态
    error: null,             // 错误信息
    pagination: {            // 分页信息
      current: 1,            // 当前页码
      pageSize: 10,          // 每页显示数量
      total: 0               // 总记录数
    },
    filters: {               // 筛选条件
      search: '',            // 搜索关键词
      brandId: null          // 品牌ID
    },
    brands: [],              // 品牌列表（用于筛选）
    selectedProduct: null,   // 当前选中的产品
    copyStatus: 'idle'       // 复制状态：'idle', 'loading', 'success', 'error'
  },
  reducers: {
    // 各种状态更新reducers
  },
  extraReducers: (builder) => {
    // 处理异步action
  }
});
```

## 4. API调用

### 4.1 API接口定义

```typescript
// api/salesPallet.js
import request from '../utils/request';

// 获取销售员列表
export function getSalespersons(params) {
  return request({
    url: '/api/auth/users',
    method: 'get',
    params: { ...params, is_admin: false }
  });
}

// 获取销售员货盘产品
export function getSalesProducts(salesId, params) {
  return request({
    url: `/api/pallet/sales/${salesId}/products`,
    method: 'get',
    params
  });
}

// 获取品牌列表（用于筛选）
export function getBrands() {
  return request({
    url: '/api/pallet/brands',
    method: 'get',
    params: { status: 'ACTIVE' }
  });
}

// 复制产品到总货盘
export function copyProductToCompany(sourceId) {
  return request({
    url: '/api/pallet/products/copy',
    method: 'post',
    data: {
      source_id: sourceId,
      owner_type: 'COMPANY',
      owner_id: null
    }
  });
}

// 下载产品素材
export function downloadProductMaterials(productId) {
  return request({
    url: `/api/pallet/products/${productId}/materials`,
    method: 'get',
    responseType: 'blob'
  });
}
```

### 4.2 API调用时机

| 功能 | 调用时机 | API方法 |
|------|----------|---------|
| 获取销售员列表 | 页面加载、销售员选择弹窗打开时 | `getSalespersons` |
| 获取销售员货盘产品 | 选择销售员后、分页切换、搜索筛选时 | `getSalesProducts` |
| 获取品牌列表 | 页面加载时加载一次（用于筛选器） | `getBrands` |
| 复制产品到总货盘 | 点击"加入到总货盘"按钮并确认后 | `copyProductToCompany` |
| 下载产品素材 | 点击"下载素材"按钮时 | `downloadProductMaterials` |

### 4.3 异步操作处理

使用Redux Toolkit的createAsyncThunk处理异步操作：

```typescript
// 获取销售员列表异步action
export const fetchSalespersons = createAsyncThunk(
  'salesPallet/fetchSalespersons',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getSalespersons(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 获取销售员货盘产品异步action
export const fetchSalesProducts = createAsyncThunk(
  'salesPallet/fetchSalesProducts',
  async ({ salesId, params }, { rejectWithValue }) => {
    try {
      const response = await getSalesProducts(salesId, params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 复制产品到总货盘异步action
export const copyProductToCompanyPallet = createAsyncThunk(
  'salesPallet/copyProductToCompany',
  async (sourceId, { rejectWithValue }) => {
    try {
      const response = await copyProductToCompany(sourceId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
```

## 5. UI组件实现

### 5.1 SalesInfoCard 组件

```tsx
import React from 'react';
import { Card, Avatar, Typography, Space, Statistic, Divider } from 'antd';
import { ClockCircleOutlined, InboxOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const StyledCard = styled(Card)`
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  
  .ant-card-body {
    display: flex;
    width: 100%;
    padding: 12px 16px;
  }
  
  .user-avatar {
    margin-right: 16px;
  }
  
  .sales-info {
    flex: 1;
  }
  
  .sales-stats {
    display: flex;
    margin-top: 8px;
  }
  
  .ant-statistic {
    margin-right: 24px;
  }
  
  .ant-statistic-title {
    font-size: 12px;
  }
  
  .ant-statistic-content {
    font-size: 14px;
  }
`;

interface SalesInfoCardProps {
  salesperson: Salesperson;
}

const SalesInfoCard: React.FC<SalesInfoCardProps> = ({ salesperson }) => {
  if (!salesperson) return null;
  
  return (
    <StyledCard bordered={false}>
      <Avatar 
        size={64} 
        src={salesperson.avatar} 
        icon={!salesperson.avatar && <UserOutlined />}
        className="user-avatar"
      />
      <div className="sales-info">
        <Title level={4} style={{ margin: 0 }}>{salesperson.name}</Title>
        <Text type="secondary">{salesperson.company}</Text>
        
        <div className="sales-stats">
          <Statistic 
            title="货盘产品数量" 
            value={salesperson.product_count} 
            prefix={<InboxOutlined />} 
          />
          <Statistic 
            title="最后更新时间" 
            value={dayjs(salesperson.last_update_time).format('YYYY-MM-DD HH:mm')} 
            prefix={<ClockCircleOutlined />} 
          />
        </div>
      </div>
    </StyledCard>
  );
};

export default SalesInfoCard;
```

### 5.2 ProductTable 组件

```tsx
import React from 'react';
import { Table, Button, Space, Tooltip, Image, Tag, Typography } from 'antd';
import { 
  EyeOutlined, 
  DownloadOutlined, 
  PlusCircleOutlined,
  LinkOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';

const { Text, Link } = Typography;

const StyledTable = styled(Table)`
  .thumbnail-cell {
    width: 60px;
    height: 60px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .ant-table-cell {
    vertical-align: middle;
  }
  
  .price-tiers {
    .tier-item {
      display: flex;
      justify-content: space-between;
      padding: 2px 0;
      border-bottom: 1px dashed #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
    }
  }
`;

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  onChange: (pagination, filters, sorter) => void;
  onViewDetails: (product: Product) => void;
  onDownloadMaterials: (product: Product) => void;
  onCopyProduct: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  loading,
  pagination,
  onChange,
  onViewDetails,
  onDownloadMaterials,
  onCopyProduct,
}) => {
  // 渲染价格档位
  const renderPriceTiers = (priceTiers) => {
    if (!priceTiers || priceTiers.length === 0) {
      return <Text type="secondary">暂无价格档位</Text>;
    }
    
    return (
      <div className="price-tiers">
        {priceTiers.map((tier) => (
          <div key={tier.id} className="tier-item">
            <span>{tier.quantity}</span>
            <span>¥{tier.price}</span>
          </div>
        ))}
      </div>
    );
  };
  
  // 定义表格列
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
      fixed: 'left',
    },
    {
      title: '产品图片',
      dataIndex: 'attachments',
      width: 80,
      render: (attachments) => {
        const image = attachments?.find(att => 
          att.entity_type === 'PRODUCT' && ['jpg', 'jpeg', 'png'].includes(att.file_type)
        );
        return (
          <div className="thumbnail-cell">
            {image ? (
              <Image
                width={60}
                src={image.file_path}
                alt="产品图片"
                preview={{
                  mask: <EyeOutlined />
                }}
              />
            ) : (
              <Text type="secondary">无图片</Text>
            )}
          </div>
        );
      }
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 150,
    },
    {
      title: '品牌',
      dataIndex: 'brand_name',
      width: 100,
    },
    {
      title: '货号',
      dataIndex: 'product_code',
      width: 120,
    },
    {
      title: '规格',
      dataIndex: 'specification',
      width: 120,
      ellipsis: true,
    },
    {
      title: '净含量',
      dataIndex: 'net_content',
      width: 100,
    },
    {
      title: '产品尺寸',
      dataIndex: 'product_size',
      width: 120,
    },
    {
      title: '发货方式',
      dataIndex: 'shipping_method',
      width: 120,
    },
    {
      title: '发货规格',
      dataIndex: 'shipping_spec',
      width: 120,
    },
    {
      title: '发货尺寸',
      dataIndex: 'shipping_size',
      width: 120,
    },
    {
      title: '价格档位',
      dataIndex: 'price_tiers',
      width: 150,
      render: renderPriceTiers,
    },
    {
      title: '素材包',
      dataIndex: 'attachments',
      width: 100,
      render: (attachments) => {
        const materials = attachments?.filter(att => 
          att.entity_type === 'PRODUCT_MATERIAL'
        );
        return materials?.length > 0 ? (
          <Tag color="green">{materials.length}个素材</Tag>
        ) : (
          <Text type="secondary">无素材</Text>
        );
      }
    },
    {
      title: '产品链接',
      dataIndex: 'product_url',
      width: 100,
      render: (url) => url ? (
        <Link href={url} target="_blank">
          <LinkOutlined /> 访问链接
        </Link>
      ) : (
        <Text type="secondary">无链接</Text>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      width: 150,
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm'),
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="下载素材">
            <Button
              type="text"
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => onDownloadMaterials(record)}
              disabled={!record.attachments?.some(att => att.entity_type === 'PRODUCT_MATERIAL')}
            />
          </Tooltip>
          <Tooltip title="加入到总货盘">
            <Button
              type="text"
              size="small"
              icon={<PlusCircleOutlined style={{ color: '#52c41a' }} />}
              onClick={() => onCopyProduct(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  
  return (
    <StyledTable
      rowKey="id"
      columns={columns}
      dataSource={products}
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showTotal: (total) => `总计: ${total} 条记录`,
      }}
      onChange={onChange}
      scroll={{ x: 1500 }}
      size="middle"
    />
  );
};

export default ProductTable;
```

### 5.3 SalesSelectModal 组件

```tsx
import React, { useState, useEffect } from 'react';
import { Modal, Input, List, Avatar, Button, Typography, Space, Skeleton } from 'antd';
import { SearchOutlined, UserOutlined, InboxOutlined, ClockCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalespersons } from '../store/salesPalletSlice';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const SearchInput = styled(Input)`
  margin-bottom: 16px;
`;

const SalesItem = styled(List.Item)`
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 4px;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  .ant-list-item-meta-title {
    margin-bottom: 4px;
  }
  
  .sales-stats {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: #666;
  }
`;

interface SalesSelectModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectSalesperson: (salesperson: Salesperson) => void;
}

const SalesSelectModal: React.FC<SalesSelectModalProps> = ({
  visible,
  onClose,
  onSelectSalesperson,
}) => {
  const dispatch = useDispatch();
  const { salesList, salesLoading } = useSelector((state) => state.salesPallet);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  useEffect(() => {
    if (visible) {
      dispatch(fetchSalespersons({
        page,
        page_size: pageSize,
        search: searchText
      }));
    }
  }, [visible, page, searchText, dispatch]);
  
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPage(1);
  };
  
  const handleSelectSalesperson = (salesperson) => {
    onSelectSalesperson(salesperson);
    onClose();
  };
  
  return (
    <Modal
      title="选择销售员"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <SearchInput
        placeholder="输入销售员姓名、账号等"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={handleSearch}
        allowClear
      />
      
      <List
        loading={salesLoading}
        itemLayout="horizontal"
        dataSource={salesList}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: salesList.length,
          onChange: (page) => setPage(page),
          showSizeChanger: false,
        }}
        renderItem={(item) => (
          <SalesItem
            actions={[
              <Button
                type="primary"
                size="small"
                onClick={() => handleSelectSalesperson(item)}
              >
                选择
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar 
                  size={48} 
                  src={item.avatar} 
                  icon={!item.avatar && <UserOutlined />}
                />
              }
              title={
                <Space>
                  <Title level={5} style={{ margin: 0 }}>{item.name}</Title>
                  <Text type="secondary">@{item.username}</Text>
                </Space>
              }
              description={
                <>
                  <div>{item.company || '未设置公司'}</div>
                  <div className="sales-stats">
                    <span>
                      <InboxOutlined /> {item.product_count || 0} 个产品
                    </span>
                    <span>
                      <ClockCircleOutlined /> 最后更新: {
                        item.last_update_time 
                          ? dayjs(item.last_update_time).format('YYYY-MM-DD') 
                          : '无更新'
                      }
                    </span>
                  </div>
                </>
              }
            />
          </SalesItem>
        )}
      />
    </Modal>
  );
};

export default SalesSelectModal;
```

### 5.4 CopyProductConfirmModal 组件

```tsx
import React from 'react';
import { Modal, Typography, Descriptions, Space, Button } from 'antd';
import { PlusCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface CopyProductConfirmModalProps {
  visible: boolean;
  product: Product | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CopyProductConfirmModal: React.FC<CopyProductConfirmModalProps> = ({
  visible,
  product,
  loading,
  onClose,
  onConfirm,
}) => {
  if (!product) return null;
  
  return (
    <Modal
      title="确认复制产品到公司总货盘"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button
          key="confirm"
          type="primary"
          icon={<PlusCircleOutlined />}
          loading={loading}
          onClick={onConfirm}
        >
          确认复制
        </Button>,
      ]}
      width={600}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
          <Text>您确定要将此产品复制到公司总货盘吗？</Text>
        </div>
        <Text type="secondary">复制后的产品将在公司总货盘中可用，不会影响销售员原有产品。</Text>
        
        <Descriptions title="产品信息" bordered column={1} size="small" style={{ marginTop: 16 }}>
          <Descriptions.Item label="产品名称">{product.name}</Descriptions.Item>
          <Descriptions.Item label="品牌">{product.brand_name}</Descriptions.Item>
          <Descriptions.Item label="货号">{product.product_code}</Descriptions.Item>
          <Descriptions.Item label="规格">{product.specification}</Descriptions.Item>
          <Descriptions.Item label="净含量">{product.net_content}</Descriptions.Item>
          <Descriptions.Item label="价格档位">
            {product.price_tiers && product.price_tiers.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {product.price_tiers.map((tier) => (
                  <li key={tier.id}>
                    {tier.quantity}: ¥{tier.price}
                  </li>
                ))}
              </ul>
            ) : (
              '暂无价格档位'
            )}
          </Descriptions.Item>
        </Descriptions>
      </Space>
    </Modal>
  );
};

export default CopyProductConfirmModal;
```

### 5.5 CopySuccessModal 组件

```tsx
import React from 'react';
import { Modal, Result, Button, Space } from 'antd';
import { history } from 'umi';

interface CopySuccessModalProps {
  visible: boolean;
  productName: string;
  onClose: () => void;
}

const CopySuccessModal: React.FC<CopySuccessModalProps> = ({
  visible,
  productName,
  onClose,
}) => {
  const handleGoToCompanyPallet = () => {
    history.push('/admin/company-products');
    onClose();
  };
  
  return (
    <Modal
      title="产品复制成功"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <Result
        status="success"
        title="产品已成功复制到公司总货盘"
        subTitle={`产品"${productName}"现在可在公司总货盘中查看和编辑`}
        extra={
          <Space>
            <Button onClick={onClose}>关闭</Button>
            <Button type="primary" onClick={handleGoToCompanyPallet}>
              查看总货盘
            </Button>
          </Space>
        }
      />
    </Modal>
  );
};

export default CopySuccessModal;
```

### 5.6 ProductDetailModal 组件

```tsx
import React from 'react';
import { Modal, Descriptions, Tabs, Image, Typography, Tag, Space, Button } from 'antd';
import { 
  InfoCircleOutlined, 
  ShoppingOutlined, 
  PictureOutlined,
  LinkOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';

const { Text, Link } = Typography;
const { TabPane } = Tabs;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

interface ProductDetailModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onDownloadMaterials: (product: Product) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  visible,
  product,
  onClose,
  onDownloadMaterials,
}) => {
  if (!product) return null;
  
  // 获取产品图片
  const productImages = product.attachments?.filter(att => 
    att.entity_type === 'PRODUCT' && ['jpg', 'jpeg', 'png'].includes(att.file_type)
  ) || [];
  
  // 获取产品素材
  const productMaterials = product.attachments?.filter(att => 
    att.entity_type === 'PRODUCT_MATERIAL'
  ) || [];
  
  return (
    <Modal
      title="产品详情"
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
        productMaterials.length > 0 && (
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => onDownloadMaterials(product)}
          >
            下载素材包
          </Button>
        ),
      ]}
    >
      <Tabs defaultActiveKey="info">
        <TabPane 
          tab={<span><InfoCircleOutlined />产品信息</span>} 
          key="info"
        >
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="产品ID" span={2}>{product.id}</Descriptions.Item>
            <Descriptions.Item label="产品名称" span={2}>{product.name}</Descriptions.Item>
            <Descriptions.Item label="品牌">{product.brand_name}</Descriptions.Item>
            <Descriptions.Item label="货号">{product.product_code}</Descriptions.Item>
            <Descriptions.Item label="规格">{product.specification}</Descriptions.Item>
            <Descriptions.Item label="净含量">{product.net_content}</Descriptions.Item>
            <Descriptions.Item label="产品尺寸">{product.product_size}</Descriptions.Item>
            <Descriptions.Item label="发货方式">{product.shipping_method}</Descriptions.Item>
            <Descriptions.Item label="发货规格">{product.shipping_spec}</Descriptions.Item>
            <Descriptions.Item label="发货尺寸">{product.shipping_size}</Descriptions.Item>
            <Descriptions.Item label="产品链接" span={2}>
              {product.product_url ? (
                <Link href={product.product_url} target="_blank">
                  <LinkOutlined /> {product.product_url}
                </Link>
              ) : (
                <Text type="secondary">暂无链接</Text>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {dayjs(product.created_at).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {dayjs(product.updated_at).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="素材数量">
              {productMaterials.length > 0 ? (
                <Tag color="green">{productMaterials.length}个素材</Tag>
              ) : (
                <Text type="secondary">无素材</Text>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="图片数量">
              {productImages.length > 0 ? (
                <Tag color="blue">{productImages.length}张图片</Tag>
              ) : (
                <Text type="secondary">无图片</Text>
              )}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        
        <TabPane 
          tab={<span><ShoppingOutlined />价格档位</span>} 
          key="prices"
        >
          {product.price_tiers && product.price_tiers.length > 0 ? (
            <Descriptions bordered column={1} size="middle">
              {product.price_tiers.map((tier) => (
                <Descriptions.Item 
                  key={tier.id} 
                  label={`订购数量: ${tier.quantity}`}
                >
                  价格: ¥{tier.price}
                </Descriptions.Item>
              ))}
            </Descriptions>
          ) : (
            <Empty description="暂无价格档位信息" />
          )}
        </TabPane>
        
        <TabPane 
          tab={<span><PictureOutlined />产品图片</span>} 
          key="images"
        >
          {productImages.length > 0 ? (
            <ImageGrid>
              {productImages.map((image) => (
                <div key={image.id}>
                  <Image
                    src={image.file_path}
                    alt={image.file_name}
                    style={{ width: '100%', height: 150, objectFit: 'cover' }}
                  />
                  <Text type="secondary" ellipsis style={{ display: 'block', marginTop: 4 }}>
                    {image.file_name}
                  </Text>
                </div>
              ))}
            </ImageGrid>
          ) : (
            <Empty description="暂无产品图片" />
          )}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default ProductDetailModal;
```

## 6. 页面主组件实现

```tsx
import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Button, 
  Space, 
  Input, 
  Select, 
  message, 
  Typography,
  Tag
} from 'antd';
import { 
  SearchOutlined, 
  TeamOutlined, 
  FilterOutlined 
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { 
  fetchSalespersons, 
  fetchSalesProducts, 
  fetchBrands,
  copyProductToCompanyPallet,
  setCurrentSalesperson,
  setFilters,
  setPagination
} from '../store/salesPalletSlice';
import MainLayout from '../components/MainLayout';
import SalesInfoCard from '../components/SalesInfoCard';
import ProductTable from '../components/ProductTable';
import SalesSelectModal from '../components/SalesSelectModal';
import CopyProductConfirmModal from '../components/CopyProductConfirmModal';
import CopySuccessModal from '../components/CopySuccessModal';
import ProductDetailModal from '../components/ProductDetailModal';
import { downloadProductMaterials } from '../api/salesPallet';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const SalesPalletViewPage: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    currentSalesperson,
    products,
    productsLoading,
    pagination,
    filters,
    brands,
    copyStatus,
    error
  } = useSelector((state: RootState) => state.salesPallet);
  
  // 本地状态
  const [salesSelectVisible, setSalesSelectVisible] = useState(false);
  const [copyModalVisible, setCopyModalVisible] = useState(false);
  const [copySuccessVisible, setCopySuccessVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [copiedProductName, setCopiedProductName] = useState('');
  
  // 初始加载
  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchSalespersons({ page: 1, page_size: 10 }));
  }, [dispatch]);
  
  // 加载产品列表
  useEffect(() => {
    if (currentSalesperson) {
      dispatch(fetchSalesProducts({
        salesId: currentSalesperson.id,
        params: {
          page: pagination.current,
          page_size: pagination.pageSize,
          search: filters.search,
          brand_id: filters.brandId,
        }
      }));
    }
  }, [currentSalesperson, pagination.current, pagination.pageSize, filters, dispatch]);
  
  // 复制状态监听
  useEffect(() => {
    if (copyStatus === 'success') {
      setCopyModalVisible(false);
      setCopySuccessVisible(true);
    } else if (copyStatus === 'error' && error) {
      message.error(`复制失败: ${error}`);
    }
  }, [copyStatus, error]);
  
  // 处理搜索
  const handleSearch = (value: string) => {
    dispatch(setFilters({ ...filters, search: value }));
    dispatch(setPagination({ ...pagination, current: 1 }));
  };
  
  // 处理品牌筛选
  const handleBrandChange = (value: number | null) => {
    dispatch(setFilters({ ...filters, brandId: value }));
    dispatch(setPagination({ ...pagination, current: 1 }));
  };
  
  // 处理表格变化
  const handleTableChange = (paginationConfig, filtersConfig, sorter) => {
    dispatch(setPagination({
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
      total: pagination.total
    }));
  };
  
  // 处理销售员选择
  const handleSelectSalesperson = (salesperson) => {
    dispatch(setCurrentSalesperson(salesperson));
    dispatch(setPagination({ ...pagination, current: 1 }));
  };
  
  // 处理产品复制
  const handleCopyProduct = (product) => {
    setSelectedProduct(product);
    setCopiedProductName(product.name);
    setCopyModalVisible(true);
  };
  
  // 确认复制
  const handleConfirmCopy = () => {
    if (selectedProduct) {
      dispatch(copyProductToCompanyPallet(selectedProduct.id));
    }
  };
  
  // 查看产品详情
  const handleViewProductDetails = (product) => {
    setSelectedProduct(product);
    setDetailModalVisible(true);
  };
  
  // 下载产品素材
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
  
  return (
    <MainLayout selectedKey="sales-pallets">
      <Content className="site-layout-content">
        {/* 页面头部 */}
        <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={3}>销售员货盘查看</Title>
            <Button
              type="primary"
              icon={<TeamOutlined />}
              onClick={() => setSalesSelectVisible(true)}
            >
              {currentSalesperson ? '切换销售员' : '选择销售员'}
            </Button>
          </div>
          
          {currentSalesperson && (
            <>
              <SalesInfoCard salesperson={currentSalesperson} />
              <Tag color="blue" style={{ fontSize: 14, padding: '4px 8px' }}>
                {currentSalesperson.name}的货盘
              </Tag>
            </>
          )}
        </Space>
        
        {/* 搜索筛选栏 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: 16,
          alignItems: 'center'
        }}>
          <Input.Search
            placeholder="搜索产品名称、货号等信息"
            onSearch={handleSearch}
            allowClear
            style={{ width: 300 }}
            enterButton
          />
          
          <Space>
            <span><FilterOutlined /> 筛选:</span>
            <Select
              placeholder="选择品牌"
              style={{ width: 200 }}
              allowClear
              onChange={handleBrandChange}
              value={filters.brandId}
            >
              <Option value={null}>全部品牌</Option>
              {brands.map(brand => (
                <Option key={brand.id} value={brand.id}>{brand.name}</Option>
              ))}
            </Select>
          </Space>
        </div>
        
        {/* 产品表格 */}
        {currentSalesperson ? (
          <ProductTable
            products={products}
            loading={productsLoading}
            pagination={pagination}
            onChange={handleTableChange}
            onViewDetails={handleViewProductDetails}
            onDownloadMaterials={handleDownloadMaterials}
            onCopyProduct={handleCopyProduct}
          />
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '100px 0', 
            background: '#f5f5f5',
            borderRadius: 4
          }}>
            <Title level={4} type="secondary">请先选择销售员查看其货盘</Title>
            <Button 
              type="primary" 
              icon={<TeamOutlined />}
              onClick={() => setSalesSelectVisible(true)}
              style={{ marginTop: 16 }}
            >
              选择销售员
            </Button>
          </div>
        )}
      </Content>
      
      {/* 弹窗组件 */}
      <SalesSelectModal
        visible={salesSelectVisible}
        onClose={() => setSalesSelectVisible(false)}
        onSelectSalesperson={handleSelectSalesperson}
      />
      
      <CopyProductConfirmModal
        visible={copyModalVisible}
        product={selectedProduct}
        loading={copyStatus === 'loading'}
        onClose={() => setCopyModalVisible(false)}
        onConfirm={handleConfirmCopy}
      />
      
      <CopySuccessModal
        visible={copySuccessVisible}
        productName={copiedProductName}
        onClose={() => setCopySuccessVisible(false)}
      />
      
      <ProductDetailModal
        visible={detailModalVisible}
        product={selectedProduct}
        onClose={() => setDetailModalVisible(false)}
        onDownloadMaterials={handleDownloadMaterials}
      />
    </MainLayout>
  );
};

export default SalesPalletViewPage;
```

## 7. 路由配置

```tsx
// config/routes.js
export default [
  // ... 其他路由配置 ...
  {
    path: '/admin/sales-pallets',
    component: './admin/SalesPalletView',
    access: 'isAdmin', // 只有管理员可访问
  },
];
```

## 8. 业务逻辑与交互流程

### 8.1 页面加载逻辑

1. 页面初始加载时，发起以下API请求：
   - 获取销售员列表（默认首页10条）
   - 获取品牌列表（用于筛选）

2. 销售员选择后，加载该销售员的产品列表：
   - 记录当前选中的销售员信息
   - 重置分页状态到第一页
   - 发起获取销售员货盘产品的请求

### 8.2 交互流程

#### 销售员选择流程
1. 用户点击"选择销售员"按钮
2. 弹出销售员选择弹窗
3. 用户可搜索或浏览销售员列表
4. 选择特定销售员后关闭弹窗
5. 更新当前选中销售员，并加载其货盘产品

#### 产品搜索筛选流程
1. 用户在搜索框输入关键词并搜索
2. 或者用户选择特定品牌进行筛选
3. 系统重置分页状态到第一页
4. 使用新的筛选条件重新请求产品列表

#### 产品复制流程
1. 用户点击产品行上的"加入到总货盘"按钮
2. 弹出复制确认弹窗，显示产品详情
3. 用户确认后，发起复制产品的请求
4. 复制成功后显示成功提示弹窗
5. 用户可选择关闭或跳转到公司总货盘页面

#### 产品详情查看流程
1. 用户点击产品行上的"查看详情"按钮
2. 弹出产品详情弹窗，显示完整信息
3. 用户可在详情弹窗中浏览产品不同类别的信息
4. 可选择下载素材包（如果有）

#### 素材下载流程
1. 用户点击"下载素材"按钮
2. 系统发起下载请求，显示下载中提示
3. 下载完成后自动触发浏览器下载
4. 显示下载成功提示

## 9. 错误处理

1. **API请求错误**：
   - 使用try-catch捕获所有API请求错误
   - 显示友好的错误提示信息
   - 记录详细错误日志到控制台

2. **空数据处理**：
   - 未选择销售员时显示提示信息
   - 无产品数据时显示空状态提示
   - 无素材时禁用下载按钮

3. **状态变更处理**：
   - 监听复制状态变更
   - 复制成功时显示成功提示
   - 复制失败时显示错误提示

## 10. 响应式设计

1. **布局适配**：
   - 表格使用水平滚动确保在小屏幕设备上可用
   - 搜索筛选栏在小屏幕下改为纵向排列
   - 产品详情弹窗在小屏幕下调整宽度

2. **组件响应**：
   - 使用flex布局适应不同屏幕尺寸
   - 图片缩略图自适应容器尺寸
   - 表格列在小屏幕下进行优先级显示

## 11. 性能优化

1. **按需加载**:
   - 使用React.lazy和Suspense实现组件懒加载
   - 大型弹窗组件按需加载

2. **数据请求优化**:
   - 使用节流控制搜索频率
   - 缓存已获取的品牌列表数据
   - 避免重复请求相同数据

3. **渲染优化**:
   - 使用React.memo减少不必要的组件重新渲染
   - 表格使用虚拟滚动处理大量数据
   - 使用正确的键值确保高效的DOM更新

## 12. 设计规范

1. **色彩方案**：
   - 主色调：深色侧边栏配合浅色内容区
   - 功能标签：蓝色背景（销售员选择、货盘标签）
   - 功能按钮：绿色（复制）、蓝色（查看）、灰色（取消）
   - 表格头部：浅蓝色背景增强可读性

2. **字体规范**：
   - 页面标题：18px 粗体
   - 功能标签：14px 白色字体
   - 表格内容：14px 常规
   - 按钮文字：14px 白色，居中显示
   - 弹窗标题：16px 粗体

3. **组件风格**：
   - 按钮：圆角矩形
   - 表格：水平分割线分隔行
   - 弹窗：圆角白色背景，居中显示
   - 销售员卡片：圆角矩形，灰色背景，轻微阴影

## 13. 安全考虑

1. **权限控制**：
   - 路由级别的管理员权限验证
   - API请求前验证用户身份和权限
   - 禁止非管理员访问此页面

2. **数据安全**：
   - 隐藏敏感信息，如销售员联系方式
   - API响应数据的权限过滤
   - 防止XSS攻击的输入过滤和转义

## 14. 可访问性

1. **键盘导航**：
   - 表格和表单元素支持键盘导航
   - 模态框中的焦点管理
   - 适当的tabIndex设置

2. **屏幕阅读器支持**：
   - 所有图像提供alt文本
   - 使用语义化HTML元素
   - 适当的ARIA属性应用

3. **颜色对比度**：
   - 确保文本与背景颜色对比足够
   - 不仅依赖颜色传达信息
   - 符合WCAG 2.1 AA级别标准

## 15. 开发注意事项

1. 此页面仅对系统管理员开放，需进行严格的权限控制
2. 复制功能会创建产品的完整副本，包括价格档位和附件信息
3. 表格需处理可能的大量数据，建议实现虚拟滚动或分页优化
4. 素材下载功能需处理大文件下载的用户体验
5. 确保所有字段与数据库定义严格一致
6. 数据转换和格式化应在组件渲染前完成