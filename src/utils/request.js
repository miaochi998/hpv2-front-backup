import axios from 'axios';
import { message } from 'antd';

// 从环境变量获取API基础URL
const baseURL = import.meta.env.VITE_API_BASE_URL;

// 创建axios实例
const request = axios.create({
  baseURL,
  timeout: 15000, // 15秒超时
});

// 获取本地存储中的token
export const getToken = () => localStorage.getItem('token');

// 设置本地存储中的token
export const setToken = (token) => localStorage.setItem('token', token);

// 移除本地存储中的token
export const removeToken = () => localStorage.removeItem('token');

// 请求拦截器 - 添加认证token
request.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = getToken();
    if (token) {
      // 设置Authorization请求头
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 处理常见错误
request.interceptors.response.use(
  (response) => {
    // 直接返回数据部分
    return response.data;
  },
  (error) => {
    // 处理错误情况
    if (error.response) {
      // 服务器返回了错误状态码
      const { status } = error.response;
      
      if (status === 401) {
        // 未授权 - 清除token并重定向到登录页
        removeToken();
        message.error('登录已过期，请重新登录');
        window.location.href = '/login';
      } else if (status === 403) {
        message.error('您没有权限执行此操作');
      } else if (status === 500) {
        message.error('服务器错误，请稍后再试');
      } else {
        // 其他错误
        const errorMsg = error.response.data?.message || '请求失败';
        message.error(errorMsg);
      }
    } else if (error.request) {
      // 请求发出但没有收到响应
      message.error('无法连接到服务器，请检查网络连接');
    } else {
      // 请求配置出错
      message.error('请求配置错误');
    }
    
    return Promise.reject(error);
  }
);

export default request; 