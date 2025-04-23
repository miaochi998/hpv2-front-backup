import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Typography, Spin, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginAsync, getUserInfoAsync, debugLogin } from '@/store/slices/authSlice';

const { Title } = Typography;

// 内联样式，避免CSS冲突
const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    boxSizing: 'border-box',
    position: 'absolute',
    top: 0,
    left: 0
  },
  cardWrapper: {
    width: '100%',
    maxWidth: '400px'
  },
  card: {
    borderRadius: '8px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    background: 'white',
    width: '100%'
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px'
  },
  form: {
    width: '100%'
  },
  formItem: {
    marginBottom: '16px'
  },
  button: {
    height: '45px',
    fontSize: '16px',
    width: '100%',
    marginTop: '8px'
  },
  input: {
    height: '45px'
  },
  debug: {
    marginTop: '16px',
    textAlign: 'center',
    color: '#999'
  }
};

function LoginPageNew() {
  const [loading, setLoading] = useState(false);
  const [debugMode, setDebugMode] = useState(localStorage.getItem('debug_auth') === 'true');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, error } = useSelector(state => state.auth);
  const [form] = Form.useForm();

  // 如果已经登录，直接跳转到仪表盘
  useEffect(() => {
    console.log('LoginPage: 检查认证状态', { isAuthenticated, user });
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

  // 处理调试模式切换
  const handleDebugModeChange = (e) => {
    const checked = e.target.checked;
    setDebugMode(checked);
    if (checked) {
      localStorage.setItem('debug_auth', 'true');
    } else {
      localStorage.removeItem('debug_auth');
    }
  };

  // 启用紧急调试登录
  const handleEmergencyLogin = () => {
    console.log('LoginPage: 启用紧急调试登录');
    localStorage.setItem('debug_auth', 'true');
    setDebugMode(true);
    
    // 直接使用调试数据登录
    dispatch(debugLogin({
      token: 'debug_token_123456',
      user_info: {
        id: 1,
        username: 'admin',
        name: '调试模式管理员',
        is_admin: true,
        email: 'admin@example.com',
        avatar: null
      }
    }));
    
    message.success('已启用紧急调试模式登录');
    navigate('/dashboard');
  };

  const handleSubmit = async (values) => {
    console.log('LoginPage: 开始登录流程', values);
    try {
      setLoading(true);
      // 清除localStorage中可能存在的旧数据
      localStorage.removeItem('auth_token');
      
      // 登录获取token
      console.log('LoginPage: 调用登录API');
      const loginResult = await dispatch(loginAsync(values)).unwrap();
      console.log('LoginPage: 登录API响应', loginResult);
      
      if (loginResult?.token) {
        // 检查token是否成功保存到localStorage
        const savedToken = localStorage.getItem('auth_token');
        console.log('LoginPage: 保存的token检查', { 
          hasToken: !!savedToken,
          tokenLength: savedToken?.length
        });
        
        // 获取用户信息
        console.log('LoginPage: 获取用户信息');
        try {
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
        } catch (userInfoError) {
          console.error('LoginPage: 获取用户信息失败:', userInfoError);
          message.error(userInfoError?.message || '获取用户信息失败，但您已登录');
          // 尽管获取用户信息失败，但已登录，仍然可以跳转
          navigate(from, { replace: true });
        }
      } else {
        message.error('登录响应缺少token');
      }
    } catch (error) {
      console.error('LoginPage: 登录失败:', error);
      // 详细记录错误信息以便调试
      if (error.response) {
        console.error('LoginPage: 请求有响应但状态码不正确:', {
          status: error.response.status,
          data: error.response.data
        });
      } else if (error.request) {
        console.error('LoginPage: 请求已发送但没有收到响应:', error.request);
      } else {
        console.error('LoginPage: 请求配置出错:', error.message);
      }
      message.error(error?.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.cardWrapper}>
        <div style={styles.card}>
          <div style={styles.header}>
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
              style={styles.form}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
                style={styles.formItem}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="用户名" 
                  autoComplete="username"
                  style={styles.input}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
                style={styles.formItem}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="密码"
                  autoComplete="current-password"
                  style={styles.input}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={styles.button}
                  loading={loading}
                >
                  登录
                </Button>
              </Form.Item>
              
              <Form.Item>
                <Checkbox 
                  checked={debugMode} 
                  onChange={handleDebugModeChange}
                >
                  调试模式
                </Checkbox>
              </Form.Item>
            </Form>
            
            {/* 开发环境显示紧急登录选项 */}
            {import.meta.env.DEV && (
              <div style={styles.debug}>
                <Button type="link" onClick={handleEmergencyLogin}>
                  紧急调试登录
                </Button>
                <p style={{ fontSize: '12px', color: '#999' }}>
                  开发环境专用，点击后自动以管理员身份登录
                </p>
              </div>
            )}
          </Spin>
        </div>
      </div>
    </div>
  );
}

export default LoginPageNew; 
