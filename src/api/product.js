import request from '../utils/request';

// 获取产品列表
export const getProducts = (params) => {
  return request({
    url: '/pallet/products',
    method: 'get',
    params
  });
};

// 获取产品详情
export const getProductById = (id) => {
  return request({
    url: `/pallet/products/${id}`,
    method: 'get'
  });
};

// 创建产品
export const createProduct = (data) => {
  return request({
    url: '/pallet/products',
    method: 'post',
    data
  });
};

// 更新产品
export const updateProduct = (id, data) => {
  return request({
    url: `/pallet/products/${id}`,
    method: 'put',
    data
  });
};

// 删除产品
export const deleteProduct = (id) => {
  return request({
    url: `/pallet/products/${id}`,
    method: 'delete'
  });
}; 