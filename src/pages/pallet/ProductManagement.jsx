import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button, Input, Select, Typography, message, App } from 'antd';
import { PlusOutlined, ShareAltOutlined, DownloadOutlined, EyeOutlined, DeleteOutlined, EditOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import request from '@/utils/request';
import DataTable from '@/components/common/DataTable';
import styles from './ProductManagement.module.css';
import { commonSearch } from '@/api/common';

const { Title } = Typography;
const { Option } = Select;

const ProductManagement = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const isAdmin = user?.is_admin;
  const { message } = App.useApp();
  
  // 添加搜索防抖定时器的引用
  const searchTimerRef = useRef(null);
  
  // 状态管理
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // 是否处于搜索状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  });
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    sort_field: 'updated_at',
    sort_order: 'desc'
  });
  
  // 根据用户角色确定固定的所有者类型 - 管理员查看公司总货盘，普通用户查看个人货盘
  const ownerType = isAdmin ? 'COMPANY' : 'SELLER';

  // 使用useMemo缓存表格列定义，避免每次渲染都重新创建
  const columns = useMemo(() => [
    { title: <div className={styles.center}>序号</div>, dataIndex: 'index', key: 'index', align: 'center' },
    { title: <div className={styles.center}>图片</div>, dataIndex: 'image', key: 'image', align: 'center', render: () => <div className={styles.imgPlaceholder}></div> },
    { title: <div className={styles.center}>名称</div>, dataIndex: 'name', key: 'name', align: 'center' },
    { 
      title: <div className={styles.center}>品牌</div>, 
      dataIndex: 'brand_name', 
      key: 'brand_name', 
      align: 'center',
      render: (brandName, record) => {
        if (brandName) return brandName;
        
        if (record.brand_id && brands.length > 0) {
          const brand = brands.find(b => b.id === record.brand_id);
          return brand ? brand.name : '-';
        }
        
        return '-';
      }
    },
    { title: <div className={styles.center}>货号</div>, dataIndex: 'product_code', key: 'product_code', align: 'center' },
    { title: <div className={styles.center}>规格</div>, dataIndex: 'specification', key: 'specification', align: 'center' },
    { title: <div className={styles.center}>净含量</div>, dataIndex: 'net_content', key: 'net_content', align: 'center' },
    { title: <div className={styles.center}>产品尺寸</div>, dataIndex: 'product_size', key: 'product_size', align: 'center' },
    { title: <div className={styles.center}>装箱方式</div>, dataIndex: 'shipping_method', key: 'shipping_method', align: 'center' },
    { title: <div className={styles.center}>装箱规格</div>, dataIndex: 'shipping_spec', key: 'shipping_spec', align: 'center' },
    { title: <div className={styles.center}>装箱尺寸</div>, dataIndex: 'shipping_size', key: 'shipping_size', align: 'center' },
    { 
      title: (
        <div className={styles.center}>
          <div>档位价格</div>
          <div className={styles.priceTiersHeader}>
            <span className={styles.tierQtyHeader}>订购数量</span>
            <span className={styles.tierHeaderDivider}></span>
            <span className={styles.tierPriceHeader}>价格</span>
          </div>
        </div>
      ),
      dataIndex: 'price_tiers', 
      key: 'price_tiers', 
      align: 'center', 
      render: (priceTiers, record) => {
        // 增强价格档位处理逻辑，处理各种格式
        let tiers = priceTiers;
        
        // 检查价格档位是否为字符串（可能是JSON字符串）
        if (typeof priceTiers === 'string') {
          try {
            tiers = JSON.parse(priceTiers);
          } catch (e) {
            console.error('解析价格档位JSON错误:', e);
            return <div>-</div>;
          }
        }
        
        // 检查价格档位是否存在且为数组
        if (!tiers || !Array.isArray(tiers) || tiers.length === 0) {
          return <div>-</div>;
        }
        
        // 按数量排序
        const sortedTiers = [...tiers].sort((a, b) => Number(a.quantity) - Number(b.quantity));
        
        return (
          <div className={styles.priceTiersCell}>
            {sortedTiers.map((tier, index) => (
              <div key={index} className={styles.priceTierRow}>
                <span className={styles.tierQty}>≤{tier.quantity}</span>
                <span className={styles.tierRowDivider}></span>
                <span className={styles.tierPrice}>{tier.price}元/件</span>
              </div>
            ))}
          </div>
        );
      }
    },
    { title: <div className={styles.center}>素材包</div>, dataIndex: 'material', key: 'material', align: 'center', render: (_, record) => {
      const materialAttachment = record.attachments?.find(attachment => attachment.file_type === 'MATERIAL');
      return materialAttachment ? <Button type="link" icon={<DownloadOutlined />} onClick={() => handleDownloadMaterial(materialAttachment)} /> : '-';
    }},
    { title: <div className={styles.center}>产品链接</div>, dataIndex: 'product_url', key: 'product_url', align: 'center', render: (url) => url ? <Button type="link" icon={<EyeOutlined />} onClick={() => window.open(url, '_blank')} /> : '-' },
    { title: <div className={styles.center}>编辑</div>, dataIndex: 'edit', key: 'edit', align: 'center', render: (_, record) => <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} /> },
    { title: <div className={styles.center}>放入回收站</div>, dataIndex: 'recycle', key: 'recycle', align: 'center', render: (_, record) => <Button type="link" onClick={() => handleMoveToRecycleBin(record.id)}>放入回收站</Button> },
    { title: <div className={styles.center}>删除</div>, dataIndex: 'delete', key: 'delete', align: 'center', render: (_, record) => <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} /> },
  ], [brands]);

  // 引用保存组件样式重置id
  const styleResetRef = useRef(null);

  // 初始化加载数据 - 确保先加载品牌再加载产品
  useEffect(() => {
    const initData = async () => {
      try {
        // 先获取品牌列表
        await fetchBrands();
        
        // 然后获取产品列表
        await fetchProducts();
      } catch (error) {
        console.error('初始化数据加载失败:', error);
        message.error('初始化数据加载失败');
      }
    };
    
    initData();

    // 为ProductManagement添加特定样式范围
    const styleId = 'product-management-styles';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.innerHTML = `
        /* 限制表格样式作用域，避免影响其他页面 */
        .${styles.container} .ant-table-cell {
          padding: 0 !important;
        }
        
        .${styles.container} .ant-table-thead > tr > th,
        .${styles.container} .ant-table-tbody > tr > td {
          padding: 0 !important;
        }
        
        .${styles.container} .ant-table-thead > tr > th {
          background-color: #e6f7ff !important;
          border-color: #d9d9d9 !important;
        }
        
        .${styles.container} .ant-table-tbody > tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        
        .${styles.container} .ant-table-tbody > tr:hover > td {
          background-color: #f0f7ff !important;
        }
        
        .${styles.container} .ant-table-bordered .ant-table-cell {
          border-color: #e8e8e8 !important;
        }
      `;
      document.head.appendChild(styleElement);
      styleResetRef.current = styleId;
    }

    // 组件卸载时清理样式
    return () => {
      if (styleResetRef.current) {
        const styleElement = document.getElementById(styleResetRef.current);
        if (styleElement) {
          document.head.removeChild(styleElement);
        }
      }
    };
  }, []);

  // 获取品牌列表 - 仅用于显示，不再用于筛选
  const fetchBrands = async () => {
    try {
      const response = await request({
        url: '/api/pallet/brands',
        method: 'GET',
        params: {
          status: 'ACTIVE'
        }
      });
      
      console.log('品牌列表API响应:', response);
      
      if (response && response.data && response.data.list && Array.isArray(response.data.list)) {
        console.log('成功获取品牌列表, 数量:', response.data.list.length);
        setBrands(response.data.list);
        return response.data.list; // 返回品牌数据，方便后续使用
      } else {
        console.error('获取品牌列表格式错误或为空');
        message.error('获取品牌列表失败');
        return [];
      }
    } catch (error) {
      console.error('获取品牌列表失败:', error);
      message.error('获取品牌列表失败');
      return [];
    }
  };

  // 合并的产品获取函数 - 用于分页和搜索两种场景
  const fetchProducts = useCallback(async (page = pagination.current, pageSize = pagination.pageSize, keyword = searchParams.keyword) => {
    setLoading(true);
    
    try {
      // 判断是否为搜索模式
      const isSearchMode = keyword && keyword.trim() !== '';
      setIsSearching(isSearchMode);

      if (isSearchMode) {
        // 搜索模式
        const fields = 'p.name,b.name,p.product_code,p.specification,p.net_content';
        const exact = false;
        const additionalParams = {
          sort_field: searchParams.sort_field,
          sort_order: searchParams.sort_order,
          with_price_tiers: true,  // 添加参数，请求包含价格档位数据
          owner_type: ownerType     // 添加所有者类型参数
        };
        
        console.log('搜索参数:', {
          module: 'products',
          keyword,
          fields,
          exact,
          owner_type: ownerType,
          ...additionalParams
        });
        
        const response = await commonSearch('products', keyword, fields, exact, additionalParams);
        
        console.log('搜索响应:', response);
        
        if (response && response.code === 200 && response.data) {
          const allProducts = response.data.list || [];
          const total = allProducts.length;
          
          // 前端分页 - 计算当前页应该显示的数据
          const startIndex = (page - 1) * pageSize;
          const endIndex = Math.min(startIndex + pageSize, total);
          const currentPageData = allProducts.slice(startIndex, endIndex);
          
          // 处理产品数据 - 确保每个产品都有price_tiers属性
          const enhancedProducts = await processProductData(currentPageData);
          
          // 添加序号
          const productsWithIndex = enhancedProducts.map((item, index) => ({
            ...item,
            index: startIndex + index + 1
          }));
          
          // 更新产品列表和分页信息
          setProducts(productsWithIndex);
          setPagination({
            current: page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize)
          });
          
          console.log('更新产品列表(搜索):', productsWithIndex.length, '条记录, 总记录数:', total, 
                     '当前页:', page, '每页条数:', pageSize, '总页数:', Math.ceil(total / pageSize));
        } else {
          console.error('搜索产品失败:', response?.message || '未知错误');
          setProducts([]);
          // 重置分页信息但保持页面大小
          setPagination(prev => ({
            ...prev,
            current: 1,
            total: 0,
            totalPages: 0
          }));
        }
      } else {
        // 分页模式
        const params = {
          page,
          page_size: pageSize,
          module: 'products',
          sort_field: searchParams.sort_field,
          sort_order: searchParams.sort_order,
          with_brand: true,  // 添加请求品牌信息的参数
          with_price_tiers: true,  // 添加参数，请求包含价格档位数据
          owner_type: ownerType  // 添加固定的所有者类型参数
        };
        
        console.log('分页查询参数:', params);
        
        // 调用分页查询API - 使用正确的API路径
        const response = await request({
          url: '/api/common/pagination/query',
          method: 'GET',
          params
        });
        
        console.log('分页查询响应:', response);
        
        if (response && response.code === 200 && response.data) {
          let productList = [];
          let total = 0;
          let totalPages = 1;
          
          // 解析产品列表
          if (response.data.items && Array.isArray(response.data.items)) {
            productList = response.data.items;
            total = response.data.pagination?.total || 0;
            totalPages = response.data.pagination?.total_pages || 1;
          }
          
          // 处理产品数据 - 确保每个产品都有price_tiers属性
          const enhancedProducts = await processProductData(productList);
          
          // 添加序号
          const productsWithIndex = enhancedProducts.map((item, index) => ({
            ...item,
            index: (page - 1) * pageSize + index + 1
          }));
          
          // 更新状态
          setProducts(productsWithIndex);
          setPagination({
            current: page,
            pageSize: pageSize,
            total: total,
            totalPages: totalPages
          });
          
          console.log('更新产品列表(分页):', productsWithIndex.length, '条记录');
        } else {
          console.error('获取产品列表失败:', response?.message || '未知错误');
          message.error('获取产品列表失败');
          setProducts([]);
          // 重置分页信息但保持页面大小
          setPagination(prev => ({
            ...prev,
            current: 1,
            total: 0,
            totalPages: 0
          }));
        }
      }
    } catch (error) {
      console.error('获取产品数据错误:', error);
      message.error('获取产品列表失败');
      setProducts([]);
      // 重置分页信息但保持页面大小
      setPagination(prev => ({
        ...prev,
        current: 1,
        total: 0,
        totalPages: 0
      }));
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchParams.sort_field, searchParams.sort_order, searchParams.keyword, ownerType]);

  // 处理产品数据，为每个产品加载价格档位
  const processProductData = async (products) => {
    if (!products || products.length === 0) return [];
    
    // 对于没有价格档位的产品，尝试获取价格档位
    const productsWithoutTiers = products.filter(product => 
      !product.price_tiers || !Array.isArray(product.price_tiers) || product.price_tiers.length === 0
    );
    
    // 如果所有产品都已有价格档位数据，直接返回
    if (productsWithoutTiers.length === 0) {
      return products;
    }
    
    // 创建产品ID到产品的映射，以便后续更新
    const productMap = {};
    products.forEach(product => {
      productMap[product.id] = { ...product };
      
      // 为所有产品初始化空的价格档位数组，避免未定义
      if (!productMap[product.id].price_tiers || !Array.isArray(productMap[product.id].price_tiers)) {
        productMap[product.id].price_tiers = [];
      }
    });
    
    // 批量获取价格档位数据
    try {
      // 由于权限原因，我们不需要获取所有产品的详情，尤其是pagination接口已返回的产品
      // 对于分页接口，如果已经返回了价格档位数据，则无需再次请求
      const productIds = productsWithoutTiers
        .filter(p => !p.price_tiers || p.price_tiers.length === 0)
        .map(p => p.id);
      
      if (productIds.length === 0) {
        return Object.values(productMap);
      }
      
      // 构建批量查询参数 - 使用产品详情API获取价格档位
      const queryPromises = productIds.map(productId => 
        request({
          url: `/api/pallet/products/${productId}`,  // 修正API路径，使用产品详情接口
          method: 'GET'
        }).catch(err => {
          // 对于403错误（权限不足），不显示错误消息，只在控制台记录
          if (err.response && err.response.status === 403) {
            console.log(`产品 ${productId} 无访问权限，跳过获取价格档位`);
          } else {
            console.error(`获取产品 ${productId} 详情失败:`, err);
          }
          return { code: err.response?.status || 500, data: null }; 
        })
      );
      
      // 并行执行所有请求
      const responses = await Promise.all(queryPromises);
      
      // 更新产品数据
      responses.forEach((response, index) => {
        const productId = productIds[index];
        if (response && response.code === 200 && response.data) {
          const productData = response.data;
          
          // 从产品详情中获取价格档位
          const priceTiers = productData.price_tiers || [];
          
          if (productMap[productId]) {
            // 更新价格档位和其他可能缺失的信息
            productMap[productId].price_tiers = priceTiers;
            
            // 如果产品详情中有附件信息，也一并更新
            if (productData.attachments) {
              productMap[productId].attachments = productData.attachments;
            }
          }
        }
      });
      
      // 返回更新后的产品列表
      return Object.values(productMap);
    } catch (error) {
      console.error('批量获取产品详情失败:', error);
      // 出错时，返回原始产品列表
      return products;
    }
  };

  // 处理表格分页、排序、筛选变化 - 使用useCallback优化
  const handleTableChange = useCallback((newPagination, filters, sorter) => {
    console.log('表格变化', { 
      newPagination, 
      currentPagination: pagination,
      sorter,
      isSearching
    });
    
    // 检查是否是分页大小改变
    const isPageSizeChanged = newPagination.pageSize !== pagination.pageSize;
    
    // 如果分页大小发生变化，总是将当前页设为1
    const newCurrentPage = isPageSizeChanged ? 1 : newPagination.current;
    
    // 处理排序
    if (sorter && sorter.field) {
      setSearchParams(prev => ({
        ...prev,
        sort_field: sorter.field,
        sort_order: sorter.order === 'ascend' ? 'asc' : 'desc'
      }));
    }
    
    // 调用统一的获取产品函数
    fetchProducts(
      newCurrentPage, 
      newPagination.pageSize, 
      searchParams.keyword
    );
  }, [fetchProducts, pagination, isSearching, searchParams.keyword]);

  // 处理搜索输入框值变化 - 用于实时搜索，使用useCallback优化
  const handleSearchInputChange = useCallback((e) => {
    const value = e.target.value;
    
    // 清除之前的定时器
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    
    // 立即更新搜索关键词状态，这样输入框的值会实时显示
    setSearchParams(prev => ({
      ...prev,
      keyword: value
    }));
    
    // 如果输入为空，立即执行普通分页查询
    if (!value || value.trim() === '') {
      fetchProducts(1, pagination.pageSize, '');
    } else {
      // 否则添加300ms防抖后执行搜索
      searchTimerRef.current = setTimeout(() => {
        fetchProducts(1, pagination.pageSize, value);
      }, 300);
    }
  }, [fetchProducts, pagination.pageSize]);

  // 处理品牌筛选变化 - 待实现，使用useCallback优化
  const handleBrandChange = useCallback((value) => {
    // 品牌筛选功能待实现
    message.info('品牌筛选功能待实现');
  }, []);

  // 强制刷新产品列表，使用useCallback优化
  const handleRefreshList = useCallback(() => {
    console.log('强制刷新整个页面，重置为初始状态');
    
    // 重置搜索参数为初始值
    setSearchParams({
      keyword: '',
      sort_field: 'updated_at',
      sort_order: 'desc'
    });
    
    // 完全重置分页设置，包括每页显示数量
    setPagination({
      current: 1,
      pageSize: 10, // 重置为默认的10条每页
      total: 0,
      totalPages: 0
    });
    
    // 重置搜索状态
    setIsSearching(false);
    
    // 重新获取品牌列表和产品列表
    const refreshData = async () => {
      await fetchBrands();
      await fetchProducts(1, 10, ''); // 使用固定的初始值10
    };
    
    refreshData();
    
    // 提示用户
    message.success('页面已刷新');
  }, [fetchProducts]);

  // 处理添加产品 - 待实现，使用useCallback优化
  const handleAddProduct = useCallback(() => {
    // 待实现添加产品功能
    message.info('添加产品功能待实现');
  }, []);

  // 处理编辑产品 - 待实现，使用useCallback优化
  const handleEdit = useCallback((record) => {
    // 待实现编辑产品功能
    message.info(`编辑产品功能待实现，产品ID: ${record.id}`);
  }, []);

  // 处理删除产品 - 待实现，使用useCallback优化
  const handleDelete = useCallback((id) => {
    // 待实现删除产品功能
    message.info(`删除产品功能待实现，产品ID: ${id}`);
  }, []);

  // 处理放入回收站 - 待实现，使用useCallback优化
  const handleMoveToRecycleBin = useCallback((id) => {
    // 待实现放入回收站功能
    message.info(`放入回收站功能待实现，产品ID: ${id}`);
  }, []);

  // 处理下载素材包 - 待实现，使用useCallback优化
  const handleDownloadMaterial = useCallback((attachment) => {
    // 待实现下载素材包功能
    message.info(`下载素材包功能待实现，附件ID: ${attachment.id}`);
  }, []);

  // 处理分享货盘 - 待实现，使用useCallback优化
  const handleSharePallet = useCallback(() => {
    // 待实现分享货盘功能
    message.info('分享货盘功能待实现');
  }, []);

  // 如果未认证，返回null（让路由系统处理重定向）
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <Title level={3}>{isAdmin ? '公司总货盘管理' : '我的货盘管理'}</Title>
        
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <Input
              placeholder="搜索产品名称、品牌、货号、规格、净含量" 
              style={{ 
                width: 400,
                marginRight: 16,
                borderRadius: '20px'
              }}
              value={searchParams.keyword}
              onChange={handleSearchInputChange}
              allowClear
              prefix={<SearchOutlined style={{ color: '#999' }} />}
            />
            
            {/* 品牌筛选下拉框 - 设置为待实现 */}
            <Select
              placeholder="选择品牌"
              style={{ width: 200, marginRight: 8 }}
              onChange={handleBrandChange}
              disabled
            >
              <Option value="disabled" disabled>品牌筛选功能待实现</Option>
            </Select>
            
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefreshList}
              style={{ marginRight: 16 }}
            >
              刷新
            </Button>
          </div>
          <div className={styles.toolbarRight}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              style={{ marginRight: 16 }}
              onClick={handleAddProduct}
            >
              添加产品
            </Button>
            <Button 
              icon={<ShareAltOutlined />} 
              className={styles.shareBtn}
              onClick={handleSharePallet}
            >
              分享货盘
            </Button>
          </div>
        </div>
      </div>
      
      {/* 使用通用DataTable组件 */}
      <DataTable
        className={`${styles.table} ${styles.productTable}`}
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`
        }}
        onChange={handleTableChange}
        showPagination={true}
        tableProps={{
          bordered: true,
          scroll: { x: 'max-content' }
        }}
      />
    </div>
  );
};

// 使用App组件包裹ProductManagement，提供全局消息和模态框上下文
const ProductManagementWithApp = () => (
  <App>
    <ProductManagement />
  </App>
);

export default ProductManagementWithApp; 