import { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Spin } from 'antd';
import { useSelector } from 'react-redux';

const { Title, Paragraph } = Typography;

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);

  // 模拟加载数据
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Title level={2}>欢迎，{user?.name || '用户'}</Title>
      <Paragraph>帮你品牌货盘管理系统 - 仪表盘</Paragraph>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="系统公告" bordered={false}>
              <p>欢迎使用帮你品牌货盘管理系统</p>
              <p>系统目前处于开发阶段，更多功能即将上线</p>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="快速导航" bordered={false}>
              <p>点击左侧菜单可以快速访问各个功能</p>
              <p>如有问题请联系管理员</p>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Dashboard; 