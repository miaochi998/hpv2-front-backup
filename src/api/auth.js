import request from '../utils/request';

// 登录API
export const login = (data) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  });
};

// 登出API
export const logout = () => {
  return request({
    url: '/auth/logout',
    method: 'post'
  });
};

// 获取用户信息API
export const getUserProfile = () => {
  return request({
    url: '/auth/profile',
    method: 'get'
  });
};

// 更新用户信息API
export const updateUserProfile = (data) => {
  return request({
    url: '/auth/profile',
    method: 'put',
    data
  });
}; 