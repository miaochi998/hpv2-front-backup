import React from 'react';
import { Typography } from 'antd';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;

const ProductManagement = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const isAdmin = user?.is_admin;
  
  // 如果未认证，返回null（让路由系统处理重定向）
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>{isAdmin ? '公司总货盘管理' : '我的货盘管理'}</Title>
      <Text type="secondary">货盘管理页面开发中...</Text>
    </div>
  );
};

export default ProductManagement; 