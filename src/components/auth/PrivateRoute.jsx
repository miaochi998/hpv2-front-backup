import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// 权限验证组件 - 简化版本
const PrivateRoute = ({ element, requiredRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // 未登录时，直接跳转到登录页
  if (!isAuthenticated) {
    console.log('未登录，重定向到登录页');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 需要特定角色验证
  if (requiredRoles.length > 0 && user) {
    const userRole = user.is_admin ? 'admin' : 'seller';
    
    if (!requiredRoles.includes(userRole)) {
      console.log('无权限访问，重定向到无权限页面');
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 验证通过，渲染组件
  return element;
};

export default PrivateRoute; 