import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Button, Input, Select, Typography, App, Modal, Checkbox, 
  Image, Tag, Tooltip, Pagination, Empty, Spin
} from 'antd';
import { 
  SearchOutlined, UndoOutlined, DeleteOutlined, 
  EyeOutlined, DownloadOutlined, 
  FileOutlined, LinkOutlined, ReloadOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import styles from './RecycleBin.module.css';
import { 
  getRecycleBinItems, restoreProduct, deleteProduct,
  batchRestoreProducts, batchDeleteProducts 
} from '@/api/recycleBin';
import { getImageUrl } from '@/config/urls';
import { formatDateTime } from '@/utils/formatDateTime';
import './RecycleBinStyles.css';

const { Title, Text } = Typography;
const { Option } = Select;

const RecycleBin = () => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.is_admin;
  const { message, modal } = App.useApp();
  
  // 搜索防抖定时器引用
  const searchTimerRef = useRef(null);
  
  // 状态管理
  const [recycleBinItems, setRecycleBinItems] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  });
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    brand_id: undefined,
    sort_field: 'deleted_at',
    sort_order: 'desc'
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  
  // 添加滚动容器引用
  const scrollContainerRef = useRef(null);
  
  // 获取回收站数据
  const fetchRecycleBinData = useCallback(async (
    page = pagination.current,
    pageSize = pagination.pageSize,
    keyword = searchParams.keyword,
    brandId = searchParams.brand_id,
    sortField = searchParams.sort_field,
    sortOrder = searchParams.sort_order
  ) => {
    setLoading(true);
    
    try {
      // 构建查询参数
      const params = {
        page,
        page_size: pageSize,
        sort_field: sortField,
        sort_order: sortOrder
      };
      
      // 添加搜索关键词（如果有）
      if (keyword && keyword.trim() !== '') {
        params.search = keyword.trim();
      }
      
      // 添加品牌筛选（如果有）
      if (brandId !== undefined && brandId !== null) {
        params.brand_id = brandId;
      }
      
      // 发起API请求
      const response = await getRecycleBinItems(params);
      
      if (response && response.code === 200 && response.data) {
        // 添加序号
        const items = response.data.list || [];
        const startIndex = (page - 1) * pageSize;
        const itemsWithIndex = items.map((item, index) => ({
          ...item,
          index: startIndex + index + 1
        }));
        
        // 更新回收站数据和分页信息
        setRecycleBinItems(itemsWithIndex);
        setPagination({
          current: response.data.pagination.current_page,
          pageSize: response.data.pagination.per_page,
          total: response.data.pagination.total,
          totalPages: Math.ceil(response.data.pagination.total / response.data.pagination.per_page)
        });
      } else {
        // 处理错误响应
        setRecycleBinItems([]);
        setPagination(prev => ({
          ...prev,
          current: 1,
          total: 0,
          totalPages: 0
        }));
        
        if (response?.message) {
          message.error(response.message);
        }
      }
    } catch (error) {
      console.error('获取回收站列表失败:', error);
      setRecycleBinItems([]);
      message.error('获取回收站列表失败');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchParams, message]);
  
  // 获取品牌列表
  const fetchBrands = useCallback(async () => {
    try {
      const response = await fetch('/api/pallet/brands/filter');
      const result = await response.json();
      
      if (result.code === 200 && Array.isArray(result.data)) {
        setBrands(result.data);
      }
    } catch (error) {
      console.error('获取品牌列表失败:', error);
    }
  }, []);
  
  // 页面加载时获取数据
  useEffect(() => {
    fetchRecycleBinData();
    fetchBrands();
  }, [fetchRecycleBinData, fetchBrands]);
  
  // 处理搜索输入
  const handleSearchInput = (e) => {
    const value = e.target.value;
    
    // 清除之前的定时器
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    
    // 更新搜索关键词
    setSearchParams(prev => ({
      ...prev,
      keyword: value
    }));
    
    // 设置防抖定时器
    searchTimerRef.current = setTimeout(() => {
      fetchRecycleBinData(1, pagination.pageSize, value, searchParams.brand_id);
    }, 500);
  };
  
  // 处理品牌筛选
  const handleBrandFilter = (value) => {
    setSearchParams(prev => ({
      ...prev,
      brand_id: value
    }));
    
    fetchRecycleBinData(1, pagination.pageSize, searchParams.keyword, value);
  };
  
  // 处理分页切换
  const handlePageChange = (page, pageSize) => {
    fetchRecycleBinData(page, pageSize, searchParams.keyword, searchParams.brand_id);
  };
  
  // 处理刷新数据
  const handleRefresh = () => {
    fetchRecycleBinData();
  };
  
  // 处理图片预览
  const handleImagePreview = (imageUrl, title = '产品图片') => {
    if (!imageUrl) return;
    
    console.log('预览图片:', imageUrl);
    
    // 设置加载状态
    setPreviewLoading(true);
    setPreviewImage(imageUrl); // 直接使用传入的URL (已经由getImageUrl处理过)
    setPreviewTitle(title || '产品图片');
    setPreviewVisible(true);
    
    // 预加载图片 - 使用window.Image而不是Image，避免与antd的Image组件冲突
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => {
      console.log('图片加载完成');
      setPreviewLoading(false);
    };
    img.onerror = () => {
      console.error('图片加载失败:', imageUrl);
      setPreviewLoading(false);
      message.error('图片加载失败');
    };
  };
  
  // 关闭图片预览
  const handlePreviewCancel = () => {
    setPreviewVisible(false);
    setPreviewImage('');
    setPreviewTitle('');
  };
  
  // 下载素材包
  const handleDownloadMaterial = async (product) => {
    // 查找素材包附件
    const material = product.attachments?.find(item => item.file_type === 'MATERIAL');
    
    if (material && material.file_path) {
      try {
        // 构建完整的文件URL
        const fileUrl = getImageUrl(material.file_path);
        
        // 使用隐藏的a标签触发文件下载
        const link = document.createElement('a');
        link.href = fileUrl;
        
        // 设置下载文件名
        const fileName = material.file_name || `素材包_${material.id}`;
        link.setAttribute('download', fileName);
        
        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        message.success('素材包下载已开始');
      } catch (error) {
        console.error('下载素材包失败', error);
        message.error('下载素材包失败：' + (error.message || '未知错误'));
      }
    } else {
      message.warning('该产品没有素材包');
    }
  };
  
  // 处理产品选择
  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        // 如果已选中，则取消选中
        return prev.filter(id => id !== itemId);
      } else {
        // 如果未选中，则添加到选中列表
        return [...prev, itemId];
      }
    });
  };
  
  // 处理全选/取消全选
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // 全选当前页的所有产品
      const allIds = recycleBinItems.map(item => item.id);
      setSelectedItems(allIds);
    } else {
      // 取消全选
      setSelectedItems([]);
    }
  };
  
  // 处理还原产品
  const handleRestore = (item) => {
    modal.confirm({
      title: '确定要还原此产品吗？',
      content: <div>
        <p>还原后，产品将重新出现在货盘列表中。</p>
        <p>产品名称: {item.product.name}</p>
        <p>产品货号: {item.product.product_code}</p>
      </div>,
      onOk: async () => {
        try {
          const response = await restoreProduct(item.id);
          
          if (response && response.code === 200) {
            message.success('产品还原成功');
            // 刷新回收站列表
            fetchRecycleBinData();
          } else {
            message.error(response?.message || '产品还原失败');
          }
        } catch (error) {
          console.error('产品还原失败:', error);
          message.error('产品还原失败');
        }
      }
    });
  };
  
  // 处理永久删除产品
  const handleDelete = (item) => {
    modal.confirm({
      title: '确定要永久删除此产品吗？',
      content: <div>
        <p style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
          警告: 此操作无法撤销！产品将被永久删除，包括所有附件和价格信息。
        </p>
        <p>产品名称: {item.product.name}</p>
        <p>产品货号: {item.product.product_code}</p>
      </div>,
      okButtonProps: { danger: true, type: 'primary' },
      okText: '永久删除',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await deleteProduct(item.id);
          
          if (response && response.code === 200) {
            message.success('产品已永久删除');
            // 刷新回收站列表
            fetchRecycleBinData();
          } else {
            message.error(response?.message || '永久删除失败');
          }
        } catch (error) {
          console.error('永久删除产品失败:', error);
          message.error('永久删除失败');
        }
      }
    });
  };
  
  // 处理批量还原
  const handleBatchRestore = () => {
    if (selectedItems.length === 0) {
      message.warning('请先选择要还原的产品');
      return;
    }
    
    modal.confirm({
      title: '批量还原产品',
      content: <div>
        <p>确定要还原选中的 {selectedItems.length} 个产品吗？</p>
        <p>还原后，这些产品将重新出现在货盘列表中。</p>
      </div>,
      onOk: async () => {
        try {
          const response = await batchRestoreProducts(selectedItems);
          
          if (response && response.code === 200) {
            message.success(`已成功还原 ${response.data.success} 个产品`);
            // 重置选中状态
            setSelectedItems([]);
            // 刷新回收站列表
            fetchRecycleBinData();
          } else {
            message.error(response?.message || '批量还原失败');
          }
        } catch (error) {
          console.error('批量还原产品失败:', error);
          message.error('批量还原失败');
        }
      }
    });
  };
  
  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedItems.length === 0) {
      message.warning('请先选择要删除的产品');
      return;
    }
    
    modal.confirm({
      title: '批量永久删除产品',
      content: <div>
        <p style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
          警告: 此操作无法撤销！选中的 {selectedItems.length} 个产品将被永久删除，包括所有附件和价格信息。
        </p>
      </div>,
      okButtonProps: { danger: true, type: 'primary' },
      okText: '永久删除',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await batchDeleteProducts(selectedItems);
          
          if (response && response.code === 200) {
            message.success(`已成功删除 ${response.data.success} 个产品`);
            // 重置选中状态
            setSelectedItems([]);
            // 刷新回收站列表
            fetchRecycleBinData();
          } else {
            message.error(response?.message || '批量删除失败');
          }
        } catch (error) {
          console.error('批量删除产品失败:', error);
          message.error('批量删除失败');
        }
      }
    });
  };
  
  // 渲染价格档位
  const renderPriceTiers = (priceTiers) => {
    if (!priceTiers || !Array.isArray(priceTiers) || priceTiers.length === 0) {
      return <div className="recyclebin-price-tier-empty">暂无价格档位</div>;
    }

    // 只有一行时，添加特殊的内联样式处理边框问题
    const isSingleRow = priceTiers.length === 1;
    
    return (
      <div className="recyclebin-price-tiers-container">
        <div className="recyclebin-price-tiers-header">
          <div className="recyclebin-tier-qty-header">订购数量</div>
          <div className="recyclebin-tier-price-header">单价</div>
        </div>
        {priceTiers.map((tier, index) => (
          <div 
            key={index} 
            className="recyclebin-price-tier-row"
            style={isSingleRow ? { height: '100%', flex: '1' } : {}}
          >
            <div 
              className="recyclebin-tier-qty"
              style={isSingleRow ? { 
                height: '100%',
                position: 'relative',
                borderRight: '1px solid #f0f0f0',
              } : {}}
            >{`≤${tier.quantity}`}</div>
            <div 
              className="recyclebin-tier-price"
              style={isSingleRow ? { height: '100%' } : {}}
            >{tier.price}</div>
          </div>
        ))}
      </div>
    );
  };
  
  // 获取产品主图
  const getProductMainImage = (product) => {
    if (!product.attachments || !Array.isArray(product.attachments)) return null;
    
    // 查找产品图片附件(类型为IMAGE)
    const imageAttachment = product.attachments.find(
      attachment => attachment.file_type === 'IMAGE'
    );
    
    // 有图片时返回图片URL
    if (imageAttachment && imageAttachment.file_path) {
      return imageAttachment.file_path;
    }
    
    return null;
  };
  
  // 渲染产品图片
  const renderProductImage = (product) => {
    const imagePath = getProductMainImage(product);
    
    if (!imagePath) {
      return <div className="recyclebin-product-image-placeholder">暂无图片</div>;
    }
    
    // 生成完整图片URL用于缩略图显示和预览
    const fullImageUrl = getImageUrl(imagePath);
    
    return (
      <div className="recyclebin-product-image-container" onClick={() => handleImagePreview(fullImageUrl, product.name)}>
        <Image
          src={fullImageUrl}
          alt={product.name}
          preview={false}
          className="recyclebin-product-image"
          fallback="/images/fallback-image.png"
        />
        <div className="recyclebin-image-overlay">
          <EyeOutlined />
        </div>
      </div>
    );
  };
  
  return (
    <div className={styles.recycleBinContainer}>
      {/* 页面标题 */}
      <div className={styles.pageHeader}>
        <Title level={4}>{isAdmin ? '公司货盘回收站' : `${user?.name || ''}的货盘回收站`}</Title>
      </div>
      
      {/* 搜索和筛选栏 */}
      <div className={styles.searchFilterBar}>
        <Input
          placeholder="搜索产品名称或货号"
          allowClear
          prefix={<SearchOutlined />}
          value={searchParams.keyword}
          onChange={handleSearchInput}
          className={styles.searchInput}
        />
        
        <Select
          placeholder="按品牌筛选"
          allowClear
          value={searchParams.brand_id}
          onChange={handleBrandFilter}
          className={styles.brandSelect}
        >
          {brands.map(brand => (
            <Option key={brand.id} value={brand.id}>
              {brand.name}
            </Option>
          ))}
        </Select>
        
        <div style={{ marginLeft: 'auto' }}>
          <Text type="secondary">
            共 {pagination.total} 个产品在回收站
          </Text>
        </div>
      </div>
      
      {/* 批量操作栏 */}
      {recycleBinItems.length > 0 && (
        <div className={styles.batchActionBar}>
          <div className={styles.leftSection}>
            <span className={styles.selectionInfo}>
              {selectedItems.length > 0 ? (
                <>已选择 <span className={styles.selectedCount}>{selectedItems.length}</span> 个产品</>
              ) : (
                '可选择产品进行批量操作'
              )}
            </span>
            
            <Button
              type="primary"
              icon={<UndoOutlined />}
              onClick={handleBatchRestore}
              disabled={selectedItems.length === 0}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', marginLeft: 16 }}
            >
              批量还原
            </Button>
            
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={handleBatchDelete}
              disabled={selectedItems.length === 0}
              style={{ marginLeft: 12 }}
            >
              批量删除
            </Button>
          </div>
          
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
          >
            刷新
          </Button>
        </div>
      )}
      
      {/* 产品表格 */}
      <div className="recyclebin-product-grid-container">
        <Spin spinning={loading}>
          {recycleBinItems.length > 0 ? (
            <div 
              className="recyclebin-product-grid-scroll-container"
              ref={scrollContainerRef}
            >
              {/* 添加内容容器 */}
              <div className="recyclebin-product-grid-content">
                {/* 表头 */}
                <div className="recyclebin-product-grid-header">
                  <div className="recyclebin-grid-col recyclebin-grid-col-select">
                    <Checkbox
                      checked={selectedItems.length > 0 && selectedItems.length === recycleBinItems.length}
                      indeterminate={selectedItems.length > 0 && selectedItems.length < recycleBinItems.length}
                      onChange={handleSelectAll}
                    />
                  </div>
                  <div className="recyclebin-grid-col recyclebin-grid-col-index">序号</div>
                  <div className="recyclebin-grid-col recyclebin-grid-col-image">图片</div>
                  <div className="recyclebin-grid-col recyclebin-grid-col-name">名称</div>
                  <div className="recyclebin-grid-col recyclebin-grid-col-brand">品牌</div>
                  <div className="recyclebin-grid-col recyclebin-grid-col-code">货号</div>
                  <div className="recyclebin-grid-col recyclebin-grid-col-spec">规格</div>
                  <div className="recyclebin-grid-col recyclebin-grid-col-content">净含量</div>
                  <div className="recyclebin-grid-col recyclebin-grid-col-size">产品尺寸</div>
                  <div className="recyclebin-grid-col recyclebin-grid-col-shipping">装箱方式</div>
                  <div className="recyclebin-grid-col recyclebin-grid-col-ship-spec">装箱规格</div>
                  <div className="recyclebin-grid-col recyclebin-grid-col-ship-size">装箱尺寸</div>
                  <div className="recyclebin-grid-col recyclebin-grid-col-price-tier">价格档位</div>
                  <div className="recyclebin-grid-col recyclebin-grid-col-material">素材包</div>
                  <div className="recyclebin-grid-col recyclebin-grid-col-url">产品链接</div>
                  <div className="recyclebin-grid-col recyclebin-grid-col-restore">还原</div>
                  <div className="recyclebin-grid-col recyclebin-grid-col-delete">删除</div>
                </div>

                {/* 数据行 */}
                <div className="recyclebin-product-grid-body">
                  {recycleBinItems.map((item) => {
                    const product = item.product;
                    const hasMaterial = product.attachments?.some(att => att.file_type === 'MATERIAL');
                    
                    return (
                      <div key={item.id} className="recyclebin-product-grid-row">
                        <div className="recyclebin-grid-col recyclebin-grid-col-select">
                          <Checkbox 
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleItemSelect(item.id)}
                          />
                        </div>
                        <div className="recyclebin-grid-col recyclebin-grid-col-index">
                          {item.index}
                        </div>
                        <div className="recyclebin-grid-col recyclebin-grid-col-image">
                          {renderProductImage(product)}
                        </div>
                        <div className="recyclebin-grid-col recyclebin-grid-col-name" title={product.name}>
                          {product.name}
                        </div>
                        <div className="recyclebin-grid-col recyclebin-grid-col-brand">
                          {product.brand_name || '-'}
                        </div>
                        <div className="recyclebin-grid-col recyclebin-grid-col-code">
                          {product.product_code || '-'}
                        </div>
                        <div className="recyclebin-grid-col recyclebin-grid-col-spec" title={product.specification}>
                          {product.specification || '-'}
                        </div>
                        <div className="recyclebin-grid-col recyclebin-grid-col-content">
                          {product.net_content || '-'}
                        </div>
                        <div className="recyclebin-grid-col recyclebin-grid-col-size">
                          {product.product_size || '-'}
                        </div>
                        <div className="recyclebin-grid-col recyclebin-grid-col-shipping">
                          {product.shipping_method || '-'}
                        </div>
                        <div className="recyclebin-grid-col recyclebin-grid-col-ship-spec">
                          {product.shipping_spec || '-'}
                        </div>
                        <div className="recyclebin-grid-col recyclebin-grid-col-ship-size">
                          {product.shipping_size || '-'}
                        </div>
                        <div className="recyclebin-grid-col recyclebin-grid-col-price-tier">
                          {renderPriceTiers(product.price_tiers)}
                        </div>
                        <div className="recyclebin-grid-col recyclebin-grid-col-material">
                          {hasMaterial ? (
                            <Button 
                              type="link" 
                              icon={<DownloadOutlined />} 
                              onClick={() => handleDownloadMaterial(product)}
                            />
                          ) : (
                            <span className="recyclebin-no-material">暂无</span>
                          )}
                        </div>
                        <div className="recyclebin-grid-col recyclebin-grid-col-url">
                          {product.product_url ? (
                            <Button 
                              type="link" 
                              icon={<EyeOutlined />} 
                              onClick={() => window.open(product.product_url, '_blank')}
                            />
                          ) : (
                            <span className="recyclebin-no-url">暂无</span>
                          )}
                        </div>
                        <div className="recyclebin-grid-col recyclebin-grid-col-restore">
                          <Button
                            type="link"
                            icon={<UndoOutlined />}
                            style={{ color: '#52c41a' }}
                            onClick={() => handleRestore(item)}
                          />
                        </div>
                        <div className="recyclebin-grid-col recyclebin-grid-col-delete">
                          <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(item)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="recyclebin-product-grid-empty">
              <Empty description={loading ? '加载中...' : '回收站中没有产品'} />
            </div>
          )}
        </Spin>
      </div>
      
      {/* 分页控件 */}
      {pagination.total > 0 && (
        <div className="recyclebin-product-grid-pagination">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 条记录`}
          />
        </div>
      )}
      
      {/* 图片预览模态框 */}
      <Modal
        title={previewTitle}
        footer={null}
        open={previewVisible}
        onCancel={handlePreviewCancel}
        centered
        width="auto"
        styles={{
          body: { padding: 0 }
        }}
        style={{ maxWidth: '90vw' }}
        wrapClassName="product-image-preview-modal"
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '200px',
          minWidth: '300px',
          maxHeight: '80vh',
          overflow: 'auto'
        }}>
          {previewLoading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Spin size="large" tip="图片加载中..." />
            </div>
          ) : (
            <img 
              alt={previewTitle} 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '80vh', 
                objectFit: 'contain' 
              }} 
              src={previewImage} 
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

// 使用App组件包装，提供消息通知和模态框功能
const RecycleBinWithApp = () => (
  <App>
    <RecycleBin />
  </App>
);

export default RecycleBinWithApp; 