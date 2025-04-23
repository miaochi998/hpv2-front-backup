import { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Avatar, Typography, Spin } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  TagOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { getUserInfoAsync, logoutAsync } from '../../store/slices/authSlice';
import PrivateRoute from '../auth/PrivateRoute';
import styles from './MainLayout.module.css';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [collapsed, setCollapsed] = useState(false);

  // 获取用户信息
  useEffect(() => {
    if (!user) {
      dispatch(getUserInfoAsync());
    }
  }, [dispatch, user]);

  // 判断当前用户角色
  const isAdmin = user?.is_admin;

  // 菜单项配置
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    // 管理员菜单
    ...(isAdmin
      ? [
          {
            key: '/admin/brands',
            icon: <TagOutlined />,
            label: '品牌管理',
          },
          {
            key: '/admin/users',
            icon: <UserOutlined />,
            label: '用户管理',
          },
          {
            key: '/admin/products',
            icon: <ShoppingOutlined />,
            label: '公司货盘',
          },
        ]
      : [
          // 销售员菜单
          {
            key: '/seller/products',
            icon: <ShoppingOutlined />,
            label: '我的货盘',
          },
          {
            key: '/seller/profile',
            icon: <UserOutlined />,
            label: '个人信息',
          },
        ]),
  ];

  // 处理菜单点击
  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  // 处理登出
  const handleLogout = () => {
    dispatch(logoutAsync()).then(() => {
      navigate('/login');
    });
  };

  // 用户菜单
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate('/seller/profile')}>
        个人信息
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  // 如果正在加载，显示加载中
  if (loading && !user) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout className={styles.mainLayout}>
      {/* 侧边栏 */}
      <Sider 
        width={200} 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        breakpoint="lg"
        theme="dark"
        className={styles.sider}
      >
        <div className={styles.logo}>
          <Title level={4} className={styles.logoTitle}>
            {collapsed ? 'HP' : '货盘管理系统'}
          </Title>
        </div>
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[location.pathname]} 
          items={menuItems} 
          onClick={handleMenuClick}
          className={styles.siderMenu}
        />
      </Sider>
      <Layout>
        {/* 头部 */}
        <Header className={styles.header}>
          <div className={styles.headerToggle}>
            {collapsed ? (
              <MenuUnfoldOutlined onClick={() => setCollapsed(false)} className={styles.trigger} />
            ) : (
              <MenuFoldOutlined onClick={() => setCollapsed(true)} className={styles.trigger} />
            )}
          </div>
          <div className={styles.headerRight}>
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div className={styles.userInfo}>
                <Avatar icon={<UserOutlined />} className={styles.avatar} />
                <span className={styles.username}>{user?.name || '用户'}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        {/* 内容区 */}
        <Content className={styles.content}>
          <PrivateRoute 
            element={<Outlet />} 
            requiredRoles={location.pathname.startsWith('/admin') ? ['admin'] : []}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 