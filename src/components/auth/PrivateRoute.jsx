import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// 权限验证组件 - 简化版本
const PrivateRoute = ({ element, requiredRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // 添加详细日志
  console.log('[PrivateRoute] 检查授权:', { 
    isAuthenticated, 
    user, 
    requiredRoles, 
    currentPath: location.pathname 
  });

  // 未登录时，直接跳转到登录页
  if (!isAuthenticated) {
    console.log('[PrivateRoute] 未登录，重定向到登录页面', {
      from: location.pathname
    });
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 需要特定角色验证
  if (requiredRoles.length > 0 && user) {
    const userRole = user.is_admin ? 'admin' : 'seller';
    
    console.log('[PrivateRoute] 检查用户角色权限:', {
      userRole,
      requiredRoles,
      hasPermission: requiredRoles.includes(userRole)
    });
    
    if (!requiredRoles.includes(userRole)) {
      console.log('[PrivateRoute] 无权限访问，重定向到无权限页面');
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 验证通过，渲染组件
  console.log('[PrivateRoute] 权限验证通过，渲染组件');
  return element;
};

export default PrivateRoute; 