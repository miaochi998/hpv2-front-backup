import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// 权限验证组件
const PrivateRoute = ({ element, requiredRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // 如果未登录，重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果需要特定角色但用户没有相应角色，重定向到无权限页面
  if (requiredRoles.length > 0) {
    const userRole = user?.is_admin ? 'admin' : 'seller';
    if (!requiredRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 验证通过，渲染原始组件
  return element;
};

export default PrivateRoute; 