import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfoAsync } from './store/slices/authSlice';
import router from './router';
import './App.css';

// 根组件
const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  // 应用启动时，如果已认证但没有用户信息，尝试获取用户信息
  useEffect(() => {
    if (isAuthenticated && !user) {
      console.log('应用启动: 检测到认证状态，自动获取用户信息');
      dispatch(getUserInfoAsync());
    }
  }, [dispatch, isAuthenticated, user]);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
