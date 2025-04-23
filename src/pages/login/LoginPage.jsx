import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Checkbox, message, Typography, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginAsync, clearError } from '../../store/slices/authSlice';
import styles from './LoginPage.module.css';

const { Title, Paragraph } = Typography;

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // 如果已登录，跳转到首页或之前尝试访问的页面
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // 处理错误信息
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // 表单提交
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await dispatch(loginAsync(values)).unwrap();
      message.success('登录成功');
    } catch (err) {
      console.error('登录失败:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* 左侧品牌展示区 */}
      <div className={styles.loginBanner}>
        <div className={styles.brandLogo}>
          <img src="/logo.svg" alt="BangNi Logo" />
        </div>
        <div className={styles.systemTitle}>
          <h1>帮你品牌货盘管理系统</h1>
          <p>河南省帮你家居用品有限公司</p>
        </div>
      </div>

      {/* 右侧登录表单区 */}
      <div className={styles.loginPanel}>
        <div className={styles.loginHeader}>
          <Title level={2}>用户登录</Title>
        </div>
        
        <Form
          form={form}
          name="login"
          className={styles.loginForm}
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined className={styles.iconPrefix} />} 
              placeholder="用户名" 
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined className={styles.iconPrefix} />}
              placeholder="密码"
            />
          </Form.Item>
          
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className={styles.loginButton}
              loading={submitting || loading}
              disabled={submitting || loading}
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
      </div>
      
      {/* 背景装饰 */}
      <div className={styles.backgroundDecoration1}></div>
      <div className={styles.backgroundDecoration2}></div>
    </div>
  );
};

export default LoginPage; 