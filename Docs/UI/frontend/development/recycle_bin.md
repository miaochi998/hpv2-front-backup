# 货盘回收站页面开发规范

## 1. 页面概述

货盘回收站页面用于管理已被删除但尚未永久销毁的产品。此页面允许用户查看、恢复或永久删除已移入回收站的产品。根据用户角色不同，页面会自动过滤显示相应权限范围内的产品：管理员只能查看和操作公司总货盘中被删除的产品，而销售员只能查看和操作自己删除的产品。

### 1.1 访问路径

- 管理员路由路径：`/admin/recycle-bin`
- 销售员路由路径：`/seller/recycle-bin`
- 权限要求：需登录系统，根据用户角色自动导向对应页面

### 1.2 功能特性

- 已删除产品列表展示（表格形式）
- 产品搜索和筛选功能
- 单个产品还原功能
- 单个产品永久删除功能
- 批量还原功能
- 批量永久删除功能

## 2. 页面组件结构

### 2.1 组件树

```
RecycleBinPage
├── MainLayout                    // 主布局组件
│   ├── NavigationSidebar         // 导航侧边栏组件
│   └── PageContent               // 页面内容区域
│       ├── PageHeader            // 页面标题区域
│       ├── SearchAndFilterBar    // 搜索和筛选栏
│       │   ├── SearchInput       // 搜索输入框
│       │   └── BrandFilter       // 品牌筛选下拉框
│       ├── BatchActionBar        // 批量操作栏
│       │   ├── BatchRestoreButton // 批量还原按钮
│       │   └── BatchDeleteButton  // 批量删除按钮
│       ├── ProductTable          // 产品表格组件
│       │   ├── SelectionColumn   // 选择列(复选框)
│       │   ├── ProductColumns    // 产品信息列
│       │   └── ActionColumn      // 操作列(还原/删除)
│       └── PaginationControls    // 分页控制组件
├── RestoreConfirmModal           // 还原确认弹窗
├── RestoreSuccessModal           // 还原成功弹窗
├── DeleteConfirmModal            // 删除确认弹窗
├── DeleteSuccessModal            // 删除成功弹窗
├── BatchRestoreConfirmModal      // 批量还原确认弹窗
├── BatchRestoreSuccessModal      // 批量还原成功弹窗
├── BatchDeleteConfirmModal       // 批量删除确认弹窗
└── BatchDeleteSuccessModal       // 批量删除成功弹窗
```

### 2.2 组件职责

#### MainLayout（布局组件）
- 提供整体页面布局结构
- 集成导航侧边栏和内容区域

#### NavigationSidebar（导航组件）
- 显示系统导航菜单
- 高亮"回收站"菜单项
- 提供折叠/展开功能

#### PageHeader（页面标题组件）
- 显示"[用户名]的货盘回收站"标题
- 根据用户角色动态显示标题内容

#### SearchAndFilterBar（搜索和筛选栏组件）
- 集成搜索框和品牌筛选器
- 处理搜索和筛选事件
- 触发表格数据重新加载

#### BatchActionBar（批量操作栏组件）
- 显示批量操作按钮
- 管理按钮的启用/禁用状态
- 显示已选择的产品数量

#### ProductTable（产品表格组件）
- 展示回收站产品列表数据
- 处理表格行选择事件
- 支持表格列排序
- 集成单个产品的操作按钮

#### 各类弹窗组件
- 处理对应的业务操作
- 提供用户交互界面
- 确保用户操作的安全性
- 提供明确的操作反馈

## 3. 数据模型与状态管理

### 3.1 数据模型

```typescript
// 回收站项目数据模型
interface RecycleBinItem {
  id: number;                // 回收站记录ID
  entity_type: string;       // 实体类型，固定为"PRODUCT"
  entity_id: number;         // 实体ID（产品ID）
  owner_type: string;        // 拥有者类型(COMPANY/SELLER)
  owner_id: number;          // 拥有者ID
  deleted_by: number;        // 删除人ID
  deleted_at: string;        // 删除时间
  restored_by: number | null; // 还原人ID，null表示未还原
  restored_at: string | null; // 还原时间，null表示未还原
  product: {
    name: string;            // 产品名称
    product_code: string;    // 产品货号
    brand_id: number;        // 品牌ID
    brand_name: string;      // 品牌名称
    specification: string;   // 产品规格
    net_content: string;     // 净含量
    product_size: string;    // 产品尺寸
    shipping_method: string; // 发货方式
    shipping_spec: string;   // 发货规格
    shipping_size: string;   // 发货尺寸
    product_url: string;     // 产品链接
    updated_at: string;      // 更新时间
    price_tiers: PriceTier[]; // 价格档位数组
    attachments: Attachment[]; // 附件数组
  }
}

// 价格档位模型
interface PriceTier {
  quantity: string;          // 订购数量
  price: string;             // 单价
}

// 附件模型
interface Attachment {
  id: number;                // 附件ID
  file_type: string;         // 文件类型(IMAGE/MATERIAL)
  file_path: string;         // 文件路径
  file_size: number;         // 文件大小(字节)
}

// 分页数据模型
interface PaginationData {
  total: number;             // 总记录数
  current_page: number;      // 当前页码
  per_page: number;          // 每页记录数
}

// 回收站列表响应模型
interface RecycleBinListResponse {
  code: number;              // 状态码
  data: {
    list: RecycleBinItem[];  // 回收站项目列表
    pagination: PaginationData; // 分页信息
  };
  message: string;           // 消息
}

// 操作响应模型
interface OperationResponse {
  code: number;              // 状态码
  data: {
    [key: string]: any;      // 响应数据，根据操作类型不同而不同
  };
  message: string;           // 消息
}

// 批量操作响应模型
interface BatchOperationResponse {
  code: number;              // 状态码
  data: {
    total: number;           // 总操作数量
    success: number;         // 成功数量
    failed: number;          // 失败数量
    failed_ids?: number[];   // 失败的ID列表(可选)
  };
  message: string;           // 消息
}
```

### 3.2 状态管理

使用Redux Toolkit管理回收站相关状态：

```typescript
// recycleBin Slice
const recycleBinSlice = createSlice({
  name: 'recycleBin',
  initialState: {
    items: [],                 // 回收站项目列表
    loading: false,            // 加载状态
    error: null,               // 错误信息
    selectedIds: [],           // 已选择的项目ID数组
    pagination: {              // 分页信息
      current: 1,              // 当前页码
      pageSize: 10,            // 每页显示数量
      total: 0                 // 总记录数
    },
    filters: {                 // 筛选条件
      search: '',              // 搜索关键词
      brandId: null,           // 品牌ID
      sortField: 'deleted_at', // 排序字段
      sortOrder: 'desc'        // 排序方向
    },
    modalState: {              // 弹窗状态
      restoreConfirm: {         // 还原确认弹窗
        visible: false,
        itemId: null
      },
      restoreSuccess: {         // 还原成功弹窗
        visible: false
      },
      deleteConfirm: {          // 删除确认弹窗
        visible: false,
        itemId: null
      },
      deleteSuccess: {          // 删除成功弹窗
        visible: false
      },
      batchRestoreConfirm: {    // 批量还原确认弹窗
        visible: false,
        itemCount: 0
      },
      batchRestoreSuccess: {    // 批量还原成功弹窗
        visible: false,
        successCount: 0,
        failedCount: 0
      },
      batchDeleteConfirm: {     // 批量删除确认弹窗
        visible: false,
        itemCount: 0
      },
      batchDeleteSuccess: {     // 批量删除成功弹窗
        visible: false,
        successCount: 0,
        failedCount: 0
      }
    }
  },
  reducers: {
    // 各种状态更新reducers
    setItems(state, action) {
      state.items = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setPagination(state, action) {
      state.pagination = action.payload;
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedIds(state, action) {
      state.selectedIds = action.payload;
    },
    addSelectedId(state, action) {
      state.selectedIds.push(action.payload);
    },
    removeSelectedId(state, action) {
      state.selectedIds = state.selectedIds.filter(id => id !== action.payload);
    },
    clearSelectedIds(state) {
      state.selectedIds = [];
    },
    setModalState(state, action) {
      const { modal, data } = action.payload;
      state.modalState[modal] = { ...state.modalState[modal], ...data };
    }
  },
  extraReducers: (builder) => {
    // 处理异步action
  }
});
```

## 4. API调用

### 4.1 API接口定义

```typescript
// api/recycleBin.js
import request from '../utils/request';

// 获取回收站产品列表
export function getRecycleBinItems(params) {
  return request({
    url: '/api/pallet/recycle',
    method: 'get',
    params
  });
}

// 还原产品
export function restoreProduct(id) {
  return request({
    url: `/api/pallet/recycle/${id}/restore`,
    method: 'post',
    data: {
      confirm: true
    }
  });
}

// 永久删除产品
export function deleteProduct(id) {
  return request({
    url: `/api/pallet/recycle/${id}`,
    method: 'delete',
    data: {
      confirm: true
    }
  });
}

// 批量还原产品
export function batchRestoreProducts(ids) {
  return request({
    url: '/api/pallet/recycle/batch-restore',
    method: 'post',
    data: {
      ids
    }
  });
}

// 批量永久删除产品
export function batchDeleteProducts(ids) {
  return request({
    url: '/api/pallet/recycle/batch-delete',
    method: 'post',
    data: {
      ids,
      confirm: true
    }
  });
}
```

### 4.2 API调用时机

| 功能 | 调用时机 | API方法 |
|------|----------|---------|
| 获取回收站列表 | 页面加载、筛选条件变更、排序变更、分页切换、操作完成后刷新 | `getRecycleBinItems` |
| 还原产品 | 还原确认弹窗确认时 | `restoreProduct` |
| 永久删除产品 | 删除确认弹窗确认时 | `deleteProduct` |
| 批量还原产品 | 批量还原确认弹窗确认时 | `batchRestoreProducts` |
| 批量永久删除产品 | 批量删除确认弹窗确认时 | `batchDeleteProducts` |

### 4.3 异步操作处理

使用Redux Toolkit的createAsyncThunk处理异步操作：

```typescript
// 获取回收站列表异步action
export const fetchRecycleBinItems = createAsyncThunk(
  'recycleBin/fetchRecycleBinItems',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getRecycleBinItems(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 还原产品异步action
export const restoreRecycleBinItem = createAsyncThunk(
  'recycleBin/restoreRecycleBinItem',
  async (id, { rejectWithValue }) => {
    try {
      const response = await restoreProduct(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 永久删除产品异步action
export const deleteRecycleBinItem = createAsyncThunk(
  'recycleBin/deleteRecycleBinItem',
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteProduct(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 批量还原产品异步action
export const batchRestoreRecycleBinItems = createAsyncThunk(
  'recycleBin/batchRestoreRecycleBinItems',
  async (ids, { rejectWithValue }) => {
    try {
      const response = await batchRestoreProducts(ids);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 批量永久删除产品异步action
export const batchDeleteRecycleBinItems = createAsyncThunk(
  'recycleBin/batchDeleteRecycleBinItems',
  async (ids, { rejectWithValue }) => {
    try {
      const response = await batchDeleteProducts(ids);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
```

### 4.4 extraReducers实现

在recycleBinSlice中处理异步操作的结果：

```typescript
extraReducers: (builder) => {
  // 处理获取回收站列表
  builder.addCase(fetchRecycleBinItems.pending, (state) => {
    state.loading = true;
    state.error = null;
  });
  builder.addCase(fetchRecycleBinItems.fulfilled, (state, action) => {
    state.loading = false;
    state.items = action.payload.data.list;
    state.pagination = {
      current: action.payload.data.pagination.current_page,
      pageSize: action.payload.data.pagination.per_page,
      total: action.payload.data.pagination.total
    };
  });
  builder.addCase(fetchRecycleBinItems.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload || '获取回收站列表失败';
  });

  // 处理还原产品
  builder.addCase(restoreRecycleBinItem.fulfilled, (state, action) => {
    // 关闭确认弹窗，显示成功弹窗
    state.modalState.restoreConfirm.visible = false;
    state.modalState.restoreSuccess.visible = true;
    // 从列表中移除已还原的产品
    state.items = state.items.filter(item => item.id !== state.modalState.restoreConfirm.itemId);
    // 清空选中状态
    state.selectedIds = state.selectedIds.filter(id => id !== state.modalState.restoreConfirm.itemId);
  });

  // 处理永久删除产品
  builder.addCase(deleteRecycleBinItem.fulfilled, (state, action) => {
    // 关闭确认弹窗，显示成功弹窗
    state.modalState.deleteConfirm.visible = false;
    state.modalState.deleteSuccess.visible = true;
    // 从列表中移除已删除的产品
    state.items = state.items.filter(item => item.id !== state.modalState.deleteConfirm.itemId);
    // 清空选中状态
    state.selectedIds = state.selectedIds.filter(id => id !== state.modalState.deleteConfirm.itemId);
  });

  // 处理批量还原产品
  builder.addCase(batchRestoreRecycleBinItems.fulfilled, (state, action) => {
    // 关闭确认弹窗，显示成功弹窗
    state.modalState.batchRestoreConfirm.visible = false;
    state.modalState.batchRestoreSuccess = {
      visible: true,
      successCount: action.payload.data.success,
      failedCount: action.payload.data.failed
    };
    // 清空选中状态
    state.selectedIds = [];
  });

  // 处理批量永久删除产品
  builder.addCase(batchDeleteRecycleBinItems.fulfilled, (state, action) => {
    // 关闭确认弹窗，显示成功弹窗
    state.modalState.batchDeleteConfirm.visible = false;
    state.modalState.batchDeleteSuccess = {
      visible: true,
      successCount: action.payload.data.success,
      failedCount: action.payload.data.failed
    };
    // 清空选中状态
    state.selectedIds = [];
  });
}
```

## 5. UI组件实现

### 5.1 RecycleBinPage 组件

```tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, message } from 'antd';
import NavigationSidebar from '@/components/common/NavigationSidebar';
import PageHeader from '@/components/common/PageHeader';
import SearchAndFilterBar from '@/components/recycleBin/SearchAndFilterBar';
import BatchActionBar from '@/components/recycleBin/BatchActionBar';
import ProductTable from '@/components/recycleBin/ProductTable';
import PaginationControls from '@/components/common/PaginationControls';
import { fetchRecycleBinItems } from '@/store/recycleBin/actions';
import { selectRecycleBinState } from '@/store/recycleBin/selectors';
import RestoreConfirmModal from '@/components/recycleBin/modals/RestoreConfirmModal';
import RestoreSuccessModal from '@/components/recycleBin/modals/RestoreSuccessModal';
import DeleteConfirmModal from '@/components/recycleBin/modals/DeleteConfirmModal';
import DeleteSuccessModal from '@/components/recycleBin/modals/DeleteSuccessModal';
import BatchRestoreConfirmModal from '@/components/recycleBin/modals/BatchRestoreConfirmModal';
import BatchRestoreSuccessModal from '@/components/recycleBin/modals/BatchRestoreSuccessModal';
import BatchDeleteConfirmModal from '@/components/recycleBin/modals/BatchDeleteConfirmModal';
import BatchDeleteSuccessModal from '@/components/recycleBin/modals/BatchDeleteSuccessModal';
import { useAuthContext } from '@/contexts/AuthContext';

const { Content } = Layout;

const RecycleBinPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const { 
    items,
    loading,
    error,
    selectedIds,
    pagination,
    filters,
    modalState
  } = useSelector(selectRecycleBinState);

  // 页面加载时获取回收站列表
  useEffect(() => {
    fetchRecycleBinData();
  }, [pagination.current, pagination.pageSize, filters]);

  // 获取回收站数据方法
  const fetchRecycleBinData = () => {
    dispatch(fetchRecycleBinItems({
      page: pagination.current,
      page_size: pagination.pageSize,
      search: filters.search || undefined,
      brand_id: filters.brandId || undefined,
      sort_field: filters.sortField,
      sort_order: filters.sortOrder
    }));
  };

  // 错误处理
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  return (
    <Layout className="recycle-bin-page">
      <NavigationSidebar />
      <Layout className="main-content">
        <Content>
          <PageHeader title={`${user?.name || ''}的货盘回收站`} />
          
          <div className="recycle-bin-container">
            <SearchAndFilterBar />
            <BatchActionBar selectedCount={selectedIds.length} />
            <ProductTable 
              loading={loading}
              dataSource={items}
              selectedRowKeys={selectedIds}
            />
            <PaginationControls 
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
            />
          </div>
          
          {/* 弹窗组件 */}
          <RestoreConfirmModal />
          <RestoreSuccessModal />
          <DeleteConfirmModal />
          <DeleteSuccessModal />
          <BatchRestoreConfirmModal />
          <BatchRestoreSuccessModal />
          <BatchDeleteConfirmModal />
          <BatchDeleteSuccessModal />
        </Content>
      </Layout>
    </Layout>
  );
};

export default RecycleBinPage;
```

### 5.2 ProductTable 组件

```tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { Table, Button, Space, Typography, Tag, Image, Tooltip } from 'antd';
import { UndoOutlined, DeleteOutlined } from '@ant-design/icons';
import { setSelectedIds, setModalState } from '@/store/recycleBin/slice';
import { formatDateTime } from '@/utils/date';
import { truncateText } from '@/utils/string';
import type { RecycleBinItem } from '@/types/recycleBin';

const { Text } = Typography;

interface ProductTableProps {
  loading: boolean;
  dataSource: RecycleBinItem[];
  selectedRowKeys: number[];
}

const ProductTable: React.FC<ProductTableProps> = ({ 
  loading, 
  dataSource, 
  selectedRowKeys 
}) => {
  const dispatch = useDispatch();

  // 处理表格行选择
  const handleRowSelection = (selectedRowKeys: React.Key[]) => {
    dispatch(setSelectedIds(selectedRowKeys as number[]));
  };

  // 打开还原确认弹窗
  const handleRestore = (id: number) => {
    dispatch(setModalState({
      modal: 'restoreConfirm',
      data: { visible: true, itemId: id }
    }));
  };

  // 打开删除确认弹窗
  const handleDelete = (id: number) => {
    dispatch(setModalState({
      modal: 'deleteConfirm',
      data: { visible: true, itemId: id }
    }));
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: ['product', 'id'],
      width: 80,
    },
    {
      title: '产品图片',
      dataIndex: ['product', 'attachments'],
      width: 100,
      render: (attachments: any[]) => {
        const image = attachments?.find(item => item.file_type === 'IMAGE');
        return image ? (
          <Image
            width={80}
            src={image.file_path}
            alt="产品图片"
            placeholder={true}
            fallback="/images/fallback-image.png"
          />
        ) : (
          <div className="no-image">无图片</div>
        );
      }
    },
    {
      title: '产品名称',
      dataIndex: ['product', 'name'],
      width: 200,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text ellipsis>{truncateText(text, 20)}</Text>
        </Tooltip>
      )
    },
    {
      title: '品牌',
      dataIndex: ['product', 'brand_name'],
      width: 150,
    },
    {
      title: '货号',
      dataIndex: ['product', 'product_code'],
      width: 120,
    },
    {
      title: '规格',
      dataIndex: ['product', 'specification'],
      width: 150,
      render: (text: string) => text || '-'
    },
    {
      title: '净含量',
      dataIndex: ['product', 'net_content'],
      width: 120,
      render: (text: string) => text || '-'
    },
    {
      title: '产品尺寸',
      dataIndex: ['product', 'product_size'],
      width: 120,
      render: (text: string) => text || '-'
    },
    {
      title: '发货方式',
      dataIndex: ['product', 'shipping_method'],
      width: 120,
      render: (text: string) => text || '-'
    },
    {
      title: '发货规格',
      dataIndex: ['product', 'shipping_spec'],
      width: 120,
      render: (text: string) => text || '-'
    },
    {
      title: '发货尺寸',
      dataIndex: ['product', 'shipping_size'],
      width: 120,
      render: (text: string) => text || '-'
    },
    {
      title: '价格档位',
      dataIndex: ['product', 'price_tiers'],
      width: 200,
      render: (priceTiers: any[]) => (
        <div className="price-tiers">
          {priceTiers && priceTiers.length > 0 ? (
            priceTiers.map((tier, index) => (
              <div key={index} className="price-tier-item">
                <Tag color="blue">{tier.quantity}件</Tag>
                <span className="price">¥{tier.price}</span>
              </div>
            ))
          ) : (
            <span>-</span>
          )}
        </div>
      )
    },
    {
      title: '素材包',
      dataIndex: ['product', 'attachments'],
      width: 100,
      render: (attachments: any[]) => {
        const material = attachments?.find(item => item.file_type === 'MATERIAL');
        return material ? (
          <a 
            href={material.file_path} 
            target="_blank" 
            rel="noopener noreferrer"
            className="material-link"
          >
            下载
          </a>
        ) : (
          <span>-</span>
        );
      }
    },
    {
      title: '产品链接',
      dataIndex: ['product', 'product_url'],
      width: 100,
      render: (text: string) => (
        text ? (
          <a 
            href={text} 
            target="_blank" 
            rel="noopener noreferrer"
            className="product-link"
          >
            访问
          </a>
        ) : (
          <span>-</span>
        )
      )
    },
    {
      title: '移入回收站时间',
      dataIndex: 'deleted_at',
      width: 180,
      sorter: true,
      render: (text: string) => formatDateTime(text)
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_: any, record: RecycleBinItem) => (
        <Space size="middle">
          <Button 
            type="primary"
            shape="circle"
            icon={<UndoOutlined />}
            title="还原产品"
            onClick={() => handleRestore(record.id)}
            className="restore-button"
          />
          <Button 
            type="primary"
            danger
            shape="circle"
            icon={<DeleteOutlined />}
            title="永久删除"
            onClick={() => handleDelete(record.id)}
            className="delete-button"
          />
        </Space>
      )
    }
  ];

  return (
    <Table
      className="recycle-bin-table"
      rowKey="id"
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowSelection={{
        selectedRowKeys,
        onChange: handleRowSelection
      }}
      pagination={false}
      scroll={{ x: 'max-content' }}
      size="middle"
    />
  );
};

export default ProductTable;
```

### 5.3 弹窗组件示例 (RestoreConfirmModal)

```tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'antd';
import { setModalState } from '@/store/recycleBin/slice';
import { restoreRecycleBinItem } from '@/store/recycleBin/actions';
import { selectRecycleBinState } from '@/store/recycleBin/selectors';

const RestoreConfirmModal: React.FC = () => {
  const dispatch = useDispatch();
  const { modalState } = useSelector(selectRecycleBinState);
  const { visible, itemId } = modalState.restoreConfirm;

  // 关闭弹窗
  const handleCancel = () => {
    dispatch(setModalState({
      modal: 'restoreConfirm',
      data: { visible: false }
    }));
  };

  // 确认还原
  const handleConfirm = () => {
    if (itemId) {
      dispatch(restoreRecycleBinItem(itemId));
    }
  };

  return (
    <Modal
      title="确定要还原此产品吗？"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button 
          key="confirm" 
          type="primary" 
          style={{ backgroundColor: '#52C41A' }}
          onClick={handleConfirm}
        >
          确定还原
        </Button>
      ]}
      centered
    >
      <p>还原后，产品将重新出现在货盘列表中。</p>
    </Modal>
  );
};

export default RestoreConfirmModal;
```

## 6. 样式设计

### 6.1 样式文件结构

```
styles/
├── components/
│   ├── recycleBin/
│   │   ├── index.less          // 回收站主样式文件
│   │   ├── productTable.less   // 产品表格样式
│   │   ├── batchActions.less   // 批量操作样式
│   │   ├── searchFilters.less  // 搜索和筛选样式
│   │   └── modals.less         // 弹窗样式
│   └── ...
└── ...
```

### 6.2 主样式文件（index.less）

```less
// 回收站页面主样式

@import '../../variables.less';

.recycle-bin-page {
  min-height: 100vh;
  background-color: @bg-color-light;

  .main-content {
    padding: 0;
    position: relative;
    overflow: hidden;
  }

  .recycle-bin-container {
    padding: 24px;
    background-color: @component-bg;
    border-radius: @border-radius-base;
    margin: 24px;
    box-shadow: @box-shadow-base;
  }

  .ant-page-header {
    padding: 16px 24px;
    background-color: @component-bg;
    border-bottom: 1px solid @border-color-split;
  }

  // 标题样式
  .page-title {
    font-size: 18px;
    font-weight: 600;
    color: @heading-color;
    margin-bottom: 16px;
  }

  // 警告文本样式
  .warning-text {
    color: @error-color;
    font-weight: 500;
  }

  // 操作按钮样式
  .action-buttons {
    margin-bottom: 16px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
```

### 6.3 产品表格样式（productTable.less）

```less
// 产品表格样式

@import '../../variables.less';

.recycle-bin-table {
  margin-top: 16px;
  
  .ant-table-thead > tr > th {
    background-color: @table-header-bg;
    font-weight: 600;
  }
  
  .restore-button {
    background-color: @success-color;
    border-color: @success-color;
    
    &:hover, &:focus {
      background-color: lighten(@success-color, 10%);
      border-color: lighten(@success-color, 10%);
    }
  }
  
  .price-tiers {
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    .price-tier-item {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .price {
        font-weight: 500;
        color: @price-color;
      }
    }
  }
  
  .no-image {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: @background-color-light;
    border: 1px dashed @border-color-base;
    color: @text-color-secondary;
    font-size: 12px;
  }
  
  .material-link, .product-link {
    color: @link-color;
    
    &:hover {
      color: @link-hover-color;
    }
  }
}

// 响应式调整
@media (max-width: @screen-md) {
  .recycle-bin-table {
    .ant-table-content {
      overflow-x: auto;
    }
    
    .ant-table-cell {
      white-space: nowrap;
    }
  }
}
```

### 6.4 批量操作栏样式（batchActions.less）

```less
// 批量操作样式

@import '../../variables.less';

.batch-action-bar {
  margin: 16px 0;
  padding: 12px 16px;
  background-color: @background-color-light;
  border-radius: @border-radius-base;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .selection-info {
    font-size: 14px;
    
    .selected-count {
      font-weight: 600;
      margin: 0 4px;
    }
  }
  
  .batch-buttons {
    display: flex;
    gap: 12px;
    
    .batch-restore-btn {
      background-color: @success-color;
      border-color: @success-color;
      
      &:hover, &:focus {
        background-color: lighten(@success-color, 10%);
        border-color: lighten(@success-color, 10%);
      }
      
      &[disabled] {
        background-color: @disabled-bg;
        border-color: @disabled-border;
      }
    }
    
    .batch-delete-btn {
      background-color: @error-color;
      border-color: @error-color;
      
      &:hover, &:focus {
        background-color: lighten(@error-color, 10%);
        border-color: lighten(@error-color, 10%);
      }
      
      &[disabled] {
        background-color: @disabled-bg;
        border-color: @disabled-border;
      }
    }
  }
}

// 响应式调整
@media (max-width: @screen-sm) {
  .batch-action-bar {
    flex-direction: column;
    gap: 12px;
    
    .selection-info {
      width: 100%;
      text-align: center;
    }
    
    .batch-buttons {
      width: 100%;
      justify-content: center;
    }
  }
}
```

### 6.5 弹窗样式（modals.less）

```less
// 弹窗样式

@import '../../variables.less';

.recycle-bin-modal {
  .ant-modal-header {
    border-bottom: 1px solid @border-color-split;
    padding: 16px 24px;
  }
  
  .ant-modal-title {
    font-size: 16px;
    font-weight: 600;
  }
  
  .ant-modal-body {
    padding: 24px;
    font-size: 14px;
  }
  
  .ant-modal-footer {
    border-top: 1px solid @border-color-split;
    padding: 16px 24px;
  }
  
  .modal-warning-text {
    color: @error-color;
    font-weight: 500;
    margin-bottom: 16px;
  }
  
  .modal-success-icon {
    font-size: 48px;
    color: @success-color;
    display: block;
    text-align: center;
    margin-bottom: 16px;
  }
  
  .modal-error-icon {
    font-size: 48px;
    color: @error-color;
    display: block;
    text-align: center;
    margin-bottom: 16px;
  }
  
  .modal-result-summary {
    margin-top: 16px;
    text-align: center;
    
    .result-count {
      font-weight: 600;
    }
  }
  
  // 确认按钮样式
  .confirm-restore-btn {
    background-color: @success-color;
    border-color: @success-color;
  }
  
  .confirm-delete-btn {
    background-color: @error-color;
    border-color: @error-color;
  }
}
```

## 7. 交互设计

### 7.1 表格交互

1. **行选择**:
   - 点击表格行前的复选框可选择单个产品
   - 点击表头的复选框可选择/取消选择当前页的所有产品
   - 选择产品后批量操作按钮变为可用状态

2. **翻页交互**:
   - 页码切换时会重新加载数据
   - 页码切换后会清空已选择的项目
   - 每页显示数量变更时会重新加载第一页数据

3. **排序交互**:
   - 可点击表头进行排序，支持升序/降序
   - 默认按删除时间降序排列

### 7.2 产品操作交互

1. **还原产品**:
   - 点击产品行中的"还原"按钮显示确认弹窗
   - 确认后执行还原操作，成功后显示成功提示
   - 还原成功后产品从列表中消失

2. **永久删除**:
   - 点击产品行中的"删除"按钮显示确认弹窗
   - 确认后执行删除操作，成功后显示成功提示
   - 删除成功后产品从列表中消失

3. **批量操作**:
   - 选择多个产品后批量操作按钮变为可用
   - 点击"批量还原"/"批量删除"按钮显示对应确认弹窗
   - 确认后执行批量操作，成功后显示成功提示
   - 操作完成后刷新数据列表

### 7.3 弹窗交互

所有弹窗遵循以下交互规则:
- 点击"取消"或"关闭"按钮关闭弹窗
- 点击弹窗外部区域不会关闭弹窗
- 弹窗显示时背景变暗并禁止其他交互
- 确认类弹窗需要明确点击确认才执行操作
- 成功提示弹窗自动在3秒后关闭

## 8. 性能优化

### 8.1 渲染优化

1. **虚拟滚动**:
   - 表格数据量大时使用虚拟滚动提高性能
   - 仅渲染可视区域内的表格行

2. **图片懒加载**:
   - 产品图片使用懒加载技术
   - 表格中的图片仅在进入可视区域时加载

3. **组件拆分**:
   - 将大型组件拆分为更小的子组件
   - 利用React.memo包裹纯展示组件避免不必要的重渲染

### 8.2 数据处理优化

1. **请求优化**:
   - 使用节流技术处理搜索输入
   - 搜索条件变更时取消未完成的旧请求
   - 排序和筛选利用服务端处理，避免前端大量数据计算

2. **缓存策略**:
   - 缓存已加载的页面数据
   - 相同查询条件时优先使用缓存数据
   - 操作成功后智能更新缓存而不总是重新请求

### 8.3 代码分割

1. **按需加载**:
   - 使用React.lazy和Suspense实现组件懒加载
   - 弹窗组件在需要时才加载

2. **代码拆分**:
   - 按业务逻辑拆分Redux代码
   - 公共组件和特定页面组件分离

## 9. 访问控制与安全

### 9.1 路由保护

```tsx
// 路由保护组件
const ProtectedRoute = ({ roles, element }) => {
  const { user, isAuthenticated } = useAuthContext();
  
  // 检查认证和角色权限
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // 检查角色权限
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return element;
};

// 路由配置
const routes = [
  {
    path: '/admin/recycle-bin',
    element: <ProtectedRoute roles={['ADMIN']} element={<RecycleBinPage />} />
  },
  {
    path: '/seller/recycle-bin',
    element: <ProtectedRoute roles={['SELLER']} element={<RecycleBinPage />} />
  }
];
```

### 9.2 API请求保护

所有API请求都需要包含认证Token，通过请求拦截器统一处理：

```tsx
// API请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// API响应拦截器
request.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token过期或无效，重定向到登录页
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 9.3 权限和数据隔离

1. **管理员权限**:
   - 可查看和操作所有公司总货盘中被删除的产品
   - 不能查看或操作销售员的产品

2. **销售员权限**:
   - 只能查看和操作自己删除的产品
   - 不能查看或操作其他销售员或公司的产品

3. **数据隔离实现**:
   ```tsx
   // 在API调用时添加权限控制参数
   const fetchRecycleBinData = () => {
     const params = {
       page: pagination.current,
       page_size: pagination.pageSize,
       search: filters.search || undefined,
       brand_id: filters.brandId || undefined,
       sort_field: filters.sortField,
       sort_order: filters.sortOrder
     };
     
     // 根据用户角色添加额外参数
     if (!user.is_admin) {
       params.owner_type = 'SELLER';
       params.owner_id = user.id;
     } else {
       params.owner_type = 'COMPANY';
     }
     
     dispatch(fetchRecycleBinItems(params));
   };
   ```

## 10. 测试要点

### 10.1 单元测试

测试关键组件和功能：

```tsx
// ProductTable组件测试
describe('ProductTable', () => {
  it('应该正确渲染产品列表', () => {
    // 准备测试数据和状态
    const mockItems = [...];
    const mockSelectedIds = [];
    
    // 渲染组件
    const { getByText, getAllByRole } = render(
      <Provider store={mockStore}>
        <ProductTable
          loading={false}
          dataSource={mockItems}
          selectedRowKeys={mockSelectedIds}
        />
      </Provider>
    );
    
    // 断言
    expect(getAllByRole('row').length).toBe(mockItems.length + 1); // +1 for header
    expect(getByText(mockItems[0].product.name)).toBeInTheDocument();
  });
  
  it('选择行时应该触发setSelectedIds', () => {
    // 测试行选择功能
  });
  
  it('点击还原按钮时应该打开确认弹窗', () => {
    // 测试还原交互
  });
});
```

### 10.2 集成测试

测试完整页面的功能和交互：

```tsx
describe('RecycleBinPage', () => {
  beforeEach(() => {
    // 模拟API请求
    jest.spyOn(global, 'fetch').mockImplementation(() => 
      Promise.resolve({
        json: () => Promise.resolve({ 
          code: 200, 
          data: { 
            list: mockItems,
            pagination: { total: 15, current_page: 1, per_page: 10 } 
          } 
        }),
        ok: true
      })
    );
  });
  
  it('应该加载并显示回收站产品列表', async () => {
    // 渲染页面
    const { findByText, findAllByRole } = render(
      <Provider store={mockStore}>
        <AuthProvider>
          <RecycleBinPage />
        </AuthProvider>
      </Provider>
    );
    
    // 等待异步加载完成
    const productName = await findByText(mockItems[0].product.name);
    expect(productName).toBeInTheDocument();
    
    // 断言表格行数
    const rows = await findAllByRole('row');
    expect(rows.length).toBe(mockItems.length + 1); // +1 for header
  });
  
  // 更多集成测试...
});
```

## 11. 开发注意事项

1. **字段一致性**:
   - 前端展示字段必须与API响应字段保持一致
   - 表格列名与数据库字段含义保持一致

2. **错误处理**:
   - 所有API请求需有完善的错误处理机制
   - 用户操作失败时提供清晰的错误提示

3. **状态管理**:
   - Redux状态更新应保持幂等性
   - 避免多处修改同一状态导致的冲突

4. **性能考量**:
   - 回收站列表可能存在大量数据，需考虑分页和虚拟滚动
   - 批量操作时需显示进度提示，避免用户误以为系统无响应

5. **交互保障**:
   - 永久删除操作需二次确认，并明确告知用户后果
   - 批量操作需显示明确的操作结果统计 