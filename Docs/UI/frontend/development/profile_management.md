# 个人资料管理页面开发规范

## 页面概述

个人资料管理页面允许用户（管理员或销售员）在登录系统后查看和编辑自己的个人信息。用户可以在此页面修改基本信息、更新头像、管理店铺信息以及上传微信二维码等。这是用户自行完善和维护个人详细资料的主要页面。

## 页面布局

整体分为两部分：
- **左侧**：系统导航侧边栏（窄导航模式）
- **右侧**：个人资料编辑区域

## 页面元素

### 左侧导航侧边栏

1. **系统Logo**：
   - 顶部显示"帮你"品牌简化标识
   
2. **功能导航图标**：
   - 垂直排列的功能导航图标
   - 当前页面对应的图标处于选中状态
   
3. **用户头像**：
   - 侧边栏底部显示当前登录用户的头像
   
4. **退出系统**：
   - 电源图标按钮，用于退出系统

### 右侧内容区

1. **页面标题**：
   - "个人资料"文字（左侧对齐）

2. **头像管理区域**：
   - 居中显示的大型圆形头像（直径约120px）
   - 头像上覆盖半透明遮罩及"更新头像"文字提示
   - 点击头像触发头像上传功能
   
3. **表单区域**：
   - 采用两列布局，标签右对齐
   - 表单项间距保持一致（垂直间距约20px）
   
4. **用户基本信息字段**：
   - 用户名（不可修改，显示为灰色背景）
   - 姓名（必填）
   - 电话（必填，11位数字格式）
   - 邮箱（选填，标准邮箱格式）
   - 所属公司（选填）

5. **密码修改区域**：
   - 新密码输入框（密码屏蔽显示）
   - 确认密码输入框（密码屏蔽显示）
   - 密码强度提示（根据输入实时显示）
   
6. **店铺管理区域**：
   - 标题："店铺管理"
   - 初始显示已有店铺信息（每行包含平台、店铺名称、URL）
   - 每行右侧提供编辑和删除图标
   - 底部显示"添加店铺"按钮（绿色加号图标）
   
7. **微信二维码区域**：
   - 标题："微信二维码"
   - 方形预览区域（200×200像素）
   - "上传二维码"按钮（绿色背景，白色文字）
   - 图片格式提示文本
   
8. **提交按钮**：
   - 底部绿色"保存更改"按钮（宽度约120px）
   - 按钮右侧可能有"取消"选项（灰色文字链接）

## 弹窗元素

系统包含多个模态框，用于不同的个人资料管理操作：

### 1. 头像上传弹窗

1. **标题**：
   - "上传头像"
   
2. **上传区域**：
   - 虚线边框矩形区域
   - 默认显示图片占位图标
   - 区域内文字说明："图片最大不超过20MB，支持JPG、PNG格式，建议尺寸800×800像素"
   - "选择图片"按钮（绿色背景，白色文字）
   
3. **预览区域**：
   - 显示选中的图片预览
   - 可能包含简单的裁剪功能
   
4. **提交按钮**：
   - 绿色背景，白色文字："上传"
   - 灰色背景，黑色文字："取消"
   
5. **关闭图标**：
   - 右上角红色叉号

### 2. 添加店铺弹窗

1. **标题**：
   - "添加店铺"
   
2. **表单字段**：
   - 店铺平台：下拉选择（抖音、淘宝、京东等）
   - 店铺名称：输入框
   - 店铺地址：输入框（URL格式）
   
3. **按钮**：
   - 绿色背景，白色文字："保存"
   - 灰色背景，黑色文字："取消"
   
4. **关闭图标**：
   - 右上角红色叉号

### 3. 编辑店铺弹窗

1. **标题**：
   - "编辑店铺"
   
2. **表单字段**：
   - 店铺平台：下拉选择（已选值）
   - 店铺名称：输入框（已填值）
   - 店铺地址：输入框（已填值）
   
3. **按钮**：
   - 绿色背景，白色文字："保存"
   - 灰色背景，黑色文字："取消"
   
4. **关闭图标**：
   - 右上角红色叉号

### 4. 删除店铺确认弹窗

1. **标题**：
   - "确认删除"
   
2. **提示文字**：
   - "确定要删除这个店铺信息吗？"
   
3. **按钮**：
   - 红色背景，白色文字："删除"
   - 灰色背景，黑色文字："取消"
   
4. **关闭图标**：
   - 右上角红色叉号

### 5. 保存成功弹窗

1. **标题**：
   - "操作成功"
   
2. **提示文字**：
   - "个人资料已成功更新"
   
3. **按钮**：
   - 绿色背景，白色文字："确定"
   
4. **关闭图标**：
   - 右上角红色叉号

## 交互说明

1. **头像更新流程**：
   - 点击头像打开头像上传弹窗
   - 选择图片后预览
   - 点击"上传"按钮提交
   - 上传成功后头像区域更新显示
   
2. **基本信息更新**：
   - 直接在表单字段中编辑信息
   - 字段失焦时进行格式验证
   - 点击"保存更改"按钮提交所有修改
   - 表单验证通过后显示成功提示
   
3. **密码修改流程**：
   - 填写新密码和确认密码
   - 密码输入过程中显示密码强度提示
   - 提交时验证两次输入是否一致
   - 密码符合要求时更新成功
   
4. **店铺管理流程**：
   - 点击"添加店铺"按钮打开添加店铺弹窗
   - 填写店铺信息并保存
   - 新店铺信息添加到列表中
   - 点击编辑图标打开编辑弹窗
   - 点击删除图标显示删除确认弹窗
   
5. **微信二维码更新**：
   - 点击"上传二维码"按钮选择图片
   - 选择后直接上传并更新预览区域
   - 上传成功后自动刷新显示

## 数据交互

### 前端数据模型

```typescript
// 用户个人资料模型
interface UserProfile {
  id: number;
  username: string;       // 用户名（只读）
  name: string;           // 姓名
  phone: string;          // 电话
  email: string;          // 邮箱
  company: string;        // 公司
  avatar: string;         // 头像URL
  wechat_qrcode: string;  // 微信二维码URL
  is_admin: boolean;      // 是否管理员
  status: string;         // 用户状态
  stores: Store[];        // 关联店铺
}

// 店铺信息模型
interface Store {
  id: number;
  platform: string;       // 平台名称
  name: string;           // 店铺名称
  url: string;            // 店铺地址
  created_at: string;     // 创建时间
}

// 密码更新模型
interface PasswordUpdate {
  new_password: string;
  confirm_password: string;
}
```

### 主要操作API

1. **获取个人资料**：
   - **接口路径**：`GET /api/auth/profile`
   - **响应数据**：包含用户基本信息（id、username、name、phone、email、company、status、is_admin、avatar、wechat_qrcode）和关联店铺
   
2. **更新基本信息**：
   - **接口路径**：`PUT /api/auth/profile`
   - **请求参数**：name、phone、email、company
   - **响应数据**：更新成功的确认信息和更新后的用户资料
   
3. **修改密码**：
   - **接口路径**：`PUT /api/auth/profile/password`
   - **请求参数**：new_password
   - **响应数据**：修改成功的确认信息
   
4. **头像上传**：
   - **接口路径**：`POST /api/pallet/attachments/image`
   - **请求参数**：file（图片文件）、entity_type（"USER"）、entity_id（用户ID）、upload_type（"avatar"）
   - **响应数据**：上传成功的文件信息和URL
   
5. **获取店铺列表**：
   - **接口路径**：`GET /api/auth/stores`
   - **响应数据**：用户关联的所有店铺信息（id、platform、name、url）
   
6. **添加店铺**：
   - **接口路径**：`POST /api/auth/stores`
   - **请求参数**：platform、name、url
   - **响应数据**：新创建的店铺信息
   
7. **更新店铺**：
   - **接口路径**：`PUT /api/auth/stores/{id}`
   - **请求参数**：platform、name、url
   - **响应数据**：更新后的店铺信息
   
8. **删除店铺**：
   - **接口路径**：`DELETE /api/auth/stores/{id}`
   - **响应数据**：删除成功的确认信息
   
9. **微信二维码上传**：
   - **接口路径**：`POST /api/pallet/attachments/image`
   - **请求参数**：file（图片文件）、entity_type（"USER"）、entity_id（用户ID）、upload_type（"qrcode"）
   - **响应数据**：上传成功的文件信息和URL

## 组件实现指南

### 个人资料表单组件

应实现为受控组件，使用Ant Design的Form组件：

```tsx
import { Form, Input, Button, message } from 'antd';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from '../../api/user';

const ProfileForm = () => {
  const [form] = Form.useForm();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        name: user.name,
        phone: user.phone,
        email: user.email,
        company: user.company
      });
    }
  }, [user, form]);
  
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await updateProfile({
        name: values.name,
        phone: values.phone,
        email: values.email,
        company: values.company
      });
      message.success('个人资料更新成功');
      refreshUser(); // 刷新用户信息
    } catch (error) {
      message.error('更新失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Form
      form={form}
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      onFinish={handleSubmit}
    >
      {/* 表单字段实现 */}
    </Form>
  );
};
```

### 头像上传组件

头像上传组件应使用Ant Design的Upload组件：

```tsx
import { Upload, Button, message } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const AvatarUpload = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只支持JPG/PNG格式图片!');
    }
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!isLt20M) {
      message.error('图片必须小于20MB!');
    }
    return isJpgOrPng && isLt20M;
  };
  
  const customRequest = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entity_type', 'USER');
    formData.append('entity_id', user.id);
    formData.append('upload_type', 'avatar');
    
    setLoading(true);
    try {
      // 调用上传API
      const response = await uploadImage(formData);
      onSuccess(response, file);
      message.success('头像上传成功');
      refreshUser(); // 刷新用户信息
    } catch (error) {
      onError(error);
      message.error('头像上传失败');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={beforeUpload}
      customRequest={customRequest}
    >
      {user.avatar ? (
        <img src={user.avatar} alt="avatar" style={{ width: '100%' }} />
      ) : (
        <div>
          <CameraOutlined />
          <div style={{ marginTop: 8 }}>更新头像</div>
        </div>
      )}
    </Upload>
  );
};
```

### 店铺管理组件

店铺管理应实现为列表与表单相结合的组件：

```tsx
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { getStores, addStore, updateStore, deleteStore } from '../../api/user';

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [currentStore, setCurrentStore] = useState(null);
  const [form] = Form.useForm();
  
  // 加载店铺列表
  const loadStores = async () => {
    setLoading(true);
    try {
      const data = await getStores();
      setStores(data);
    } catch (error) {
      message.error('获取店铺列表失败');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadStores();
  }, []);
  
  // 其他交互方法实现
  
  return (
    <div className="store-management">
      <div className="store-list-header">
        <h3>店铺管理</h3>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setCurrentStore(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          添加店铺
        </Button>
      </div>
      
      <Table 
        dataSource={stores}
        columns={columns}
        loading={loading}
        rowKey="id"
      />
      
      {/* 添加/编辑店铺模态框 */}
      <Modal
        title={currentStore ? "编辑店铺" : "添加店铺"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        confirmLoading={confirmLoading}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSaveStore}
        >
          {/* 表单字段实现 */}
        </Form>
      </Modal>
    </div>
  );
};
```

## 页面响应式设计

1. **桌面端（宽度 ≥ 1200px）**：
   - 两列布局，标签占据6列，输入框占据16列
   - 头像居中显示
   - 店铺管理表格完整显示
   
2. **平板端（768px ≤ 宽度 < 1200px）**：
   - 保持两列布局，但调整列比例（标签占4列，输入框占20列）
   - 可能需要调整部分间距
   
3. **移动端（宽度 < 768px）**：
   - 切换为单列布局
   - 标签位于输入框上方，左对齐
   - 头像尺寸适当缩小
   - 店铺管理使用卡片式布局替代表格

## 前端验证规则

1. **姓名**：
   - 必填
   - 长度限制：2-50个字符
   
2. **电话**：
   - 必填
   - 格式：11位数字的手机号码
   - 正则验证：`^[0-9]{11}$`
   
3. **邮箱**：
   - 选填
   - 标准邮箱格式验证
   - 正则验证：`^[^@]+@[^@]+\.[^@]+$`
   
4. **密码**：
   - 长度至少6位
   - 二次输入必须匹配
   - 建议包含字母和数字的组合
   
5. **店铺URL**：
   - 必须是有效的URL格式
   - 以http://或https://开头

## 设计规范

1. **色彩方案**：
   - 主色调：深色侧边栏配合浅色内容区
   - 功能色：绿色（#3CB371，按钮和成功状态）、红色（#FF4D4F，删除和错误状态）
   - 表单区域采用白色背景，增强清晰度
   
2. **字体规范**：
   - 标签文字：14px，#333333，右对齐
   - 输入框文字：14px，#000000
   - 按钮文字：14px，白色，居中显示
   - 提示文字：12px，#888888
   
3. **组件尺寸**：
   - 头像区域：直径120px
   - 输入框高度：32px
   - 按钮高度：32px
   - 表单项垂直间距：20px
   
4. **图标使用**：
   - 添加：PlusOutlined
   - 编辑：EditOutlined  
   - 删除：DeleteOutlined
   - 头像上传：CameraOutlined
   - 保存：SaveOutlined 