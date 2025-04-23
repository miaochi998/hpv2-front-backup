# 业务员管理页面原型说明

## 页面概述

业务员管理页面是系统管理员专用功能，用于创建、编辑、删除和管理货盘系统中的所有业务员账号信息。管理员可以通过此页面添加业务员用户、设置基本信息、分配权限，以及管理业务员的状态（启用/禁用）。

## 页面布局

整体分为两部分：
- **左侧**：系统导航侧边栏（窄导航模式）
- **右侧**：业务员管理主内容区

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
   - "业务员管理"文字（左侧对齐）
   
2. **搜索和过滤区**：
   - 搜索框：可按业务员姓名、手机号码搜索
   - 状态筛选下拉菜单：全部、启用、禁用
   - 添加业务员按钮：绿色背景，白色文字"添加业务员"，右侧对齐
   
3. **业务员列表表格**：
   - 表头包含：序号、姓名、手机号码、创建时间、状态、操作
   - 支持分页浏览
   - 支持按创建时间排序

### 列表项元素

1. **序号**：
   - 按顺序显示的数字
   
2. **姓名**：
   - 业务员姓名文本
   
3. **手机号码**：
   - 业务员联系电话
   
4. **创建时间**：
   - 账号创建的日期和时间，格式：YYYY-MM-DD HH:MM:SS
   
5. **状态标签**：
   - 启用：绿色背景，显示"启用"
   - 禁用：灰色背景，显示"禁用"
   
6. **操作按钮**：
   - 编辑按钮：蓝色文字"编辑"
   - 删除按钮：红色文字"删除"
   - 状态切换按钮：
     - 当前为启用状态时：红色文字"禁用"
     - 当前为禁用状态时：绿色文字"启用"

## 弹窗元素

系统包含多个模态框，用于不同的业务员管理操作：

### 1. 添加业务员弹窗

1. **标题**：
   - "添加业务员"
   
2. **表单元素**：
   - **姓名**：
     - 标签："姓名"
     - 输入框：占位文本"请输入业务员姓名"
     - 必填项标记（红色星号）
   
   - **手机号码**：
     - 标签："手机号码"
     - 输入框：占位文本"请输入11位手机号码"
     - 必填项标记（红色星号）
   
   - **登录密码**：
     - 标签："登录密码"
     - 输入框：占位文本"请设置6-20位登录密码"
     - 密码显示切换按钮（眼睛图标）
     - 必填项标记（红色星号）
   
   - **确认密码**：
     - 标签："确认密码"
     - 输入框：占位文本"请再次输入登录密码"
     - 密码显示切换按钮（眼睛图标）
     - 必填项标记（红色星号）
   
   - **权限设置**：
     - 标签："可管理品牌"
     - 多选框列表：显示所有可选品牌
     - 全选/取消全选按钮
   
3. **提交按钮**：
   - 绿色背景，白色文字："提交"
   - 灰色背景，黑色文字："取消"
   
4. **关闭图标**：
   - 右上角红色叉号

### 2. 添加成功弹窗

1. **标题**：
   - "添加业务员成功"
   
2. **按钮**：
   - 灰色背景，黑色文字："关闭"
   
3. **关闭图标**：
   - 右上角红色叉号

### 3. 编辑业务员弹窗

1. **标题**：
   - "编辑业务员"
   
2. **表单元素**：
   - **姓名**：
     - 标签："姓名"
     - 输入框：已填入当前业务员姓名
     - 必填项标记（红色星号）
   
   - **手机号码**：
     - 标签："手机号码"
     - 输入框：已填入当前业务员手机号码
     - 必填项标记（红色星号）
   
   - **重置密码**：
     - 复选框："重置密码"
     - 默认不勾选
   
   - **新密码**（仅在勾选重置密码时显示）：
     - 标签："新密码"
     - 输入框：占位文本"请设置6-20位新密码"
     - 密码显示切换按钮（眼睛图标）
     - 必填项标记（红色星号）
   
   - **确认新密码**（仅在勾选重置密码时显示）：
     - 标签："确认新密码"
     - 输入框：占位文本"请再次输入新密码"
     - 密码显示切换按钮（眼睛图标）
     - 必填项标记（红色星号）
   
   - **权限设置**：
     - 标签："可管理品牌"
     - 多选框列表：显示所有可选品牌，已分配的品牌处于选中状态
     - 全选/取消全选按钮
   
3. **提交按钮**：
   - 绿色背景，白色文字："提交"
   - 灰色背景，黑色文字："取消"
   
4. **关闭图标**：
   - 右上角红色叉号

### 4. 编辑成功弹窗

1. **标题**：
   - "成功编辑业务员信息"
   
2. **按钮**：
   - 灰色背景，黑色文字："关闭"
   
3. **关闭图标**：
   - 右上角红色叉号

### 5. 删除确认弹窗

1. **标题**：
   - "确定删除该业务员吗？"
   
2. **提示文字**：
   - "删除后，该业务员将无法登录系统，已关联的数据将保留。"
   
3. **按钮**：
   - 灰色背景，黑色文字："取消"
   - 红色背景，白色文字："删除"
   
4. **关闭图标**：
   - 右上角红色叉号

### 6. 状态变更确认弹窗

1. **启用业务员确认**:
   - 标题："确定启用此业务员吗？"
   - 提示文字："启用后，该业务员将可以正常登录并使用系统。"
   - 按钮：
     - 灰色背景，黑色文字："取消"
     - 绿色背景，白色文字："确定启用"
   - 关闭图标：右上角红色叉号

2. **禁用业务员确认**:
   - 标题："确定禁用此业务员吗？"
   - 提示文字："禁用后，该业务员将无法登录系统，直到重新启用。"
   - 按钮：
     - 灰色背景，黑色文字："取消"
     - 红色背景，白色文字："确定禁用"
   - 关闭图标：右上角红色叉号

### 7. 状态变更成功弹窗

1. **启用成功**:
   - 标题："业务员已成功启用"
   - 按钮：灰色背景，黑色文字："关闭"
   - 关闭图标：右上角红色叉号

2. **禁用成功**:
   - 标题："业务员已成功禁用"
   - 按钮：灰色背景，黑色文字："关闭"
   - 关闭图标：右上角红色叉号

## 交互说明

1. **添加业务员**：
   - 点击"添加业务员"按钮打开添加业务员弹窗
   - 填写必要的业务员信息和选择权限
   - 点击"提交"按钮创建业务员账号
   - 成功后显示添加成功弹窗
   
2. **编辑业务员**：
   - 点击列表中对应业务员行的"编辑"按钮打开编辑业务员弹窗
   - 修改业务员信息或权限设置
   - 如需重置密码，勾选"重置密码"选项并填写新密码
   - 点击"提交"按钮保存修改
   - 成功后显示编辑成功弹窗
   
3. **删除业务员**：
   - 点击列表中对应业务员行的"删除"按钮打开删除确认弹窗
   - 确认删除或取消操作
   - 删除成功后刷新业务员列表

4. **业务员状态管理**：
   - 点击列表中对应业务员行的"禁用"或"启用"按钮
   - 显示相应的状态变更确认弹窗
   - 确认后切换状态并显示成功提示
   - 状态变化后，列表中的状态标签和操作按钮相应更新

5. **搜索和筛选**：
   - 在搜索框中输入关键词可搜索对应的业务员
   - 选择状态筛选下拉菜单中的选项可筛选不同状态的业务员
   - 搜索和筛选操作会立即更新业务员列表

## 对应API接口

1. **获取业务员列表**：
   - **接口路径**：`GET /api/pallet/salespersons`
   - **请求参数**：keyword（可选，搜索关键词）、status（可选，状态筛选）、page（页码）、limit（每页显示数量）
   - **响应数据**：包含业务员列表（id、name、phone、status、created_at、brand_ids等）和分页信息
   
2. **添加业务员**：
   - **接口路径**：`POST /api/pallet/salespersons`
   - **请求参数**：name、phone、password、brand_ids（数组）
   - **响应数据**：新创建的业务员信息，包含id、name、phone、status、created_at
   
3. **编辑业务员**：
   - **接口路径**：`PUT /api/pallet/salespersons/{id}`
   - **请求参数**：name、phone、password（可选，仅在重置密码时提供）、brand_ids（数组）
   - **响应数据**：更新后的业务员信息，包含id、name、phone、status、updated_at
   
4. **删除业务员**：
   - **接口路径**：`DELETE /api/pallet/salespersons/{id}`
   - **响应数据**：删除成功的确认信息或错误信息
   
5. **更改业务员状态**：
   - **接口路径**：`PATCH /api/pallet/salespersons/{id}/status`
   - **请求参数**：status（ACTIVE/INACTIVE）
   - **响应数据**：状态更新的确认信息，包含id、name、status、updated_at

6. **获取可选品牌列表**：
   - **接口路径**：`GET /api/pallet/brands/active`
   - **响应数据**：包含所有可选品牌的列表（id、name）

## 设计规范

1. **色彩方案**：
   - 主色调：深色侧边栏配合浅色内容区
   - 主按钮：绿色（#00A870）
   - 警告按钮：红色（#F56C6C）
   - 信息按钮：蓝色（#409EFF）
   
2. **字体**：
   - 标题：16px，加粗
   - 表格表头：14px，加粗
   - 表格内容：14px，常规
   - 按钮文字：14px，常规
   
3. **间距和对齐**：
   - 内容区内边距：20px
   - 表格行高：50px
   - 表单项间距：20px
   - 按钮间距：10px
   
4. **响应式布局**：
   - 桌面端优先设计
   - 表格在小屏幕上可水平滚动
   - 弹窗在移动端自适应居中显示

## 数据校验规则

1. **姓名**：
   - 不能为空
   - 长度限制：2-20个字符
   
2. **手机号码**：
   - 不能为空
   - 必须为有效的11位中国大陆手机号码
   - 系统内不允许存在重复的手机号码
   
3. **密码**：
   - 不能为空
   - 长度限制：6-20个字符
   - 必须包含字母和数字

4. **确认密码**：
   - 必须与密码字段一致

5. **权限设置**：
   - 业务员必须至少分配一个品牌权限 

# 销售员用户管理页面开发规范

## 概述

本文档详细说明了销售员用户管理页面的开发规范，包括页面结构、组件规范、数据交互和业务逻辑等内容。开发人员应严格遵循本规范进行开发，确保页面风格统一，功能完整。

## 技术栈要求

- 前端框架：Vue.js 3.0
- UI组件库：Element Plus
- HTTP请求：Axios
- 状态管理：Pinia
- TypeScript

## 页面结构

页面整体采用左侧窄导航 + 右侧内容区的布局方式，与系统其他管理页面保持一致。

### 路由配置

```typescript
// router/index.ts
{
  path: '/users/sales',
  name: 'SalesUserManagement',
  component: () => import('@/views/users/SalesUserManagement.vue'),
  meta: {
    requiresAuth: true,
    adminOnly: true,
    title: '销售员管理'
  }
}
```

### 组件结构

```
views/users/
├── SalesUserManagement.vue      # 销售员管理页面主组件
├── components/
│   ├── UserSearchBar.vue        # 搜索过滤组件
│   ├── UserTable.vue            # 用户列表表格组件
│   ├── AddUserDialog.vue        # 添加用户弹窗组件
│   ├── EditUserDialog.vue       # 编辑用户弹窗组件
│   ├── DeleteConfirmDialog.vue  # 删除确认弹窗组件
│   ├── ResetPasswordDialog.vue  # 批量重置密码弹窗组件
│   └── StoreTagList.vue         # 店铺标签列表组件
```

## 数据模型

### 用户数据模型

```typescript
// types/user.ts
export interface SalesUser {
  id: number;
  username: string;      // 用户名
  name: string;          // 姓名
  phone: string;         // 电话
  avatar: string;        // 头像URL
  email: string;         // 邮箱
  status: UserStatus;    // 状态
  stores: Store[];       // 关联店铺
  created_at: string;    // 创建时间
  last_login_time: string; // 最后登录时间
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface Store {
  id: number;
  platform: string;      // 平台名称
  name: string;          // 店铺名称
  url: string;           // 店铺链接
}

// 查询参数
export interface UserQueryParams {
  keyword?: string;      // 搜索关键词
  page: number;          // 页码
  page_size: number;     // 每页条数
  is_admin: boolean;     // 是否为管理员
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
```

## 组件详细规范

### 页面主组件 (SalesUserManagement.vue)

负责组织页面整体结构，管理子组件之间的通信和状态。

```vue
<template>
  <div class="sales-user-management">
    <div class="page-header">
      <h1 class="page-title">用户管理</h1>
      <div class="action-buttons">
        <el-button type="success" @click="openAddUserDialog">添加用户</el-button>
        <el-button @click="openBatchResetPasswordDialog" :disabled="!hasSelectedUsers">批量重置密码</el-button>
      </div>
    </div>
    
    <UserSearchBar 
      @search="handleSearch" 
      :loading="loading" 
    />
    
    <UserTable 
      :users="users"
      :loading="loading"
      :total="total"
      :page="page"
      :pageSize="pageSize"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
      @edit="handleEditUser"
      @delete="handleDeleteUser"
      @status-change="handleStatusChange"
      @selection-change="handleSelectionChange"
    />
    
    <AddUserDialog 
      v-model:visible="addUserDialogVisible"
      @success="handleAddSuccess"
    />
    
    <EditUserDialog 
      v-model:visible="editUserDialogVisible"
      :user="currentUser"
      @success="handleEditSuccess"
    />
    
    <DeleteConfirmDialog 
      v-model:visible="deleteConfirmVisible"
      :username="currentUser?.username"
      @confirm="confirmDelete"
    />
    
    <ResetPasswordDialog 
      v-model:visible="resetPasswordDialogVisible"
      :selectedCount="selectedUsers.length"
      @confirm="confirmResetPasswords"
    />
  </div>
</template>

<script lang="ts" setup>
// ...实现脚本部分
</script>

<style scoped>
.sales-user-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 10px;
}
</style>
```

### 搜索组件 (UserSearchBar.vue)

提供搜索功能，支持按用户名、姓名、电话搜索。

```vue
<template>
  <div class="user-search-bar">
    <el-input
      v-model="keyword"
      placeholder="输入用户名、姓名、电话等搜索用户"
      clearable
      @keyup.enter="search"
    >
      <template #suffix>
        <el-icon class="search-icon" @click="search"><Search /></el-icon>
      </template>
    </el-input>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue';

const keyword = ref('');
const emit = defineEmits(['search']);

const search = () => {
  emit('search', keyword.value);
};
</script>

<style scoped>
.user-search-bar {
  margin-bottom: 20px;
}

.search-icon {
  cursor: pointer;
}
</style>
```

### 用户表格组件 (UserTable.vue)

显示销售员列表，支持分页、选择、状态切换等操作。

```vue
<template>
  <div class="user-table">
    <el-table
      v-loading="loading"
      :data="users"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="用户头像" width="80">
        <template #default="{ row }">
          <el-avatar :size="40" :src="row.avatar">
            {{ row.username.substring(0, 1).toUpperCase() }}
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="phone" label="电话" width="120" />
      <el-table-column label="用户店铺" min-width="200">
        <template #default="{ row }">
          <StoreTagList :stores="row.stores" />
        </template>
      </el-table-column>
      <el-table-column label="用户状态" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="UserStatus.ACTIVE"
            :inactive-value="UserStatus.INACTIVE"
            @change="(val) => handleStatusChange(row, val)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" text size="small" @click="handleEdit(row)">
            <el-icon><Edit /></el-icon>
          </el-button>
          <el-button type="danger" text size="small" @click="handleDelete(row)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="currentPageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
// ...实现脚本部分
</script>

<style scoped>
.user-table {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
```

### 店铺标签组件 (StoreTagList.vue)

显示用户关联的店铺列表，以标签形式展示。

```vue
<template>
  <div class="store-tag-list">
    <el-tag
      v-for="store in stores"
      :key="store.id"
      type="info"
      effect="plain"
      class="store-tag"
    >
      {{ store.platform }}: {{ store.name }}
    </el-tag>
    <el-tag v-if="stores.length === 0" type="info" effect="plain">无关联店铺</el-tag>
  </div>
</template>

<script lang="ts" setup>
import { Store } from '@/types/user';

defineProps({
  stores: {
    type: Array as PropType<Store[]>,
    default: () => []
  }
});
</script>

<style scoped>
.store-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.store-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
```

### 添加用户弹窗 (AddUserDialog.vue)

用于添加新销售员用户。

```vue
<template>
  <el-dialog
    title="添加用户"
    v-model="dialogVisible"
    width="500px"
    @closed="resetForm"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="输入用户名" />
      </el-form-item>
      
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="默认密码：123456"
          show-password
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm" :loading="loading">
        提交
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
// ...实现脚本部分
</script>
```

### 编辑用户弹窗 (EditUserDialog.vue)

用于编辑销售员信息和重置密码。

```vue
<template>
  <el-dialog
    title="编辑用户"
    v-model="dialogVisible"
    width="500px"
    @closed="resetForm"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="用户名">
        <el-input v-model="form.username" disabled />
      </el-form-item>
      
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="输入新密码，不修改请留空"
          show-password
        />
      </el-form-item>
      
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          placeholder="再次输入新密码"
          show-password
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm" :loading="loading">
        提交
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
// ...实现脚本部分
</script>
```

### 删除确认弹窗 (DeleteConfirmDialog.vue)

用于确认删除销售员操作。

```vue
<template>
  <el-dialog
    title="删除用户"
    v-model="dialogVisible"
    width="400px"
  >
    <div class="delete-confirm-content">
      <p>确定要删除用户吗?</p>
      <p class="delete-warning">删除用户后将不可恢复。</p>
    </div>
    
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="danger" @click="confirmDelete" :loading="loading">
        永久删除
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
// ...实现脚本部分
</script>

<style scoped>
.delete-confirm-content {
  text-align: center;
  padding: 20px 0;
}

.delete-warning {
  color: #F56C6C;
  margin-top: 10px;
}
</style>
```

### 批量重置密码弹窗 (ResetPasswordDialog.vue)

用于批量重置选中销售员的密码。

```vue
<template>
  <el-dialog
    title="批量重置密码"
    v-model="dialogVisible"
    width="400px"
  >
    <div class="reset-password-content">
      <p>确定要重置所选用户的密码吗?</p>
      <p>密码将被重置为默认密码：123456</p>
      <p>已选择 {{ selectedCount }} 个用户</p>
    </div>
    
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmReset" :loading="loading">
        确认重置
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
// ...实现脚本部分
</script>

<style scoped>
.reset-password-content {
  text-align: center;
  padding: 20px 0;
}
</style>
```

## API 服务实现

创建专门的API服务模块处理与后端的交互。

```typescript
// api/user.ts
import http from '@/utils/http';
import { SalesUser, UserQueryParams, PaginatedResponse } from '@/types/user';

export default {
  /**
   * 获取销售员用户列表
   */
  getUsers(params: UserQueryParams): Promise<PaginatedResponse<SalesUser>> {
    return http.get('/api/auth/users', { params });
  },
  
  /**
   * 添加销售员用户
   */
  addUser(data: { username: string; password: string }): Promise<SalesUser> {
    return http.post('/api/auth/users', { ...data, is_admin: false });
  },
  
  /**
   * 修改销售员密码
   */
  updateUserPassword(id: number, newPassword: string): Promise<any> {
    return http.patch(`/api/auth/users/${id}/password`, { new_password: newPassword });
  },
  
  /**
   * 更改销售员状态
   */
  updateUserStatus(id: number, status: string): Promise<any> {
    return http.patch(`/api/auth/users/${id}/status`, { status });
  },
  
  /**
   * 删除销售员
   */
  deleteUser(id: number): Promise<any> {
    return http.delete(`/api/auth/users/${id}`);
  },
  
  /**
   * 获取销售员关联店铺
   */
  getUserStores(id: number): Promise<any> {
    return http.get(`/api/auth/users/${id}/stores`);
  },
  
  /**
   * 批量重置密码
   */
  batchResetPassword(userIds: number[], defaultPassword: string = '123456'): Promise<any> {
    return http.post('/api/auth/users/batch/reset-password', {
      user_ids: userIds,
      default_password: defaultPassword
    });
  }
};
```

## 状态管理

使用Pinia进行状态管理，创建专门的store管理销售员用户数据。

```typescript
// stores/salesUser.ts
import { defineStore } from 'pinia';
import userApi from '@/api/user';
import { SalesUser, UserQueryParams, PaginatedResponse } from '@/types/user';

export const useSalesUserStore = defineStore('salesUser', {
  state: () => ({
    users: [] as SalesUser[],
    totalUsers: 0,
    loading: false,
    currentPage: 1,
    pageSize: 20,
    selectedUsers: [] as SalesUser[]
  }),
  
  actions: {
    async fetchUsers(params?: Partial<UserQueryParams>) {
      this.loading = true;
      try {
        const queryParams: UserQueryParams = {
          page: this.currentPage,
          page_size: this.pageSize,
          is_admin: false,
          ...params
        };
        
        const response = await userApi.getUsers(queryParams);
        this.users = response.items;
        this.totalUsers = response.total;
        return response;
      } catch (error) {
        console.error('Failed to fetch users:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async addUser(username: string, password: string) {
      try {
        const newUser = await userApi.addUser({ username, password });
        // 刷新用户列表
        await this.fetchUsers();
        return newUser;
      } catch (error) {
        console.error('Failed to add user:', error);
        throw error;
      }
    },
    
    async updateUserPassword(userId: number, newPassword: string) {
      try {
        const result = await userApi.updateUserPassword(userId, newPassword);
        return result;
      } catch (error) {
        console.error('Failed to update user password:', error);
        throw error;
      }
    },
    
    async updateUserStatus(userId: number, status: string) {
      try {
        const result = await userApi.updateUserStatus(userId, status);
        // 更新本地状态
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
          this.users[userIndex].status = status as any;
        }
        return result;
      } catch (error) {
        console.error('Failed to update user status:', error);
        throw error;
      }
    },
    
    async deleteUser(userId: number) {
      try {
        const result = await userApi.deleteUser(userId);
        // 从列表中移除用户
        this.users = this.users.filter(u => u.id !== userId);
        this.totalUsers--;
        return result;
      } catch (error) {
        console.error('Failed to delete user:', error);
        throw error;
      }
    },
    
    async batchResetPassword(userIds: number[]) {
      try {
        const result = await userApi.batchResetPassword(userIds);
        return result;
      } catch (error) {
        console.error('Failed to batch reset passwords:', error);
        throw error;
      }
    },
    
    setSelectedUsers(users: SalesUser[]) {
      this.selectedUsers = users;
    },
    
    setPage(page: number) {
      this.currentPage = page;
    },
    
    setPageSize(size: number) {
      this.pageSize = size;
    }
  }
});
```

## 表单验证规则

所有表单验证应遵循以下规则：

```typescript
// 添加用户表单验证规则
const addUserRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 20, message: '用户名长度应为5-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 30, message: '密码长度应为6-30个字符', trigger: 'blur' }
  ]
};

// 编辑用户表单验证规则
const editUserRules = {
  password: [
    { min: 6, max: 30, message: '密码长度应为6-30个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validatePasswordMatch, trigger: 'blur' }
  ]
};

// 密码确认验证函数
const validatePasswordMatch = (rule: any, value: string, callback: Function) => {
  if (form.password && value !== form.password) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};
```

## 响应式适配

页面应适配不同屏幕尺寸，确保在桌面端和平板设备上有良好的显示效果。

```css
/* 响应式样式 */
@media screen and (max-width: 1200px) {
  .el-table {
    /* 在较小屏幕上启用表格水平滚动 */
    width: 100%;
    overflow-x: auto;
  }
  
  .action-buttons {
    /* 调整操作按钮布局 */
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
  }
}

@media screen and (max-width: 768px) {
  .page-header {
    /* 在移动端调整标题和按钮的布局 */
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .action-buttons {
    width: 100%;
    flex-direction: row;
  }
  
  .action-buttons .el-button {
    flex: 1;
  }
}
```

## 业务逻辑说明

### 页面初始化流程

1. 页面加载时，自动调用fetchUsers获取销售员列表
2. 初始化时不应选中任何用户，批量重置密码按钮应处于禁用状态

### 添加用户流程

1. 点击"添加用户"按钮，打开添加用户弹窗
2. 填写用户名和密码（可选，默认为123456）
3. 点击"提交"按钮，验证表单并提交
4. 提交成功后显示成功提示，并刷新用户列表
5. 提交失败显示错误信息

### 编辑用户流程

1. 点击用户行的编辑图标，打开编辑用户弹窗
2. 用户名为只读状态，可以修改密码
3. 如果密码输入框不为空，则需要验证两次输入是否一致
4. 点击"提交"按钮，验证表单并提交
5. 提交成功后显示成功提示
6. 提交失败显示错误信息

### 删除用户流程

1. 点击用户行的删除图标，打开删除确认弹窗
2. 确认删除或取消操作
3. 确认删除后执行删除API调用
4. 删除成功后刷新用户列表，显示成功提示
5. 删除失败显示错误信息

### 状态管理流程

1. 切换用户状态开关时，弹出确认对话框
2. 用户确认后，执行状态更新API调用
3. 更新成功后，本地更新用户状态，显示成功提示
4. 更新失败时，恢复开关状态并显示错误信息

### 批量重置密码流程

1. 通过表格选择多个用户（使用复选框）
2. 点击"批量重置密码"按钮，打开确认对话框
3. 确认后执行批量重置密码API调用
4. 成功后显示成功提示，包含重置成功的用户数量
5. 失败时显示错误信息

## 错误处理

所有API调用应有适当的错误处理机制，遵循以下原则：

1. 网络错误或服务器错误：显示"网络错误，请稍后重试"
2. 业务逻辑错误：显示后端返回的具体错误信息
3. 权限错误：显示"您没有执行此操作的权限"并重定向到登录页
4. 表单验证错误：在相应字段下方显示具体错误提示

## 注意事项

1. 所有API调用过程中，应显示适当的加载状态
2. 所有操作完成后，应给用户明确的成功或失败反馈
3. 删除和状态变更等敏感操作，必须有确认步骤
4. 批量操作前应验证是否已选择用户
5. 页面应保存用户的分页和过滤设置，避免刷新后丢失
6. 用户权限检查：此页面仅管理员可访问，应在路由守卫中进行验证 