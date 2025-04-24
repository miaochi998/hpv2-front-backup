import axios from 'axios';
import { message } from 'antd';

// 从环境变量获取API基础URL，如果未设置则使用当前域名
const baseURL = import.meta.env.VITE_API_BASE_URL || '';
// 添加详细的环境信息日志
console.log('API配置信息:', { 
  baseURL, 
  env: import.meta.env.VITE_ENV,
  isDev: import.meta.env.DEV,
  mode: import.meta.env.MODE
});

// 定义token键名，保持与authSlice.js一致
const TOKEN_KEY = 'auth_token';

// 创建axios实例
const request = axios.create({
  baseURL,
  timeout: 15000, // 15秒超时
});

// 获取本地存储中的token
export const getToken = () => localStorage.getItem(TOKEN_KEY);

// 设置本地存储中的token
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

// 移除本地存储中的token
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

// 请求拦截器 - 添加认证token
request.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = getToken();
    if (token) {
      // 设置Authorization请求头
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加调试日志
    console.log(`[REQUEST] ${config.method.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data,
      params: config.params,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      timestamp: new Date().toISOString()
    });
    return config;
  },
  (error) => {
    console.error('[REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理常见错误
request.interceptors.response.use(
  (response) => {
    // 添加调试日志
    console.log(`[RESPONSE] ${response.config.url}`, {
      status: response.status,
      data: response.data,
      headers: response.headers,
      timestamp: new Date().toISOString()
    });
    
    // 检查后端响应格式
    const { data } = response;
    if (data.code === 200) {
      // 正常响应，返回数据
      return data;
    } else {
      // 业务逻辑错误，抛出异常
      console.error('[RESPONSE ERROR] 业务逻辑错误', data);
      const error = new Error(data.message || '请求失败');
      error.response = response;
      return Promise.reject(error);
    }
  },
  (error) => {
    // 添加调试日志
    console.error('[RESPONSE ERROR] 请求错误:', error);
    
    // 详细记录错误信息
    const errorData = {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      timestamp: new Date().toISOString()
    };
    
    if (error.response) {
      errorData.status = error.response.status;
      errorData.data = error.response.data;
      errorData.headers = error.response.headers;
      console.error('[RESPONSE ERROR DETAILS]', errorData);
    }
    
    // 处理错误情况
    if (error.response) {
      // 服务器返回了错误状态码
      const { status } = error.response;
      console.log(`错误状态码: ${status}`, error.response.data);
      
      if (status === 401) {
        // 未授权 - 清除token并重定向到登录页
        removeToken();
        message.error('登录已过期，请重新登录');
        window.location.href = '/login';
      } else if (status === 403) {
        message.error('您没有权限执行此操作');
      } else if (status === 500) {
        message.error('服务器错误，请稍后再试');
      } else if (status === 404) {
        message.error('请求的资源不存在');
      } else {
        // 其他错误
        const errorMsg = error.response.data?.message || '请求失败';
        message.error(errorMsg);
      }
    } else if (error.request) {
      // 请求发出但没有收到响应
      console.log('没有收到响应:', error.request);
      message.error('无法连接到服务器，请检查网络连接');
    } else {
      // 请求配置出错
      console.log('请求配置错误:', error.message);
      message.error('请求配置错误');
    }
    
    return Promise.reject(error);
  }
);

// 导出一个调试工具函数，方便在浏览器控制台检查API配置
window.checkAPIConfig = () => {
  console.log('当前API配置:', {
    baseURL,
    env: import.meta.env.VITE_ENV,
    isDev: import.meta.env.DEV,
    mode: import.meta.env.MODE,
    token: getToken()
  });
  return {
    baseURL,
    env: import.meta.env.VITE_ENV,
    isDev: import.meta.env.DEV,
    mode: import.meta.env.MODE,
    token: getToken()
  };
};

export default request; 