import { useEffect } from 'react';
import { Layout, Avatar, Typography, Dropdown, Menu, Spin } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { getUserInfoAsync, logoutAsync } from '@/store/slices/authSlice';
import PrivateRoute from '@/components/auth/PrivateRoute';
import Sidebar from './Sidebar';
import styles from './MainLayout.module.css';

const { Header, Content } = Layout;
const { Title } = Typography;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  // 获取用户信息
  useEffect(() => {
    if (!user) {
      console.log('MainLayout: 用户信息未加载，尝试获取');
      dispatch(getUserInfoAsync());
    } else {
      console.log('MainLayout: 用户信息已加载', user);
    }
  }, [dispatch, user]);

  // 处理登出
  const handleLogout = () => {
    dispatch(logoutAsync()).then(() => {
      navigate('/login');
    });
  };

  // 用户菜单
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate(user?.is_admin ? '/admin/profile' : '/seller/profile')}>
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
    console.log('MainLayout: 显示加载中状态');
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  console.log('MainLayout: 正在渲染主布局', { currentPath: location.pathname });

  return (
    <Layout className={styles.mainLayout}>
      {/* 使用新的Sidebar组件 */}
      <Sidebar />
      
      <Layout className={styles.rightLayout}>
        {/* 头部 */}
        <Header className={styles.header}>
          <div className={styles.headerTitle}>
            <Title level={4} className={styles.pageTitle}>
              帮你品牌货盘管理系统
            </Title>
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
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 