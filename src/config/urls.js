/**
 * URL配置管理模块
 * 集中管理所有API和资源URL配置，方便未来域名变更
 */

// 获取API基础URL
export const getApiBaseUrl = () => {
  // 1. 首先检查环境变量中是否已定义
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // 2. 检查是否是生产环境（根据域名判断）
  const { hostname } = window.location;
  const isProduction = hostname.includes('bonnei.com');
  
  // 3. 根据环境返回对应的后端URL
  if (isProduction) {
    // 当前使用IP，未来可改为域名
    return 'http://192.168.2.9:6016';
  } else {
    // 开发环境使用当前主机的6016端口
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:6016`;
  }
};

// 获取图片URL的函数
export const getImageUrl = (imagePath, params = '') => {
  if (!imagePath) {
    return null;
  }
  
  // 如果已经是完整的URL（包含http或https），直接返回
  if (imagePath.startsWith('http')) {
    return imagePath + params;
  }
  
  // 确保路径以'/'开头
  if (!imagePath.startsWith('/')) {
    imagePath = `/${imagePath}`;
  }
  
  // 优先使用环境变量中的图片基础URL
  let baseUrl = '';
  if (import.meta.env.VITE_IMAGE_BASE_URL) {
    baseUrl = import.meta.env.VITE_IMAGE_BASE_URL;
    console.log('[URL CONFIG] 使用环境变量图片基础URL:', baseUrl);
  } else {
    // 否则使用API基础URL
    baseUrl = getApiBaseUrl();
    console.log('[URL CONFIG] 使用API基础URL作为图片URL:', baseUrl);
  }
  
  // 返回完整URL
  const fullUrl = `${baseUrl}${imagePath}${params}`;
  console.log('[URL CONFIG] 生成完整图片URL:', fullUrl);
  return fullUrl;
};

// 导出配置对象，方便引用
export default {
  apiBaseUrl: getApiBaseUrl(),
  getImageUrl
}; 