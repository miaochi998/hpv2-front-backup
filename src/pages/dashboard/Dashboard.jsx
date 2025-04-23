import { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Spin, Statistic, Button, Table } from 'antd';
import { useSelector } from 'react-redux';
import { 
  ShoppingOutlined, 
  UserOutlined, 
  AppstoreOutlined, 
  TagOutlined,
  FileTextOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import styles from './Dashboard.module.css';

const { Title, Paragraph } = Typography;

// 管理员仪表盘组件
const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  
  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 模拟统计数据
  const statistics = [
    { 
      title: '产品总数', 
      value: 3526, 
      icon: <ShoppingOutlined />, 
      color: '#1890ff' 
    },
    { 
      title: '品牌总数', 
      value: 22, 
      icon: <TagOutlined />, 
      color: '#52c41a' 
    },
    { 
      title: '管理员总数', 
      value: 5, 
      icon: <UserOutlined />, 
      color: '#722ed1' 
    },
    { 
      title: '用户总数', 
      value: 5, 
      icon: <UserOutlined />, 
      color: '#faad14' 
    }
  ];
  
  // 模拟最近活动数据
  const recentActivities = [
    { id: 1, user: '张弛', action: '添加了新品牌', time: '2025-03-26 09:30' },
    { id: 2, user: '王磊', action: '更新了产品信息', time: '2025-03-25 15:45' },
    { id: 3, user: '李明', action: '删除了过期产品', time: '2025-03-25 11:20' },
    { id: 4, user: '赵阳', action: '添加了新产品', time: '2025-03-24 16:30' }
  ];
  
  // 活动表格列配置
  const columns = [
    { title: '用户', dataIndex: 'user', key: 'user' },
    { title: '操作', dataIndex: 'action', key: 'action' },
    { title: '时间', dataIndex: 'time', key: 'time' }
  ];
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }
  
  return (
    <div className={styles.dashboard}>
      <Title level={2}>管理员仪表盘</Title>
      <Paragraph>系统概览和关键指标</Paragraph>
      
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className={styles.statisticsRow}>
        {statistics.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card className={styles.statisticCard}>
              <Statistic 
                title={stat.title}
                value={stat.value}
                prefix={<span style={{ color: stat.color }}>{stat.icon}</span>}
              />
            </Card>
          </Col>
        ))}
      </Row>
      
      {/* 内容区域 */}
      <Row gutter={[16, 16]} className={styles.contentRow}>
        {/* 最近活动 */}
        <Col xs={24} md={16}>
          <Card title="最近活动" className={styles.contentCard}>
            <Table 
              dataSource={recentActivities}
              columns={columns}
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
        
        {/* 快速操作 */}
        <Col xs={24} md={8}>
          <Card title="快速操作" className={styles.contentCard}>
            <div className={styles.quickActions}>
              <Button type="primary" icon={<AppstoreOutlined />} block>
                查看货盘管理
              </Button>
              <Button icon={<TagOutlined />} block className={styles.actionButton}>
                品牌管理
              </Button>
              <Button icon={<UserOutlined />} block className={styles.actionButton}>
                用户管理
              </Button>
              <Button icon={<FileTextOutlined />} block className={styles.actionButton}>
                查看系统日志
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* 公告区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="系统公告" className={styles.contentCard}>
            <p>欢迎使用帮你品牌货盘管理系统</p>
            <p>系统目前处于开发阶段，更多功能即将上线</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// 销售员仪表盘组件
const SellerDashboard = () => {
  const [loading, setLoading] = useState(true);
  
  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 模拟统计数据
  const statistics = [
    { 
      title: '我的产品', 
      value: 26, 
      icon: <ShoppingOutlined />, 
      color: '#1890ff' 
    },
    { 
      title: '回收站产品', 
      value: 3, 
      icon: <ShoppingCartOutlined />, 
      color: '#ff4d4f' 
    }
  ];
  
  // 模拟最近产品数据
  const recentProducts = [
    { id: 1, name: '品牌手表', brand: 'Rolex', updateTime: '2025-03-26' },
    { id: 2, name: '智能手机', brand: 'Apple', updateTime: '2025-03-25' },
    { id: 3, name: '蓝牙耳机', brand: 'Sony', updateTime: '2025-03-24' },
    { id: 4, name: '笔记本电脑', brand: 'Dell', updateTime: '2025-03-23' },
  ];
  
  // 产品表格列配置
  const columns = [
    { title: '产品名称', dataIndex: 'name', key: 'name' },
    { title: '品牌', dataIndex: 'brand', key: 'brand' },
    { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime' },
    { 
      title: '操作', 
      key: 'actions',
      render: () => (
        <Button type="link" size="small">查看</Button>
      )
    }
  ];
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }
  
  return (
    <div className={styles.dashboard}>
      <Title level={2}>销售员仪表盘</Title>
      <Paragraph>我的货盘概览</Paragraph>
      
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className={styles.statisticsRow}>
        {statistics.map((stat, index) => (
          <Col xs={24} sm={12} key={index}>
            <Card className={styles.statisticCard}>
              <Statistic 
                title={stat.title}
                value={stat.value}
                prefix={<span style={{ color: stat.color }}>{stat.icon}</span>}
              />
            </Card>
          </Col>
        ))}
      </Row>
      
      {/* 内容区域 */}
      <Row gutter={[16, 16]} className={styles.contentRow}>
        {/* 最近产品 */}
        <Col xs={24} md={16}>
          <Card title="最近产品" className={styles.contentCard}>
            <Table 
              dataSource={recentProducts}
              columns={columns}
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
        
        {/* 快速操作 */}
        <Col xs={24} md={8}>
          <Card title="快速操作" className={styles.contentCard}>
            <div className={styles.quickActions}>
              <Button type="primary" icon={<AppstoreOutlined />} block>
                添加新产品
              </Button>
              <Button icon={<ShoppingCartOutlined />} block className={styles.actionButton}>
                查看回收站
              </Button>
              <Button icon={<FileTextOutlined />} block className={styles.actionButton}>
                查看公司货盘
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* 公告区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="系统公告" className={styles.contentCard}>
            <p>欢迎使用帮你品牌货盘管理系统</p>
            <p>系统目前处于开发阶段，更多功能即将上线</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// 主仪表盘组件 - 根据用户角色渲染不同仪表盘
const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [debugMode, setDebugMode] = useState(false);
  
  // 检查紧急调试模式
  useEffect(() => {
    const isDebugMode = localStorage.getItem('debug_auth') === 'true';
    console.log('Dashboard: 正在检查调试模式', isDebugMode);
    setDebugMode(isDebugMode);
  }, []);
  
  // 使用调试模式或根据用户角色决定显示哪个仪表盘
  const isAdmin = debugMode || user?.is_admin;
  
  console.log('Dashboard: 渲染仪表盘', { 
    debugMode, 
    hasUser: !!user, 
    isAdmin,
    userInfo: user
  });

  if (!user && !debugMode) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }
  
  return isAdmin ? <AdminDashboard /> : <SellerDashboard />;
};

export default Dashboard; 