import request from '../utils/request';

/**
 * 获取通用分页查询数据
 * 
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.page_size - 每页条数
 * @param {string} params.sort_field - 排序字段
 * @param {string} params.sort_order - 排序方式 (asc|desc)
 * @returns {Promise<Object>} 分页数据
 */
export const getPaginationData = (params) => {
  return request({
    url: '/common/pagination/query',
    method: 'GET',
    params
  });
};

/**
 * 更新用户分页设置
 * 
 * @param {Object} data - 分页设置
 * @param {number} data.page_size - 每页条数 (10|20|50|100)
 * @returns {Promise<Object>} 更新结果
 */
export const updatePaginationSettings = (data) => {
  return request({
    url: '/common/pagination/settings',
    method: 'POST',
    data
  });
};

/**
 * 通用搜索接口
 * 
 * @param {Object} params - 搜索参数
 * @param {string} params.keyword - 搜索关键词
 * @param {string} params.entity_type - 实体类型
 * @param {number} params.page - 页码
 * @param {number} params.page_size - 每页条数
 * @returns {Promise<Object>} 搜索结果
 */
export const search = (params) => {
  return request({
    url: '/common/search',
    method: 'GET',
    params
  });
};

export default {
  getPaginationData,
  updatePaginationSettings,
  search
}; 