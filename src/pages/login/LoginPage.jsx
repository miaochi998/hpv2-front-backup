import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Row, Col, Typography, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginAsync, getUserInfoAsync } from '@/store/slices/authSlice';
import './LoginPage.css';

const { Title } = Typography;

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, error } = useSelector(state => state.auth);
  const [form] = Form.useForm();

  // 如果已经登录，直接跳转到仪表盘
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('LoginPage: 用户已登录，直接跳转到仪表盘', { user });
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  // 尝试从location state中获取之前的路径
  const from = location.state?.from?.pathname || '/dashboard';
  console.log('LoginPage: 当前页面信息', { 
    currentPath: location.pathname,
    fromPath: from,
    isAuthenticated,
    hasUser: !!user 
  });

  const handleSubmit = async (values) => {
    console.log('LoginPage: 开始登录流程', values);
    try {
      setLoading(true);
      // 登录获取token
      console.log('LoginPage: 调用登录API');
      const loginResult = await dispatch(loginAsync(values)).unwrap();
      console.log('LoginPage: 登录API响应', loginResult);
      
      if (loginResult?.token) {
        // 获取用户信息
        console.log('LoginPage: 获取用户信息');
        const userInfoResult = await dispatch(getUserInfoAsync()).unwrap();
        console.log('LoginPage: 用户信息响应', userInfoResult);
        
        if (userInfoResult) {
          message.success('登录成功');
          console.log('LoginPage: 登录成功，准备跳转到', from);
          // 登录成功后跳转到之前访问的页面或仪表盘
          navigate(from, { replace: true });
        } else {
          message.error('获取用户信息失败');
        }
      }
    } catch (error) {
      console.error('LoginPage: 登录失败:', error);
      message.error(error?.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Row justify="center" align="middle">
        <Col xs={22} sm={16} md={12} lg={8} xl={6}>
          <Card className="login-card">
            <div className="login-header">
              <Title level={2}>系统登录</Title>
              <Title level={5} type="secondary">欢迎回来，请登录您的账号</Title>
            </div>
            
            <Spin spinning={loading} tip="登录中...">
              <Form
                form={form}
                name="login"
                layout="vertical"
                initialValues={{ remember: true }}
                onFinish={handleSubmit}
                size="large"
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="用户名" 
                    autoComplete="username"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="密码"
                    autoComplete="current-password"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-btn"
                    block
                    loading={loading}
                  >
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default LoginPage; 
