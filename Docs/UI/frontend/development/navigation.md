# 导航组件开发规范

## 1. 组件概述

导航组件是整个货盘管理系统的核心导航结构，提供用户访问各功能模块的入口。导航栏根据用户角色（管理员或销售员）显示不同的菜单项，并支持两种显示模式：宽导航（图标+文字）和窄导航（仅图标）。

### 1.1 组件路径

- 代码路径：`src/components/layout/Sidebar`
- 引用路径：所有包含主布局的页面

### 1.2 功能特性

- 响应式布局，支持宽导航/窄导航切换
- 基于用户角色的动态菜单显示
- 当前路由项高亮显示
- 用户信息与登出功能
- 导航状态记忆功能

## 2. 组件结构

### 2.1 组件树

```
Sidebar
├── SidebarHeader           // 导航顶部组件
│   ├── Logo                // 系统Logo组件
│   └── SystemTitle         // 系统标题(宽导航模式)
├── SidebarMenu             // 导航菜单组件
│   ├── MenuGroup           // 菜单分组(可选)
│   └── MenuItem            // 菜单项组件
│       ├── MenuIcon        // 菜单图标
│       └── MenuText        // 菜单文本(宽导航模式)
├── SidebarFooter           // 导航底部组件
│   ├── UserInfo            // 用户信息组件
│   │   ├── Avatar          // 用户头像
│   │   └── UserName        // 用户名(宽导航模式)
│   ├── ProfileLink         // 个人资料链接(宽导航模式)
│   └── LogoutButton        // 退出登录按钮
└── SidebarToggle           // 导航展开/收起切换按钮
```

### 2.2 组件职责

#### Sidebar（主导航组件）
- 控制整体导航样式与状态
- 根据用户角色与权限筛选显示菜单项
- 管理导航展开/收起状态

#### SidebarHeader（导航顶部组件）
- 展示系统Logo和系统名称
- 在窄导航模式下仅显示简化Logo

#### SidebarMenu（导航菜单组件）
- 渲染菜单项列表
- 处理路由跳转与当前路由高亮

#### MenuItem（菜单项组件）
- 展示单个菜单项的图标和文字
- 处理菜单项点击事件
- 展示菜单项激活状态

#### SidebarFooter（导航底部组件）
- 展示用户信息与头像
- 提供个人资料编辑入口
- 提供退出登录功能

#### SidebarToggle（导航切换组件）
- 控制导航的展开/收起状态切换
- 记忆用户偏好的导航展示状态

## 3. 数据模型与状态管理

### 3.1 数据模型

```typescript
// 导航菜单项数据模型
interface MenuItem {
  key: string;             // 菜单项唯一键值
  title: string;           // 菜单项显示文本
  icon: React.ReactNode;   // 菜单项图标
  path: string;            // 路由路径
  roles: UserRole[];       // 可访问的用户角色
  children?: MenuItem[];   // 子菜单项(可选)
}

// 用户角色枚举
enum UserRole {
  ADMIN = 'ADMIN',         // 管理员(is_admin=true)
  SELLER = 'SELLER'        // 销售员(is_admin=false)
}

// 用户数据模型
interface User {
  id: number;              // 用户ID
  username: string;        // 用户名
  name: string;            // 姓名
  phone: string;           // 电话
  email: string;           // 邮箱
  status: string;          // 状态(ACTIVE/INACTIVE)
  is_admin: boolean;       // 是否管理员
  company: string;         // 所属公司
  avatar: string;          // 头像URL
  wechat_qrcode: string;   // 微信二维码URL
  created_by: number;      // 创建人ID
  last_login_time: string; // 最后登录时间
  created_at: string;      // 创建时间
  updated_at: string;      // 更新时间
}

// 导航状态数据模型
interface SidebarState {
  collapsed: boolean;      // 是否收起状态
  theme: 'light' | 'dark'; // 主题色
  currentPath: string;     // 当前激活路径
}
```

### 3.2 状态管理

使用React Context和useReducer管理导航状态：

```typescript
// 导航上下文初始状态
const initialState: SidebarState = {
  collapsed: false,        // 默认展开
  theme: 'dark',           // 默认深色主题
  currentPath: '/'         // 默认路径
};

// 导航reducer
function sidebarReducer(state: SidebarState, action) {
  switch (action.type) {
    case 'TOGGLE_COLLAPSED':
      // 保存用户偏好到LocalStorage
      localStorage.setItem('sidebar_collapsed', String(!state.collapsed));
      return { ...state, collapsed: !state.collapsed };
    case 'SET_CURRENT_PATH':
      return { ...state, currentPath: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    default:
      return state;
  }
}

// 使用React Context共享导航状态
const SidebarContext = createContext<{
  state: SidebarState;
  dispatch: React.Dispatch<any>;
}>({
  state: initialState,
  dispatch: () => null
});
```

## 4. 导航菜单配置

### 4.1 菜单配置文件

```typescript
// config/menuConfig.ts
import {
  DashboardOutlined,
  AppstoreOutlined,
  WindowsOutlined,
  FileOutlined,
  TableOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  SearchOutlined,
  LineChartOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { UserRole } from '../types/user';

export const menuItems = [
  // 管理员与销售员共有菜单
  {
    key: 'dashboard',
    title: '个人仪表盘',
    icon: <DashboardOutlined />,
    path: '/dashboard',
    roles: [UserRole.ADMIN, UserRole.SELLER]
  },
  
  // 管理员特有菜单
  {
    key: 'allPallets',
    title: '总货盘管理',
    icon: <AppstoreOutlined />,
    path: '/admin/pallets',
    roles: [UserRole.ADMIN]
  },
  {
    key: 'salesPallets',
    title: '查看销售货盘',
    icon: <WindowsOutlined />,
    path: '/admin/sales-pallets',
    roles: [UserRole.ADMIN]
  },
  {
    key: 'brands',
    title: '品牌管理',
    icon: <FileOutlined />,
    path: '/admin/brands',
    roles: [UserRole.ADMIN]
  },
  {
    key: 'users',
    title: '用户管理',
    icon: <TableOutlined />,
    path: '/admin/users',
    roles: [UserRole.ADMIN]
  },
  
  // 销售员特有菜单
  {
    key: 'myPallets',
    title: '货盘管理',
    icon: <AppstoreOutlined />,
    path: '/seller/pallets',
    roles: [UserRole.SELLER]
  },
  {
    key: 'companyPallets',
    title: '查看公司货盘',
    icon: <WindowsOutlined />,
    path: '/seller/company-pallets',
    roles: [UserRole.SELLER]
  },
  
  // 共有菜单
  {
    key: 'recyclebin',
    title: '货盘回收站',
    icon: <EnvironmentOutlined />,
    path: '/recyclebin',
    roles: [UserRole.ADMIN, UserRole.SELLER]
  },
  
  // 其他菜单项...
];
```

### 4.2 菜单过滤逻辑

根据当前用户角色过滤显示菜单：

```typescript
// 过滤当前用户有权访问的菜单项
const getAuthorizedMenuItems = (role: UserRole) => {
  return menuItems.filter(item => item.roles.includes(role));
};
```

## 5. UI组件实现

### 5.1 Sidebar 主组件

```tsx
import React, { useEffect, useReducer } from 'react';
import { Layout } from 'antd';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import SidebarHeader from './SidebarHeader';
import SidebarMenu from './SidebarMenu';
import SidebarFooter from './SidebarFooter';
import SidebarToggle from './SidebarToggle';
import { useAuth } from 'hooks/useAuth';
import { SidebarContext, sidebarReducer, initialState } from './SidebarContext';

const { Sider } = Layout;

const StyledSider = styled(Sider)`
  height: 100vh;
  position: fixed;
  left: 0;
  z-index: 10;
  
  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }
  }
`;

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [state, dispatch] = useReducer(sidebarReducer, initialState);
  
  // 从localStorage加载用户偏好的导航状态
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebar_collapsed');
    if (savedCollapsed !== null) {
      dispatch({
        type: 'TOGGLE_COLLAPSED',
        payload: savedCollapsed === 'true'
      });
    }
  }, []);
  
  // 监听路由变化，更新当前激活路径
  useEffect(() => {
    dispatch({
      type: 'SET_CURRENT_PATH',
      payload: location.pathname
    });
  }, [location.pathname]);
  
  return (
    <SidebarContext.Provider value={{ state, dispatch }}>
      <StyledSider
        theme={state.theme}
        trigger={null}
        collapsible
        collapsed={state.collapsed}
        width={240}
        collapsedWidth={64}
      >
        <SidebarHeader />
        
        <div className="sidebar-content">
          <SidebarMenu userRole={user?.role} />
        </div>
        
        <SidebarFooter />
        
        <SidebarToggle />
      </StyledSider>
    </SidebarContext.Provider>
  );
};

export default Sidebar;
```

### 5.2 SidebarMenu 组件

```tsx
import React, { useContext } from 'react';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SidebarContext } from './SidebarContext';
import { UserRole } from 'types/user';
import { getAuthorizedMenuItems } from 'config/menuConfig';

interface SidebarMenuProps {
  userRole: UserRole;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ userRole }) => {
  const { state } = useContext(SidebarContext);
  const navigate = useNavigate();
  
  // 获取当前用户有权访问的菜单项
  const authorizedMenuItems = getAuthorizedMenuItems(userRole);
  
  // 处理菜单点击事件
  const handleMenuClick = ({ key }) => {
    const selectedItem = authorizedMenuItems.find(item => item.key === key);
    if (selectedItem) {
      navigate(selectedItem.path);
    }
  };
  
  // 查找当前路径对应的菜单项key
  const findSelectedKey = () => {
    const currentItem = authorizedMenuItems.find(
      item => state.currentPath.startsWith(item.path)
    );
    return currentItem ? [currentItem.key] : [];
  };
  
  return (
    <Menu
      theme={state.theme}
      mode="inline"
      selectedKeys={findSelectedKey()}
      onClick={handleMenuClick}
    >
      {authorizedMenuItems.map(item => (
        <Menu.Item key={item.key} icon={item.icon}>
          {item.title}
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default SidebarMenu;
```

### 5.3 SidebarToggle 组件

```tsx
import React, { useContext } from 'react';
import { Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { SidebarContext } from './SidebarContext';

const ToggleButton = styled(Button)`
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  color: rgba(255, 255, 255, 0.65);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.85);
  }
`;

const SidebarToggle: React.FC = () => {
  const { state, dispatch } = useContext(SidebarContext);
  
  const toggleCollapsed = () => {
    dispatch({ type: 'TOGGLE_COLLAPSED' });
  };
  
  return (
    <ToggleButton
      type="text"
      onClick={toggleCollapsed}
      aria-label={state.collapsed ? '展开菜单' : '收起菜单'}
      title={state.collapsed ? '展开菜单' : '收起菜单'}
    >
      {state.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    </ToggleButton>
  );
};

export default SidebarToggle;
```

## 6. 交互逻辑实现

### 6.1 宽窄导航切换

```tsx
// 导航状态切换
const handleToggle = () => {
  dispatch({ type: 'TOGGLE_COLLAPSED' });
  
  // 通知内容区域调整
  if (onSidebarToggle) {
    onSidebarToggle(!state.collapsed);
  }
};

// 使用媒体查询自动切换
useEffect(() => {
  const mediaQuery = window.matchMedia('(max-width: 992px)');
  
  const handleMediaChange = (e) => {
    dispatch({ 
      type: 'TOGGLE_COLLAPSED', 
      payload: e.matches 
    });
  };
  
  // 初始检查
  handleMediaChange(mediaQuery);
  
  // 监听变化
  mediaQuery.addEventListener('change', handleMediaChange);
  
  return () => {
    mediaQuery.removeEventListener('change', handleMediaChange);
  };
}, []);
```

### 6.2 菜单项高亮处理

```tsx
// 当前路由高亮处理
const getSelectedKeys = () => {
  // 精确匹配当前路径
  const exactMatch = menuItems.find(item => item.path === location.pathname);
  if (exactMatch) {
    return [exactMatch.key];
  }
  
  // 前缀匹配（处理子路由）
  const prefixMatch = menuItems.find(item => 
    location.pathname.startsWith(item.path) && item.path !== '/'
  );
  if (prefixMatch) {
    return [prefixMatch.key];
  }
  
  // 默认返回首页
  return ['dashboard'];
};
```

### 6.3 用户登出处理

```tsx
// 用户登出逻辑
const handleLogout = () => {
  Modal.confirm({
    title: '确定要退出登录吗?',
    content: '退出后需要重新登录才能使用系统',
    okText: '确定退出',
    cancelText: '取消',
    onOk: async () => {
      try {
        await logout(); // 调用登出API
        navigate('/login');
      } catch (error) {
        message.error('退出失败，请重试');
      }
    }
  });
};
```

## 7. 测试策略

### 7.1 单元测试

```typescript
// Sidebar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from 'contexts/AuthContext';
import Sidebar from './Sidebar';

// 模拟用户认证上下文
jest.mock('hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, name: '测试用户', role: 'ADMIN' }
  })
}));

describe('Sidebar 组件', () => {
  test('初始渲染管理员菜单', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Sidebar />
        </AuthProvider>
      </MemoryRouter>
    );
    
    // 验证管理员菜单项存在
    expect(screen.getByText('品牌管理')).toBeInTheDocument();
    expect(screen.getByText('用户管理')).toBeInTheDocument();
  });
  
  test('折叠切换功能', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Sidebar />
        </AuthProvider>
      </MemoryRouter>
    );
    
    // 初始展开状态
    expect(screen.getByText('帮你品牌货盘管理系统')).toBeInTheDocument();
    
    // 点击折叠按钮
    fireEvent.click(screen.getByLabelText('收起菜单'));
    
    // 验证系统标题已隐藏
    expect(screen.queryByText('帮你品牌货盘管理系统')).not.toBeInTheDocument();
  });
});
```

### 7.2 集成测试

```typescript
// 测试导航路由跳转
test('菜单项点击导航功能', async () => {
  const mockNavigate = jest.fn();
  
  // 模拟react-router的useNavigate
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
  }));
  
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <AuthProvider>
        <Sidebar />
      </AuthProvider>
    </MemoryRouter>
  );
  
  // 点击"品牌管理"菜单项
  fireEvent.click(screen.getByText('品牌管理'));
  
  // 验证导航函数被调用
  expect(mockNavigate).toHaveBeenCalledWith('/admin/brands');
});
```

## 8. 性能优化

### 8.1 重渲染优化

```tsx
// 使用React.memo减少不必要的重渲染
const MenuItem = React.memo(({ icon, title, onClick, selected }) => {
  return (
    <div 
      className={`menu-item ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <span className="icon">{icon}</span>
      <span className="title">{title}</span>
    </div>
  );
});

// 使用useCallback优化处理函数
const handleMenuClick = useCallback((path) => {
  navigate(path);
}, [navigate]);
```

### 8.2 动态导入菜单图标

```tsx
// 懒加载图标组件
const IconMap = {
  dashboard: lazy(() => import('@ant-design/icons/DashboardOutlined')),
  brands: lazy(() => import('@ant-design/icons/FileOutlined')),
  // 其他图标...
};

// 优化菜单图标渲染
const renderIcon = (iconName) => {
  const IconComponent = IconMap[iconName];
  return IconComponent ? (
    <Suspense fallback={<div className="icon-placeholder" />}>
      <IconComponent />
    </Suspense>
  ) : null;
};
```

## 9. 兼容性要求

### 9.1 浏览器兼容性

导航组件应支持以下浏览器的最新两个主要版本：

| 浏览器 | 最低版本要求 |
|-------|------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Opera | 76+ |

不需要支持Internet Explorer。

### 9.2 设备兼容性

导航组件应在以下设备上正常工作：

1. **桌面端**：
   - 默认为展开状态（宽导航）
   - 可手动切换至窄导航

2. **平板端**：
   - 中等大小平板（768px-1024px）默认为窄导航
   - 大尺寸平板（>1024px）默认为宽导航

3. **移动端**：
   - 默认为抽屉模式，点击汉堡菜单图标显示
   - 菜单项使用更大的点击区域

```css
/* 响应式样式处理 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 1000;
  }
  
  .sidebar.visible {
    transform: translateX(0);
  }
  
  .sidebar-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: none;
  }
  
  .sidebar-backdrop.visible {
    display: block;
  }
}
```

## 10. 设计规范参考

### 10.1 颜色系统

导航组件使用公司统一设计系统中的颜色变量：

| 颜色用途 | 变量名 | 十六进制值 |
|---------|-------|-----------|
| 导航背景色 | --sidebar-bg | #2D2D2D |
| 导航文字色 | --sidebar-text | #FFFFFF |
| 选中项背景 | --sidebar-selected-bg | #177DDC |
| 选中项文字 | --sidebar-selected-text | #FFFFFF |
| 悬停项背景 | --sidebar-hover-bg | #454545 |
| 分割线颜色 | --sidebar-divider | #454545 |

### 10.2 排版规范

| 元素 | 字体大小 | 行高 | 字重 |
|-----|---------|-----|-----|
| 系统标题 | 18px | 24px | 600 |
| 菜单项文字 | 14px | 22px | 400 |
| 用户名 | 14px | 22px | 500 |

### 10.3 间距规范

| 元素 | 间距 |
|-----|------|
| 菜单项内边距 | 16px 24px |
| 菜单项间距 | 4px |
| 图标与文字间距 | 10px |
| 导航顶部边距 | 24px |
| 导航底部边距 | 24px |

### 10.4 图标规范

- 菜单图标尺寸：16px × 16px
- 切换按钮图标：14px × 14px
- 图标颜色：与文字颜色一致
- 统一使用Ant Design图标库 