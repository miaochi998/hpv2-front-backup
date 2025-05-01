import React from 'react';
import { Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { getImageUrl } from '@/config/urls';
import './ProductCard.css';

/**
 * 产品卡片组件 - 用于网格视图模式
 */
const ProductCard = ({
  product,
  onEdit,
  onDelete,
  onImagePreview,
  onDownloadMaterial,
  onMoveToRecycleBin
}) => {
  // 获取产品主图
  const getProductMainImage = () => {
    if (!product.attachments || !Array.isArray(product.attachments)) return null;
    
    // 查找产品图片附件(类型为IMAGE)
    const imageAttachment = product.attachments.find(
      attachment => attachment.file_type === 'IMAGE'
    );
    
    // 有图片时返回图片URL
    if (imageAttachment && imageAttachment.file_path) {
      return getImageUrl(imageAttachment.file_path);
    }
    
    return null;
  };

  // 格式化价格
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '-';
    return `¥${parseFloat(price).toFixed(2)}`;
  };

  // 获取最低价格
  const getLowestPrice = () => {
    if (!product.price_tiers || !Array.isArray(product.price_tiers) || product.price_tiers.length === 0) {
      return '暂无价格';
    }
    
    // 找到最低价格
    const lowestPriceTier = product.price_tiers.reduce(
      (lowest, current) => 
        (current.price && (!lowest.price || parseFloat(current.price) < parseFloat(lowest.price))) 
          ? current 
          : lowest,
      { price: null }
    );
    
    return lowestPriceTier.price ? lowestPriceTier.price : '暂无价格';
  };

  // 渲染产品图片
  const renderProductImage = () => {
    const imageUrl = getProductMainImage();
    
    if (!imageUrl) {
      return <div className="product-card-image-placeholder">暂无图片</div>;
    }
    
    return (
      <div 
        className="product-card-image"
        onClick={() => onImagePreview(imageUrl, product.name)}
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="product-card-image-overlay">
          <EyeOutlined />
        </div>
      </div>
    );
  };

  // 渲染价格档位
  const renderPriceTiers = () => {
    if (!product.price_tiers || !Array.isArray(product.price_tiers) || product.price_tiers.length === 0) {
      return <div className="product-card-price-empty">暂无价格档位</div>;
    }

    return (
      <div className="product-card-price-tiers">
        <div className="product-card-price-title">产品订购价格</div>
        <div className="product-card-price-header">
          <span className="price-tier-qty-header">订购数量</span>
          <span className="price-tier-price-header">单价</span>
        </div>
        {product.price_tiers.map((tier, index) => (
          <div key={tier.id || index} className="product-card-price-row">
            <span className="price-tier-qty">{`≤${tier.quantity}`}</span>
            <span className="price-tier-price">{tier.price}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="product-card">
      <div className="product-card-header">
        <div className="product-card-index">{product.index}</div>
        <div className="product-card-actions">
          <Tooltip title="编辑">
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              onClick={() => onEdit(product)}
              className="product-card-action-btn"
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button 
              type="link" 
              danger
              icon={<DeleteOutlined />} 
              onClick={() => onDelete(product.id)}
              className="product-card-action-btn"
            />
          </Tooltip>
        </div>
      </div>
      
      {renderProductImage()}
      
      <div className="product-card-content">
        <h3 className="product-card-name" title={product.name}>
          {product.name}
        </h3>
        
        <div className="product-card-info">
          <div className="product-card-info-item">
            <span className="product-card-label">品牌:</span>
            <span className="product-card-value">{product.brand_name || '-'}</span>
          </div>
          
          <div className="product-card-info-item">
            <span className="product-card-label">货号:</span>
            <span className="product-card-value">{product.product_code || '-'}</span>
          </div>
          
          <div className="product-card-info-item">
            <span className="product-card-label">规格:</span>
            <span className="product-card-value" title={product.specification}>{product.specification || '-'}</span>
          </div>
          
          <div className="product-card-info-item">
            <span className="product-card-label">净含量:</span>
            <span className="product-card-value">{product.net_content || '-'}</span>
          </div>

          <div className="product-card-info-item">
            <span className="product-card-label">产品尺寸:</span>
            <span className="product-card-value">{product.product_size || '-'}</span>
          </div>
          
          <div className="product-card-info-item">
            <span className="product-card-label">装箱方式:</span>
            <span className="product-card-value">{product.shipping_method || '-'}</span>
          </div>
          
          <div className="product-card-info-item">
            <span className="product-card-label">装箱规格:</span>
            <span className="product-card-value">{product.shipping_spec || '-'}</span>
          </div>

          <div className="product-card-info-item">
            <span className="product-card-label">装箱尺寸:</span>
            <span className="product-card-value">{product.shipping_size || '-'}</span>
          </div>
          
          {product.product_url && (
            <div className="product-card-info-item">
              <span className="product-card-label">产品链接:</span>
              <span className="product-card-value">
                <Button 
                  type="link" 
                  size="small"
                  style={{ padding: 0, height: 'auto' }}
                  onClick={() => window.open(product.product_url, '_blank')}
                >
                  查看链接
                </Button>
              </span>
            </div>
          )}
        </div>
        
        {renderPriceTiers()}
      </div>
      
      <div className="product-card-footer">
        {/* 检查是否有素材包 - 查找类型为MATERIAL的附件 */}
        {product.attachments?.find(attachment => attachment.file_type === 'MATERIAL') ? (
          <Button 
            type="link" 
            icon={<DownloadOutlined />} 
            onClick={() => onDownloadMaterial(product)}
            className="product-card-material-btn"
          >
            下载素材
          </Button>
        ) : (
          <span className="product-card-no-material">暂无素材</span>
        )}
        
        <Button 
          type="link"
          onClick={() => onMoveToRecycleBin(product.id)}
          className="product-card-recycle-btn"
        >
          放入回收站
        </Button>
      </div>
    </div>
  );
};

export default ProductCard; 