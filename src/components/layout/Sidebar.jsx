import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Avatar, Typography, Tooltip } from 'antd';
import { 
  DashboardOutlined, 
  AppstoreOutlined, 
  UserOutlined, 
  TagOutlined, 
  LogoutOutlined,
  WindowsOutlined,
  EnvironmentOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { logoutAsync } from '../../store/slices/authSlice';
import styles from './Sidebar.module.css';

const { Sider } = Layout;
const { Title, Text } = Typography;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  // 获取本地存储的导航状态
  const savedCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
  const [collapsed, setCollapsed] = useState(savedCollapsed);
  
  // 判断当前用户角色
  const isAdmin = user?.is_admin;
  
  // 切换导航展开/收起
  const toggleCollapsed = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    localStorage.setItem('sidebar_collapsed', String(newCollapsed));
  };
  
  // 处理登出
  const handleLogout = () => {
    dispatch(logoutAsync()).then(() => {
      navigate('/login');
    });
  };
  
  // 菜单点击处理
  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
    } else {
      navigate(key);
    }
  };

  // 构建菜单项
  const getMenuItems = () => {
    // 基础菜单(所有用户都有)
    const baseMenuItems = [
      {
        key: '/protected/dashboard',
        icon: <DashboardOutlined />,
        label: '仪表盘'
      }
    ];
    
    // 管理员菜单
    const adminMenuItems = isAdmin ? [
      {
        key: '/protected/admin/products',
        icon: <AppstoreOutlined />,
        label: '总货盘管理'
      },
      {
        key: '/protected/admin/sales-pallets',
        icon: <WindowsOutlined />,
        label: '查看销售货盘'
      },
      {
        key: '/protected/admin/brands',
        icon: <TagOutlined />,
        label: '品牌管理'
      },
      {
        key: '/protected/admin/users',
        icon: <UserOutlined />,
        label: '用户管理'
      }
    ] : [];
    
    // 销售员菜单
    const sellerMenuItems = !isAdmin ? [
      {
        key: '/protected/seller/products',
        icon: <AppstoreOutlined />,
        label: '货盘管理'
      },
      {
        key: '/protected/seller/company-pallets',
        icon: <WindowsOutlined />,
        label: '查看公司货盘'
      }
    ] : [];
    
    // 公共菜单(位于底部)
    const commonMenuItems = [
      {
        key: '/protected/recyclebin',
        icon: <EnvironmentOutlined />,
        label: '货盘回收站'
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录'
      }
    ];
    
    return [...baseMenuItems, ...adminMenuItems, ...sellerMenuItems, ...commonMenuItems];
  };
  
  return (
    <Sider
      width={200}
      collapsible
      collapsed={collapsed}
      trigger={null}
      className={styles.sidebar}
      theme="dark"
    >
      {/* 导航顶部 */}
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          {collapsed ? (
            <span className={styles.collapsedLogo}>帮</span>
          ) : (
            <Title level={4} className={styles.logoTitle}>
              帮你品牌货盘
            </Title>
          )}
        </div>
      </div>
      
      {/* 导航菜单 */}
      <div className={styles.sidebarMenu}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={getMenuItems()}
          onClick={handleMenuClick}
        />
      </div>
      
      {/* 导航底部 */}
      <div className={styles.sidebarFooter}>
        <div className={styles.userInfo}>
          <Avatar icon={<UserOutlined />} size="small" className={styles.avatar} />
          {!collapsed && (
            <Text className={styles.userName}>{user?.name || '用户'}</Text>
          )}
        </div>
        
        <div className={styles.toggleButton} onClick={toggleCollapsed}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar; 