import request from '../utils/request';

// 获取品牌列表
export const getBrands = (params) => {
  return request({
    url: '/brands',
    method: 'get',
    params
  });
};

// 获取品牌详情
export const getBrandById = (id) => {
  return request({
    url: `/brands/${id}`,
    method: 'get'
  });
};

// 创建品牌
export const createBrand = (data) => {
  return request({
    url: '/brands',
    method: 'post',
    data
  });
};

// 更新品牌
export const updateBrand = (id, data) => {
  return request({
    url: `/brands/${id}`,
    method: 'put',
    data
  });
};

// 删除品牌
export const deleteBrand = (id) => {
  return request({
    url: `/brands/${id}`,
    method: 'delete'
  });
}; 