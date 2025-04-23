import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// 权限验证组件
const PrivateRoute = ({ element, requiredRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // 临时调试模式 - 在开发阶段始终允许访问
  const isDevelopment = import.meta.env.DEV;
  if (isDevelopment) {
    console.log('开发模式: 临时绕过身份验证，便于测试');
    return element;
  }

  // 检查紧急调试模式
  const debugAuth = localStorage.getItem('debug_auth') === 'true';
  if (debugAuth) {
    console.log('紧急调试模式: 绕过身份验证');
    return element;
  }

  // 添加调试信息
  console.log('PrivateRoute验证状态:', { 
    path: location.pathname,
    isAuthenticated, 
    hasUser: !!user,
    userInfo: user,
    requiredRoles
  });

  // 如果未登录，重定向到登录页
  if (!isAuthenticated) {
    console.log('未登录，重定向到登录页');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果需要用户信息但尚未加载
  if (requiredRoles.length > 0 && !user) {
    console.log('需要用户信息但尚未加载，暂时显示加载中');
    // 可以返回加载状态或直接通过，由组件内部处理
    return element; // 暂时放行，组件内部会处理
  }

  // 如果需要特定角色但用户没有相应角色，重定向到无权限页面
  if (requiredRoles.length > 0 && user) {
    const userRole = user.is_admin ? 'admin' : 'seller';
    console.log('权限检查:', { userRole, requiredRoles });
    
    if (!requiredRoles.includes(userRole)) {
      console.log('无权限访问，重定向到无权限页面');
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 验证通过，渲染原始组件
  console.log('验证通过，正常渲染');
  return element;
};

export default PrivateRoute; 