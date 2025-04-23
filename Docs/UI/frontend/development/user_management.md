# 用户管理页面开发规范

## 页面概述

用户管理页面是系统管理员专用功能，用于创建、编辑和管理货盘系统中的管理员用户信息。管理员可以通过此页面添加管理员、修改管理员状态、重置密码等操作。该页面主要管理系统管理员用户，普通销售员用户在销售员管理页面中进行管理。

## 页面布局

整体分为两部分：
- **左侧**：系统导航侧边栏（窄导航模式）
- **右侧**：用户管理主内容区

## 页面元素

### 左侧导航侧边栏

1. **系统Logo**：
   - 顶部显示"帮你"品牌简化标识
   
2. **功能导航图标**：
   - 垂直排列的功能导航图标
   - "用户管理"图标处于选中状态
   
3. **用户头像**：
   - 侧边栏底部显示当前登录用户的头像
   
4. **退出系统**：
   - 电源图标按钮，用于退出系统

### 右侧内容区

1. **页面标题**：
   - "管理员列表"文字（左侧对齐）
   
2. **操作按钮区域**：
   - "添加管理员"绿色按钮（右上角位置）
   - "批量重置密码"灰色按钮（位于右上角区域，添加管理员按钮旁）
   
3. **搜索过滤区域**：
   - 搜索框：占位文本"搜索用户名/姓名/手机号"
   - 搜索按钮：放大镜图标
   
4. **用户列表表格**：
   - 表头：复选框、ID、用户名、姓名、电话、状态、创建时间、操作
   - 分页控件：显示在表格底部
   - 复选框：用于批量选择用户
   - 用户状态：显示为开关切换按钮（绿色=ACTIVE，灰色=INACTIVE）
   - 操作列：包含"编辑"和"删除"按钮

## 弹窗元素

系统包含多个模态框，用于不同的用户管理操作：

### 1. 添加用户弹窗

1. **标题**：
   - "添加管理员"
   
2. **表单字段**：
   - 用户名输入框：占位文本"请输入用户名（5-20个字符）"
   - 密码输入框：占位文本"请输入密码（至少6位）"
   - 确认密码输入框：占位文本"请再次输入密码"
   
3. **提交按钮**：
   - 绿色背景，白色文字："提交"
   - 宽度与弹窗等宽
   
4. **关闭图标**：
   - 右上角红色叉号

### 2. 添加成功弹窗

1. **标题**：
   - "添加管理员成功"
   
2. **提示文字**：
   - "已成功添加用户：{username}"
   
3. **按钮**：
   - 灰色背景，黑色文字："关闭"
   
4. **关闭图标**：
   - 右上角红色叉号

### 3. 编辑用户弹窗

1. **标题**：
   - "编辑管理员"
   
2. **表单字段**：
   - 用户名（只读，灰色背景）
   - 密码输入框：占位文本"请输入新密码（不修改请留空）"
   - 确认密码输入框：占位文本"请再次输入新密码"
   
3. **提交按钮**：
   - 绿色背景，白色文字："提交"
   - 宽度与弹窗等宽
   
4. **关闭图标**：
   - 右上角红色叉号

### 4. 编辑成功弹窗

1. **标题**：
   - "编辑用户成功"
   
2. **按钮**：
   - 灰色背景，黑色文字："关闭"
   
3. **关闭图标**：
   - 右上角红色叉号

### 5. 删除确认弹窗

1. **标题**：
   - "确定删除用户吗？"
   
2. **警告文字**：
   - 红色文字："删除用户后将不可恢复"
   
3. **按钮**：
   - 灰色背景，黑色文字："取消"
   - 红色背景，白色文字："删除"
   
4. **关闭图标**：
   - 右上角红色叉号

### 6. 删除成功弹窗

1. **标题**：
   - "删除用户成功"
   
2. **按钮**：
   - 灰色背景，黑色文字："关闭"
   
3. **关闭图标**：
   - 右上角红色叉号

### 7. 状态变更确认弹窗

1. **启用用户确认**:
   - 标题："确定启用此用户吗？"
   - 提示文字："启用后，该用户将可以正常登录系统。"
   - 按钮：
     - 灰色背景，黑色文字："取消"
     - 绿色背景，白色文字："确定启用"
   - 关闭图标：右上角红色叉号

2. **停用用户确认**:
   - 标题："确定停用此用户吗？"
   - 提示文字："停用后，该用户将无法登录系统。"
   - 按钮：
     - 灰色背景，黑色文字："取消"
     - 红色背景，白色文字："确定停用"
   - 关闭图标：右上角红色叉号

### 8. 批量重置密码确认弹窗

1. **标题**：
   - "批量重置密码确认"
   
2. **提示文字**：
   - "确定要重置所选用户的密码吗？"
   - "密码将被重置为：123456"
   - "已选择 {n} 个用户"
   
3. **按钮**：
   - 灰色背景，黑色文字："取消"
   - 蓝色背景，白色文字："确认重置"
   
4. **关闭图标**：
   - 右上角红色叉号

### 9. 批量重置密码成功弹窗

1. **标题**：
   - "批量重置密码成功"
   
2. **提示文字**：
   - "已成功重置 {n} 个用户的密码"
   - "重置后的默认密码为：123456"
   
3. **按钮**：
   - 灰色背景，黑色文字："关闭"
   
4. **关闭图标**：
   - 右上角红色叉号

## 交互说明

1. **搜索用户**：
   - 在搜索框中输入关键字
   - 点击搜索按钮或按回车键
   - 表格内容根据搜索结果刷新
   
2. **添加管理员**：
   - 点击"添加管理员"按钮打开添加用户弹窗
   - 填写用户名和密码
   - 点击"提交"按钮创建用户
   - 成功后显示添加成功弹窗
   
3. **编辑用户**：
   - 点击用户行的编辑图标打开编辑用户弹窗
   - 修改相关信息
   - 点击"提交"按钮保存修改
   - 成功后显示编辑成功弹窗
   
4. **删除用户**：
   - 点击用户行的删除图标打开删除确认弹窗
   - 确认删除或取消操作
   - 删除成功后显示删除成功弹窗
   
5. **更改用户状态**：
   - 点击用户状态开关
   - 显示相应的状态变更确认弹窗
   - 确认后切换状态
   - 不能对自己的账户进行停用操作
   
6. **批量重置密码**：
   - 通过表格前的复选框选择一个或多个用户
   - 点击"批量重置密码"按钮
   - 在确认弹窗中确认操作
   - 操作成功后显示成功提示弹窗

## 数据交互

### 前端数据模型

```typescript
// 用户信息模型
interface User {
  id: number;
  username: string;     // 用户名
  name: string;         // 姓名
  phone: string;        // 电话
  email: string;        // 邮箱
  is_admin: boolean;    // 是否管理员
  status: string;       // 状态(ACTIVE/INACTIVE)
  created_at: string;   // 创建时间
  updated_at: string;   // 更新时间
  stores?: Store[];     // 关联店铺
}

// 用户列表查询参数
interface UserQueryParams {
  username?: string;    // 用户名
  name?: string;        // 姓名  
  phone?: string;       // 电话
  page: number;         // 页码
  pageSize: number;     // 每页条数
  is_admin: boolean;    // 是否管理员
}

// 分页数据
interface PaginationData {
  total: number;        // 总记录数
  current_page: number; // 当前页码
  per_page: number;     // 每页条数
}

// 创建用户请求
interface CreateUserRequest {
  username: string;     // 用户名
  password: string;     // 密码
  is_admin: boolean;    // 是否管理员(true)
}

// 修改密码请求
interface PasswordUpdateRequest {
  new_password: string; // 新密码
}

// 状态更新请求
interface StatusUpdateRequest {
  status: 'ACTIVE' | 'INACTIVE'; // 状态
}

// 批量重置密码请求
interface BatchResetPasswordRequest {
  user_ids: number[];   // 用户ID数组
}
```

## 对应API接口

1. **获取用户列表**：
   - **接口路径**：`GET /api/auth/users`
   - **请求参数**：
     - username（可选，搜索用户名）
     - name（可选，搜索姓名）
     - phone（可选，搜索电话）
     - page（可选，默认1）
     - pageSize（可选，默认10）
     - is_admin（固定为true，表示只查询管理员）
   - **响应数据**：包含用户列表（id、username、name、phone、email、is_admin、status、created_at等）和分页信息
   
2. **添加用户**：
   - **接口路径**：`POST /api/auth/users`
   - **请求参数**：username、password、is_admin（固定为true）
   - **响应数据**：新创建的用户信息，包含id、username、is_admin、status、created_at
   
3. **修改密码**：
   - **接口路径**：`PATCH /api/auth/users/{id}/password`
   - **请求参数**：new_password
   - **响应数据**：更新成功的确认信息，包含id、username、updated_at
   
4. **更改用户状态**：
   - **接口路径**：`PATCH /api/auth/users/{id}/status`
   - **请求参数**：status（ACTIVE/INACTIVE）
   - **响应数据**：状态更新的确认信息，包含id、username、status、updated_at
   
5. **批量重置密码**：
   - **接口路径**：`POST /api/auth/users/batch/reset-password`
   - **请求参数**：user_ids（用户ID数组）
   - **响应数据**：操作结果统计信息，包含total、success、failed、updated_at

## 组件实现指南

### 用户列表表格组件

使用Ant Design的Table组件实现，带有分页和选择功能：

```tsx
import { Table, Switch, Button, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { getUserList, updateUserStatus } from '../../api/user';

const UserTable = ({ onEdit, onDelete, onSelectChange }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  
  // 定义列配置
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 120
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120
    },
    {
      title: '电话',
      dataIndex: 'phone',
      width: 150
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status, record) => (
        <Switch
          checked={status === 'ACTIVE'}
          onChange={(checked) => handleStatusChange(record.id, checked)}
          disabled={record.id === currentUser.id} // 禁止修改当前登录用户状态
        />
      )
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 180,
      render: (time) => new Date(time).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)}
          />
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => onDelete(record)}
            disabled={record.id === currentUser.id} // 禁止删除当前登录用户
          />
        </Space>
      )
    }
  ];
  
  // 状态变更处理
  const handleStatusChange = async (userId, checked) => {
    try {
      await updateUserStatus(userId, checked ? 'ACTIVE' : 'INACTIVE');
      // 刷新列表
      fetchUsers();
    } catch (error) {
      message.error('状态更新失败');
    }
  };
  
  // 加载用户列表
  const fetchUsers = async (params = {}) => {
    setLoading(true);
    try {
      const { users, pagination } = await getUserList({
        page: pagination.current,
        pageSize: pagination.pageSize,
        is_admin: true,
        ...params
      });
      setUsers(users);
      setPagination({
        ...pagination,
        total: pagination.total
      });
    } catch (error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 表格分页、排序、筛选变化时触发
  const handleTableChange = (pagination, filters, sorter) => {
    fetchUsers({
      page: pagination.current,
      pageSize: pagination.pageSize
    });
  };
  
  // 选择变更处理
  const onRowSelectionChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
    onSelectChange(selectedRowKeys);
  };
  
  // 首次加载数据
  useEffect(() => {
    fetchUsers();
  }, []);
  
  return (
    <Table
      rowSelection={{
        selectedRowKeys,
        onChange: onRowSelectionChange
      }}
      columns={columns}
      dataSource={users}
      rowKey="id"
      pagination={pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};
```

### 添加用户表单组件

```tsx
import { Form, Input, Button, message } from 'antd';
import { useState } from 'react';
import { createUser } from '../../api/user';

const AddUserForm = ({ onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const result = await createUser({
        ...values,
        is_admin: true // 固定为管理员
      });
      message.success('添加用户成功');
      form.resetFields();
      onSuccess(result);
    } catch (error) {
      message.error('添加用户失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          { required: true, message: '请输入用户名' },
          { min: 5, max: 20, message: '用户名长度必须在5-20个字符之间' }
        ]}
      >
        <Input placeholder="请输入用户名（5-20个字符）" />
      </Form.Item>
      
      <Form.Item
        name="password"
        label="密码"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码长度不能少于6位' }
        ]}
      >
        <Input.Password placeholder="请输入密码（至少6位）" />
      </Form.Item>
      
      <Form.Item
        name="confirm_password"
        label="确认密码"
        dependencies={['password']}
        rules={[
          { required: true, message: '请确认密码' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不一致'));
            }
          })
        ]}
      >
        <Input.Password placeholder="请再次输入密码" />
      </Form.Item>
      
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};
```

## 设计规范

1. **色彩方案**：
   - 主色调：深色侧边栏配合浅色内容区
   - 功能色：绿色（#52C41A，激活状态）、红色（#FF4D4F，删除和停用）
   - 表格行使用斑马纹增强可读性（#FAFAFA/白色交替）
   
2. **字体规范**：
   - 页面标题：18px，#000000，左对齐
   - 表格标题：14px，#1F1F1F，居中对齐
   - 表格内容：14px，#333333
   - 按钮文字：14px，白色（主按钮）或黑色（次按钮）
   
3. **组件尺寸**：
   - 搜索框宽度：300px
   - 按钮高度：32px
   - 表格行高：54px
   - 弹窗宽度：500px
   
4. **图标使用**：
   - 添加：PlusOutlined
   - 编辑：EditOutlined
   - 删除：DeleteOutlined
   - 搜索：SearchOutlined
   - 刷新：ReloadOutlined

## 响应式设计

1. **桌面端（宽度 ≥ 1200px）**：
   - 表格完整显示所有列
   - 操作区按钮横向排列
   
2. **平板端（768px ≤ 宽度 < 1200px）**：
   - 表格可能隐藏部分次要列
   - 操作区按钮依然横向排列但间距减小
   
3. **移动端（宽度 < 768px）**：
   - 表格改为卡片式布局
   - 操作区按钮垂直排列或使用下拉菜单
   - 搜索框宽度自适应缩小

## 特殊说明

1. **权限控制**：
   - 本页面仅限管理员(is_admin=true)访问
   - 用户无法删除自己的账户
   - 用户无法停用自己的账户
   
2. **数据限制**：
   - 本页面仅显示管理员用户(is_admin=true)
   - 销售员用户在销售员管理页面单独管理
   
3. **密码规则**：
   - 用户密码最小长度为6位
   - 批量重置密码统一设置为默认密码：123456
   - 系统不会自动发送密码重置通知，需管理员手动告知用户
   
4. **状态说明**：
   - ACTIVE：用户可以正常登录系统
   - INACTIVE：用户被停用，无法登录系统 