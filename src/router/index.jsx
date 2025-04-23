import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Spin } from 'antd';
import PrivateRoute from '@/components/auth/PrivateRoute';

// 懒加载包装器
const lazyLoad = (Component) => (
  <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>}>
    <Component />
  </Suspense>
);

// 懒加载组件
const LoginPage = lazy(() => import('@/pages/login/LoginPageNew'));
const MainLayout = lazy(() => import('@/components/layout/MainLayout'));
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const Unauthorized = lazy(() => import('@/pages/Unauthorized'));
const DebugLogin = lazy(() => import('@/pages/login/DebugLogin'));

// 管理员页面
const BrandManagement = lazy(() => import('@/pages/admin/BrandManagement'));
const UserManagement = lazy(() => import('@/pages/admin/UserManagement'));
const ProductManagement = lazy(() => import('@/pages/admin/ProductManagement'));

// 销售员页面
const SellerProducts = lazy(() => import('@/pages/seller/PalletManagement'));
const ProfileManagement = lazy(() => import('@/pages/seller/ProfileManagement'));

// 创建路由
const router = createBrowserRouter([
  {
    path: '/login',
    element: lazyLoad(LoginPage),
  },
  {
    path: '/debug',
    element: lazyLoad(DebugLogin),
  },
  {
    path: '/unauthorized',
    element: lazyLoad(Unauthorized),
  },
  {
    path: '/',
    element: lazyLoad(MainLayout),
    children: [
      { 
        index: true, 
        element: <Navigate to="/dashboard" replace /> 
      },
      { 
        path: 'dashboard', 
        element: <PrivateRoute 
          element={lazyLoad(Dashboard)} 
          requiredRoles={[]} 
        />
      },
      // 管理员路由
      {
        path: 'admin',
        children: [
          { 
            path: 'brands', 
            element: <PrivateRoute 
              element={lazyLoad(BrandManagement)} 
              requiredRoles={['admin']} 
            />
          },
          { 
            path: 'users', 
            element: <PrivateRoute 
              element={lazyLoad(UserManagement)} 
              requiredRoles={['admin']} 
            />
          },
          { 
            path: 'products', 
            element: <PrivateRoute 
              element={lazyLoad(ProductManagement)} 
              requiredRoles={['admin']} 
            />
          },
        ],
      },
      // 销售员路由
      {
        path: 'seller',
        children: [
          { 
            path: 'products', 
            element: <PrivateRoute 
              element={lazyLoad(SellerProducts)} 
              requiredRoles={['seller']} 
            />
          },
          { 
            path: 'profile', 
            element: <PrivateRoute 
              element={lazyLoad(ProfileManagement)} 
              requiredRoles={['admin', 'seller']} 
            />
          },
        ],
      },
    ],
  },
  // 默认重定向
  {
    path: '*',
    element: <Navigate to="/" replace />
  },
]);

export default router; 