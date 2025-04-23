import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Spin } from 'antd';

// 懒加载包装器
const lazyLoad = (Component) => (
  <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>}>
    <Component />
  </Suspense>
);

// 懒加载组件
const LoginPage = lazy(() => import('../pages/login/LoginPage'));
const MainLayout = lazy(() => import('../components/layout/MainLayout'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Unauthorized = lazy(() => import('../pages/Unauthorized'));

// 管理员页面
const BrandManagement = lazy(() => import('../pages/admin/BrandManagement'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));
const ProductManagement = lazy(() => import('../pages/admin/ProductManagement'));

// 销售员页面
const SellerProducts = lazy(() => import('../pages/seller/PalletManagement'));
const ProfileManagement = lazy(() => import('../pages/seller/ProfileManagement'));

// 创建路由
const router = createBrowserRouter([
  {
    path: '/login',
    element: lazyLoad(LoginPage),
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
        element: lazyLoad(Dashboard) 
      },
      // 管理员路由
      {
        path: 'admin',
        children: [
          { 
            path: 'brands', 
            element: lazyLoad(BrandManagement) 
          },
          { 
            path: 'users', 
            element: lazyLoad(UserManagement) 
          },
          { 
            path: 'products', 
            element: lazyLoad(ProductManagement) 
          },
        ],
      },
      // 销售员路由
      {
        path: 'seller',
        children: [
          { 
            path: 'products', 
            element: lazyLoad(SellerProducts) 
          },
          { 
            path: 'profile', 
            element: lazyLoad(ProfileManagement) 
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