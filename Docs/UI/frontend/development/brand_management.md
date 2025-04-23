# 品牌管理页面开发规范

## 1. 页面概述

品牌管理页面是一个管理员专有功能页面，用于系统管理员创建、编辑、删除和管理货盘系统中的所有品牌信息。页面采用卡片网格布局，直观展示所有品牌，并提供品牌状态管理功能。

### 1.1 访问路径

- 路由路径：`/admin/brands`
- 权限要求：仅系统管理员可访问

### 1.2 功能特性

- 品牌列表展示（卡片网格形式）
- 品牌添加功能
- 品牌编辑功能
- 品牌删除功能
- 品牌状态管理（启用/禁用）

## 2. 页面组件结构

### 2.1 组件树

```
BrandManagementPage
├── MainLayout                   // 主布局组件
│   ├── Sidebar                  // 侧边导航栏组件
│   └── PageContent              // 页面内容区域
│       ├── PageHeader           // 页面标题区域
│       ├── BrandGrid            // 品牌卡片网格
│       │   ├── BrandCard        // 品牌卡片组件(多个)
│       │   └── AddBrandCard     // 添加品牌卡片
│       └── PaginationControls   // 分页控制组件
├── AddBrandModal                // 添加品牌弹窗
├── EditBrandModal               // 编辑品牌弹窗
├── DeleteBrandConfirmModal      // 删除确认弹窗
├── DeleteFailedModal            // 删除失败弹窗
├── EnableBrandConfirmModal      // 启用品牌确认弹窗
├── DisableBrandConfirmModal     // 禁用品牌确认弹窗
├── SuccessModal                 // 操作成功提示弹窗
└── FailureModal                 // 操作失败提示弹窗
```

### 2.2 组件职责

#### MainLayout（布局组件）
- 提供整体页面布局结构
- 集成侧边导航栏和内容区域

#### Sidebar（侧边导航组件）
- 显示系统导航菜单
- 高亮"品牌管理"菜单项
- 提供折叠/展开功能

#### PageHeader（页面标题组件）
- 显示"品牌管理"标题
- 维持与其他管理页面的一致性

#### BrandGrid（品牌网格组件）
- 采用响应式网格布局展示品牌卡片
- 在不同屏幕尺寸下调整每行卡片数量：
  - 大屏(≥1200px)：每行4个
  - 中屏(≥992px)：每行3个
  - 小屏(≥768px)：每行2个
  - 移动端(<768px)：每行1个

#### BrandCard（品牌卡片组件）
- 展示单个品牌信息
- 包含品牌Logo、名称、状态开关和操作按钮
- 处理卡片级交互事件（编辑、删除、状态切换）

#### AddBrandCard（添加品牌卡片组件）
- 特殊的卡片，用于添加新品牌
- 点击触发添加品牌弹窗

#### 各类弹窗组件
- 负责各自对应的业务操作
- 提供表单输入、确认操作或显示结果
- 统一的弹窗样式和交互方式

## 3. 数据模型与状态管理

### 3.1 数据模型

```typescript
// 品牌数据模型
interface Brand {
  id: number;              // 品牌ID
  name: string;            // 品牌名称
  logo_url: string;        // 品牌LOGO URL
  status: BrandStatus;     // 品牌状态
  created_at: string;      // 创建时间
  updated_at: string;      // 更新时间
  created_by: number;      // 创建人ID
  updated_by: number;      // 更新人ID
}

// 品牌状态枚举
enum BrandStatus {
  ACTIVE = 'ACTIVE',       // 启用状态
  INACTIVE = 'INACTIVE'    // 禁用状态
}

// 分页数据模型
interface PaginationData {
  current_page: number;    // 当前页码
  total_pages: number;     // 总页数
  total_count: number;     // 总记录数
  page_size: number;       // 每页记录数
}

// 品牌列表响应模型
interface BrandListResponse {
  code: number;            // 状态码
  data: {
    list: Brand[];         // 品牌列表
    meta: PaginationData;  // 分页信息
  };
  message: string;         // 消息
}
```

### 3.2 状态管理

使用Redux Toolkit管理品牌相关状态：

```typescript
// brands Slice
const brandsSlice = createSlice({
  name: 'brands',
  initialState: {
    list: [],                // 品牌列表
    loading: false,          // 加载状态
    error: null,             // 错误信息
    pagination: {            // 分页信息
      current: 1,            // 当前页码
      pageSize: 12,          // 每页显示数量
      total: 0               // 总记录数
    },
    currentBrand: null       // 当前操作的品牌
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
// api/brand.js
import request from '../utils/request';

// 获取品牌列表
export function getBrands(params) {
  return request({
    url: '/api/pallet/brands',
    method: 'get',
    params
  });
}

// 添加品牌
export function addBrand(data) {
  return request({
    url: '/api/pallet/brands',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// 编辑品牌
export function updateBrand(id, data) {
  return request({
    url: `/api/pallet/brands/${id}`,
    method: 'put',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// 删除品牌
export function deleteBrand(id) {
  return request({
    url: `/api/pallet/brands/${id}`,
    method: 'delete'
  });
}

// 更改品牌状态
export function changeBrandStatus(id, status) {
  return request({
    url: `/api/pallet/brands/${id}/status`,
    method: 'patch',
    data: { status }
  });
}
```

### 4.2 API调用时机

| 功能 | 调用时机 | API方法 |
|------|----------|---------|
| 获取品牌列表 | 页面加载、分页切换、操作完成后刷新 | `getBrands` |
| 添加品牌 | 添加品牌表单提交时 | `addBrand` |
| 编辑品牌 | 编辑品牌表单提交时 | `updateBrand` |
| 删除品牌 | 删除确认弹窗确认时 | `deleteBrand` |
| 启用/禁用品牌 | 状态开关切换确认时 | `changeBrandStatus` |

### 4.3 异步操作处理

使用Redux Toolkit的createAsyncThunk处理异步操作：

```typescript
// 获取品牌列表异步action
export const fetchBrands = createAsyncThunk(
  'brands/fetchBrands',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getBrands(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
```

## 5. UI组件实现

### 5.1 BrandCard 组件

```tsx
import React from 'react';
import { Card, Switch, Dropdown, Menu, Typography, Space } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Meta } = Card;
const { Text } = Typography;

const StyledCard = styled(Card)`
  margin-bottom: 16px;
  .ant-card-cover {
    padding: 16px;
    display: flex;
    justify-content: center;
    background-color: #fafafa;
    height: 150px;
  }
  .ant-card-cover img {
    max-height: 100%;
    object-fit: contain;
  }
  .ant-card-actions {
    border-top: 1px solid #f0f0f0;
  }
`;

interface BrandCardProps {
  brand: Brand;
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
  onStatusChange: (brand: Brand, newStatus: BrandStatus) => void;
}

const BrandCard: React.FC<BrandCardProps> = ({
  brand,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const handleStatusChange = (checked: boolean) => {
    const newStatus = checked ? BrandStatus.ACTIVE : BrandStatus.INACTIVE;
    onStatusChange(brand, newStatus);
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => onEdit(brand)}
      >
        编辑
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        onClick={() => onDelete(brand)}
      >
        删除
      </Menu.Item>
    </Menu>
  );

  const cardActions = [
    <div key="status">
      <Space>
        <Text type="secondary">状态:</Text>
        <Switch
          checkedChildren="启用"
          unCheckedChildren="禁用"
          checked={brand.status === BrandStatus.ACTIVE}
          onChange={handleStatusChange}
        />
      </Space>
    </div>,
    <Dropdown key="more" overlay={menu} trigger={['click']}>
      <MoreOutlined style={{ fontSize: '16px' }} />
    </Dropdown>,
  ];

  return (
    <StyledCard
      hoverable
      cover={<img alt={brand.name} src={brand.logo_url} />}
      actions={cardActions}
    >
      <Meta title={brand.name} />
    </StyledCard>
  );
};

export default BrandCard;
```

### 5.2 BrandGrid 组件

```tsx
import React from 'react';
import { Row, Col, Empty, Spin } from 'antd';
import BrandCard from './BrandCard';
import AddBrandCard from './AddBrandCard';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store/store';

interface BrandGridProps {
  onAddBrand: () => void;
  onEditBrand: (brand: Brand) => void;
  onDeleteBrand: (brand: Brand) => void;
  onStatusChange: (brand: Brand, newStatus: BrandStatus) => void;
}

const BrandGrid: React.FC<BrandGridProps> = ({
  onAddBrand,
  onEditBrand,
  onDeleteBrand,
  onStatusChange,
}) => {
  const { list: brands, loading } = useSelector((state: RootState) => state.brands);

  // 响应式布局配置
  const responsiveConfig = {
    xs: 24,      // 移动端一行显示1个
    sm: 12,      // 小屏一行显示2个
    md: 8,       // 中屏一行显示3个
    lg: 6,       // 大屏一行显示4个
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      <Col {...responsiveConfig}>
        <AddBrandCard onAdd={onAddBrand} />
      </Col>
      
      {brands.length > 0 ? (
        brands.map((brand) => (
          <Col key={brand.id} {...responsiveConfig}>
            <BrandCard
              brand={brand}
              onEdit={onEditBrand}
              onDelete={onDeleteBrand}
              onStatusChange={onStatusChange}
            />
          </Col>
        ))
      ) : (
        <Col span={24} style={{ textAlign: 'center' }}>
          <Empty description="暂无品牌数据" />
        </Col>
      )}
    </Row>
  );
};

export default BrandGrid;
```

### 5.3 AddBrandModal 组件

```tsx
import React, { useState } from 'react';
import { Modal, Form, Input, Button, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';

interface AddBrandModalProps {
  visible: boolean;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const AddBrandModal: React.FC<AddBrandModalProps> = ({
  visible,
  loading,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
      return false;
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
      return false;
    }
    
    return false; // 阻止自动上传
  };

  const handleChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const getBase64 = (file: RcFile): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      // 添加logo文件到表单数据
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('logo', fileList[0].originFileObj);
        onSubmit(formData);
      } else {
        message.error('请上传品牌LOGO');
      }
    });
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传LOGO</div>
    </div>
  );

  return (
    <>
      <Modal
        title="添加品牌"
        visible={visible}
        onCancel={onCancel}
        footer={[
          <Button key="back" onClick={onCancel}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            确定
          </Button>,
        ]}
      >
        <Form 
          form={form} 
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="name"
            label="品牌名称"
            rules={[{ required: true, message: '请输入品牌名称' }]}
          >
            <Input placeholder="请输入品牌名称" maxLength={50} />
          </Form.Item>
          
          <Form.Item
            name="logo"
            label="品牌LOGO"
            rules={[{ required: true, message: '请上传品牌LOGO' }]}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              onPreview={handlePreview}
              maxCount={1}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      
      <Modal
        visible={previewVisible}
        title="图片预览"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="预览" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default AddBrandModal;
```

## 6. 交互逻辑实现

### 6.1 品牌管理页面主组件

```tsx
import React, { useState, useEffect } from 'react';
import { Typography, Pagination, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import MainLayout from 'components/layout/MainLayout';
import PageHeader from 'components/common/PageHeader';
import BrandGrid from 'components/brand/BrandGrid';
import AddBrandModal from 'components/brand/AddBrandModal';
import EditBrandModal from 'components/brand/EditBrandModal';
import DeleteBrandConfirmModal from 'components/brand/DeleteBrandConfirmModal';
import ConfirmModal from 'components/common/ConfirmModal';
import { 
  fetchBrands, 
  addBrandAsync,
  updateBrandAsync,
  deleteBrandAsync,
  changeBrandStatusAsync
} from 'store/slices/brandsSlice';
import { RootState } from 'store/store';

const { Title } = Typography;

const BrandManagementPage: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    list: brands, 
    loading, 
    pagination,
    error 
  } = useSelector((state: RootState) => state.brands);
  
  // 各种modal状态
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [newStatus, setNewStatus] = useState<BrandStatus | null>(null);
  
  // 加载品牌列表
  useEffect(() => {
    dispatch(fetchBrands({
      page: pagination.current,
      page_size: pagination.pageSize
    }));
  }, [dispatch, pagination.current, pagination.pageSize]);
  
  // 错误处理
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);
  
  // 分页处理
  const handlePageChange = (page: number, pageSize?: number) => {
    dispatch(fetchBrands({
      page: page,
      page_size: pageSize || pagination.pageSize
    }));
  };
  
  // 添加品牌
  const handleAddBrand = () => {
    setAddModalVisible(true);
  };
  
  const handleAddBrandSubmit = (values: any) => {
    dispatch(addBrandAsync(values))
      .unwrap()
      .then(() => {
        setAddModalVisible(false);
        message.success('添加品牌成功');
      })
      .catch(err => {
        message.error('添加品牌失败: ' + err.message);
      });
  };
  
  // 编辑品牌
  const handleEditBrand = (brand: Brand) => {
    setCurrentBrand(brand);
    setEditModalVisible(true);
  };
  
  const handleEditBrandSubmit = (values: any) => {
    if (!currentBrand) return;
    
    dispatch(updateBrandAsync({ id: currentBrand.id, data: values }))
      .unwrap()
      .then(() => {
        setEditModalVisible(false);
        setCurrentBrand(null);
        message.success('编辑品牌成功');
      })
      .catch(err => {
        message.error('编辑品牌失败: ' + err.message);
      });
  };
  
  // 删除品牌
  const handleDeleteBrand = (brand: Brand) => {
    setCurrentBrand(brand);
    setDeleteModalVisible(true);
  };
  
  const handleDeleteConfirm = () => {
    if (!currentBrand) return;
    
    dispatch(deleteBrandAsync(currentBrand.id))
      .unwrap()
      .then(() => {
        setDeleteModalVisible(false);
        setCurrentBrand(null);
        message.success('删除品牌成功');
      })
      .catch(err => {
        message.error('删除品牌失败: ' + err.message);
      });
  };
  
  // 切换品牌状态
  const handleStatusChange = (brand: Brand, status: BrandStatus) => {
    setCurrentBrand(brand);
    setNewStatus(status);
    setStatusModalVisible(true);
  };
  
  const handleStatusConfirm = () => {
    if (!currentBrand || !newStatus) return;
    
    dispatch(changeBrandStatusAsync({ id: currentBrand.id, status: newStatus }))
      .unwrap()
      .then(() => {
        setStatusModalVisible(false);
        setCurrentBrand(null);
        setNewStatus(null);
        message.success(`${newStatus === BrandStatus.ACTIVE ? '启用' : '禁用'}品牌成功`);
      })
      .catch(err => {
        message.error(`${newStatus === BrandStatus.ACTIVE ? '启用' : '禁用'}品牌失败: ${err.message}`);
      });
  };
  
  // 获取状态操作文本
  const getStatusModalText = () => {
    if (!currentBrand || !newStatus) return '';
    
    return newStatus === BrandStatus.ACTIVE 
      ? `确定要启用品牌 "${currentBrand.name}" 吗？`
      : `确定要禁用品牌 "${currentBrand.name}" 吗？`;
  };
  
  return (
    <MainLayout>
      <PageHeader title="品牌管理" />
      
      <BrandGrid
        onAddBrand={handleAddBrand}
        onEditBrand={handleEditBrand}
        onDeleteBrand={handleDeleteBrand}
        onStatusChange={handleStatusChange}
      />
      
      {/* 分页控件 */}
      <div style={{ textAlign: 'right', marginTop: 16 }}>
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
      
      {/* 各种模态框 */}
      <AddBrandModal
        visible={addModalVisible}
        loading={loading}
        onCancel={() => setAddModalVisible(false)}
        onSubmit={handleAddBrandSubmit}
      />
      
      <EditBrandModal
        visible={editModalVisible}
        loading={loading}
        brand={currentBrand}
        onCancel={() => {
          setEditModalVisible(false);
          setCurrentBrand(null);
        }}
        onSubmit={handleEditBrandSubmit}
      />
      
      <DeleteBrandConfirmModal
        visible={deleteModalVisible}
        loading={loading}
        brandName={currentBrand?.name || ''}
        onCancel={() => {
          setDeleteModalVisible(false);
          setCurrentBrand(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
      
      <ConfirmModal
        title={newStatus === BrandStatus.ACTIVE ? '启用品牌' : '禁用品牌'}
        content={getStatusModalText()}
        visible={statusModalVisible}
        loading={loading}
        onCancel={() => {
          setStatusModalVisible(false);
          setCurrentBrand(null);
          setNewStatus(null);
        }}
        onConfirm={handleStatusConfirm}
      />
    </MainLayout>
  );
};

export default BrandManagementPage;
```

### 6.2 关键交互流程

#### 品牌添加流程
1. 用户点击"添加品牌"卡片
2. 打开添加品牌弹窗
3. 用户填写品牌名称并上传LOGO
4. 用户点击"确定"按钮
5. 表单验证通过后，创建FormData对象并提交API请求
6. 请求成功后关闭弹窗，显示成功提示，并刷新品牌列表
7. 请求失败则显示错误提示

#### 品牌编辑流程
1. 用户点击品牌卡片的"编辑"选项
2. 打开编辑品牌弹窗，预填充当前品牌信息
3. 用户修改品牌信息
4. 用户点击"确定"按钮
5. 表单验证通过后提交API请求
6. 请求成功后关闭弹窗，显示成功提示，并刷新品牌列表
7. 请求失败则显示错误提示

#### 品牌删除流程
1. 用户点击品牌卡片的"删除"选项
2. 打开删除确认弹窗
3. 用户点击"确定"按钮
4. 提交API请求
5. 请求成功后关闭弹窗，显示成功提示，并刷新品牌列表
6. 请求失败则显示错误提示

#### 品牌状态切换流程
1. 用户切换品牌卡片上的状态开关
2. 打开状态确认弹窗
3. 用户点击"确定"按钮
4. 提交API请求
5. 请求成功后关闭弹窗，显示成功提示，并刷新品牌列表
6. 请求失败则显示错误提示

## 7. 测试策略

### 7.1 单元测试

单元测试应覆盖以下组件和功能点：

```typescript
// 组件测试示例 - BrandCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import BrandCard from './BrandCard';

describe('BrandCard 组件', () => {
  const mockBrand = {
    id: 1,
    name: '测试品牌',
    logo_url: 'http://example.com/logo.png',
    status: BrandStatus.ACTIVE,
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  };
  
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnStatusChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('正确渲染品牌信息', () => {
    render(
      <BrandCard 
        brand={mockBrand}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );
    
    expect(screen.getByText('测试品牌')).toBeInTheDocument();
    expect(screen.getByAltText('测试品牌')).toHaveAttribute('src', mockBrand.logo_url);
    expect(screen.getByRole('switch')).toBeChecked();
  });
  
  test('点击编辑按钮触发回调', () => {
    render(
      <BrandCard 
        brand={mockBrand}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );
    
    // 先点击下拉菜单
    fireEvent.click(screen.getByRole('button', { name: /more/i }));
    // 再点击编辑按钮
    fireEvent.click(screen.getByText('编辑'));
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockBrand);
  });
  
  // 其他测试用例...
});
```

需要覆盖的测试用例:

1. 组件渲染测试：
   - 验证各组件正确渲染所有UI元素
   - 验证条件渲染逻辑（如加载状态、空数据状态）

2. 交互测试：
   - 验证用户操作触发正确的回调函数
   - 验证表单验证规则
   - 验证模态框显示/隐藏逻辑

3. Redux状态测试：
   - 验证reducer正确处理各种action
   - 验证异步thunk操作正确处理成功/失败情况

4. API调用测试：
   - 模拟API响应测试成功/失败处理逻辑

### 7.2 集成测试

集成测试应覆盖以下场景：

1. 页面加载流程：
   - 验证页面加载时正确请求品牌列表
   - 验证正确展示加载状态和数据

2. 完整的CRUD流程：
   - 添加品牌 -> 验证列表更新
   - 编辑品牌 -> 验证数据更新
   - 删除品牌 -> 验证列表更新
   - 切换状态 -> 验证状态更新

```typescript
// 集成测试示例 - BrandManagement.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import brandsReducer from 'store/slices/brandsSlice';
import BrandManagementPage from './BrandManagementPage';
import * as api from 'api/brand';

// Mock API调用
jest.mock('api/brand');

describe('BrandManagementPage 集成测试', () => {
  let store;
  
  beforeEach(() => {
    store = configureStore({
      reducer: {
        brands: brandsReducer
      }
    });
    
    // 模拟API响应
    (api.getBrands as jest.Mock).mockResolvedValue({
      code: 0,
      data: {
        list: [
          {
            id: 1,
            name: '测试品牌',
            logo_url: 'http://example.com/logo.png',
            status: 'ACTIVE',
            created_at: '2023-01-01',
            updated_at: '2023-01-01'
          }
        ],
        meta: {
          current_page: 1,
          total_pages: 1,
          total_count: 1,
          page_size: 12
        }
      },
      message: 'success'
    });
  });
  
  test('加载品牌列表', async () => {
    render(
      <Provider store={store}>
        <BrandManagementPage />
      </Provider>
    );
    
    // 验证加载状态
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // 等待数据加载完成
    await waitFor(() => {
      expect(screen.getByText('测试品牌')).toBeInTheDocument();
    });
    
    // 验证API调用
    expect(api.getBrands).toHaveBeenCalledWith({ page: 1, page_size: 12 });
  });
  
  // 其他集成测试场景...
});
```

### 7.3 端到端测试（E2E）

使用Cypress或Playwright进行端到端测试，覆盖以下关键用户流程：

1. 用户登录 -> 导航到品牌管理页面 -> 查看品牌列表
2. 添加新品牌 -> 验证成功消息 -> 验证列表中出现新品牌
3. 编辑品牌 -> 验证成功消息 -> 验证数据已更新
4. 切换品牌状态 -> 验证成功消息 -> 验证状态已更新
5. 删除品牌 -> 验证成功消息 -> 验证品牌已从列表中移除
6. 分页测试 -> 验证能够正确切换页面和改变每页显示数量

```javascript
// Cypress E2E测试示例 - brand_management.spec.js
describe('品牌管理页面', () => {
  beforeEach(() => {
    // 登录并导航到品牌管理页面
    cy.login('admin', 'password');
    cy.visit('/admin/brands');
  });
  
  it('显示品牌列表', () => {
    cy.get('[data-testid="brand-card"]').should('have.length.at.least', 1);
  });
  
  it('可以添加新品牌', () => {
    // 点击添加品牌卡片
    cy.get('[data-testid="add-brand-card"]').click();
    
    // 填写表单
    cy.get('input[name="name"]').type('新测试品牌');
    cy.get('input[type="file"]').attachFile('test-logo.png');
    
    // 提交表单
    cy.get('button[type="submit"]').click();
    
    // 验证成功消息
    cy.get('.ant-message').should('contain', '添加品牌成功');
    
    // 验证新品牌已添加到列表
    cy.get('[data-testid="brand-card"]').should('contain', '新测试品牌');
  });
  
  // 其他E2E测试场景...
});
```

## 8. 性能优化

### 8.1 图片优化

品牌LOGO应进行以下优化处理：

1. 上传时进行图片压缩（客户端或服务端）
2. 使用适当的图片格式（优先使用WebP，兼容PNG）
3. 实现响应式图片加载，根据设备DPR和尺寸提供不同大小的图片
4. 实现图片懒加载，仅加载视口内可见的图片

```tsx
// 图片优化示例
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// BrandCard组件中使用懒加载图片
const BrandCard = ({ brand, ...props }) => {
  return (
    <StyledCard
      hoverable
      cover={
        <LazyLoadImage
          alt={brand.name}
          src={brand.logo_url}
          effect="blur"
          threshold={100}
          wrapperClassName="brand-logo-wrapper"
        />
      }
      // ... 其他属性
    >
      {/* ... 卡片内容 */}
    </StyledCard>
  );
};
```

### 8.2 分页与虚拟列表

对于大量品牌数据，应实施以下优化策略：

1. **服务端分页**：限制每次请求的数据量，通过API分页获取数据
2. **滚动加载**：实现滚动到底部时自动加载更多数据
3. **虚拟列表**：当单页数据量很大时，使用react-window或react-virtualized等库实现虚拟列表，只渲染可视区域内的卡片

```tsx
// 虚拟列表示例代码
import { FixedSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const VirtualizedBrandGrid = ({ brands, onBrandClick }) => {
  // 计算每行显示的卡片数量
  const getColumnCount = (width) => {
    if (width >= 1200) return 4; // lg
    if (width >= 992) return 3;  // md
    if (width >= 768) return 2;  // sm
    return 1;                    // xs
  };
  
  // 渲染单个卡片
  const Cell = ({ columnIndex, rowIndex, style, data }) => {
    const { brands, columnCount } = data;
    const index = rowIndex * columnCount + columnIndex;
    
    if (index >= brands.length) return null;
    
    return (
      <div style={style}>
        <BrandCard 
          brand={brands[index]}
          // ... 其他属性
        />
      </div>
    );
  };
  
  return (
    <AutoSizer>
      {({ height, width }) => {
        const columnCount = getColumnCount(width);
        const rowCount = Math.ceil(brands.length / columnCount);
        const columnWidth = width / columnCount;
        
        return (
          <FixedSizeGrid
            columnCount={columnCount}
            columnWidth={columnWidth}
            height={height}
            rowCount={rowCount}
            rowHeight={300} // 卡片高度
            width={width}
            itemData={{ brands, columnCount }}
          >
            {Cell}
          </FixedSizeGrid>
        );
      }}
    </AutoSizer>
  );
};
```

### 8.3 状态管理优化

1. **选择性重渲染**：使用`React.memo`、`useMemo`和`useCallback`避免不必要的重渲染
2. **Redux选择器优化**：使用`reselect`库创建记忆化选择器，避免不必要的状态计算
3. **状态规范化**：将品牌数据在Redux存储中规范化，以便更高效地查找和更新

```tsx
// 选择器优化示例
import { createSelector } from 'reselect';

// 基础选择器
const selectBrandsState = (state) => state.brands;

// 记忆化选择器
export const selectAllBrands = createSelector(
  [selectBrandsState],
  (brandsState) => brandsState.list
);

export const selectActiveBrands = createSelector(
  [selectAllBrands],
  (brands) => brands.filter(brand => brand.status === BrandStatus.ACTIVE)
);

export const selectBrandById = createSelector(
  [selectAllBrands, (_, brandId) => brandId],
  (brands, brandId) => brands.find(brand => brand.id === brandId)
);
```

### 8.4 网络请求优化

1. **数据缓存**：缓存已获取的品牌数据，减少重复请求
2. **请求防抖**：对于搜索和筛选操作实施防抖处理，避免频繁API调用
3. **批量操作**：支持批量删除或状态切换，减少API请求次数

```tsx
// 请求防抖示例
import { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { fetchBrands } from 'store/slices/brandsSlice';

const BrandSearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  
  // 创建防抖搜索函数
  const debouncedSearch = useCallback(
    debounce((term) => {
      dispatch(fetchBrands({ 
        page: 1, 
        page_size: 12,
        search: term 
      }));
    }, 500),
    [dispatch]
  );
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };
  
  return (
    <Input
      placeholder="搜索品牌"
      value={searchTerm}
      onChange={handleSearchChange}
      // ... 其他属性
    />
  );
};
```

## 9. 兼容性要求

### 9.1 浏览器兼容性

品牌管理页面应支持以下浏览器的最新两个主要版本：

| 浏览器 | 最低版本要求 |
|-------|------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Opera | 76+ |

不需要支持Internet Explorer。

### 9.2 设备兼容性

页面应在以下设备上正常工作：

1. **桌面端**：
   - Windows（1920×1080及以上分辨率）
   - macOS（1440×900及以上分辨率）
   - Linux（1920×1080及以上分辨率）

2. **平板端**：
   - iPad (768×1024)
   - Android平板 (最小800×1280)

3. **移动端**：
   - iPhone 8及以上机型（375×667及以上分辨率）
   - Android手机（最小360×640）

### 9.3 特殊兼容性处理

1. **网络条件适应**：
   - 实现断网检测和重连机制
   - 在弱网环境下展示合适的加载状态
   - 保存表单编辑状态，防止意外断网导致数据丢失

2. **高DPI屏幕适配**：
   - 使用矢量图标（SVG）或高分辨率图片
   - 使用相对单位（rem, em）而非固定像素值
   - 为Retina屏幕提供2x或3x图片资源

```css
/* 高DPI屏幕适配CSS示例 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .brand-logo-fallback {
    background-image: url('logo@2x.png');
    background-size: 100% 100%;
  }
}

@media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 288dpi) {
  .brand-logo-fallback {
    background-image: url('logo@3x.png');
    background-size: 100% 100%;
  }
}
```

## 10. 设计规范参考

### 10.1 颜色系统

品牌管理页面使用公司统一设计系统中的颜色变量：

| 颜色用途 | 变量名 | 十六进制值 |
|---------|-------|-----------|
| 主色调 | --primary-color | #1890ff |
| 成功色 | --success-color | #52c41a |
| 警告色 | --warning-color | #faad14 |
| 错误色 | --error-color | #f5222d |
| 标题文字 | --heading-color | #262626 |
| 正文文字 | --text-color | #595959 |
| 次要文字 | --text-color-secondary | #8c8c8c |
| 禁用文字 | --disabled-color | #bfbfbf |
| 边框颜色 | --border-color | #d9d9d9 |
| 背景色 | --background-color | #f5f5f5 |
| 表头背景 | --table-header-bg | #fafafa |

### 10.2 排版规范

遵循公司设计系统中的字体和排版规范：

| 元素 | 字体大小 | 行高 | 字重 |
|-----|---------|-----|-----|
| 页面标题 | 24px | 32px | 500 |
| 卡片标题 | 16px | 24px | 500 |
| 正文内容 | 14px | 22px | 400 |
| 辅助文字 | 12px | 20px | 400 |
| 按钮文字 | 14px | 22px | 400 |

字体家族：
- 中文：-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei'
- 英文：'Helvetica Neue', Arial, sans-serif
- 代码：'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace

### 10.3 间距规范

使用8px倍数的间距系统：

| 间距名称 | 大小 | 用途 |
|---------|-----|-----|
| --spacing-xs | 4px | 极小间距，如图标与文字间距 |
| --spacing-sm | 8px | 组件内部元素间距 |
| --spacing-md | 16px | 卡片内边距，相关元素间距 |
| --spacing-lg | 24px | 区块间距，主要内容分区 |
| --spacing-xl | 32px | 大区块间距，页面主要部分 |

### 10.4 卡片设计规范

品牌卡片遵循以下设计规范：

- 卡片尺寸：固定宽度280px（在响应式布局中会自适应调整）
- 卡片内边距：16px（顶部/底部/左侧/右侧）
- LOGO展示区：高度150px，背景色#fafafa
- 卡片圆角：2px
- 卡片阴影：0 1px 2px rgba(0, 0, 0, 0.15)
- 悬停阴影：0 4px 12px rgba(0, 0, 0, 0.15)

```scss
// 卡片设计变量
$card-width: 280px;
$card-padding: 16px;
$card-logo-height: 150px;
$card-logo-bg: #fafafa;
$card-border-radius: 2px;
$card-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
$card-hover-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

// 使用设计变量的样式示例
.brand-card {
  width: $card-width;
  padding: $card-padding;
  border-radius: $card-border-radius;
  box-shadow: $card-shadow;
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: $card-hover-shadow;
  }
  
  .logo-container {
    height: $card-logo-height;
    background-color: $card-logo-bg;
  }
}
```

### 10.5 设计资源

更多详细设计规范和资源，请参考公司内部设计系统文档：

- 设计系统文档：[链接到公司内部设计系统文档]
- Figma设计稿：[链接到Figma设计稿]
- 组件库文档：[链接到组件库文档] 