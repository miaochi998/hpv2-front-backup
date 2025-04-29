import React from 'react';
import { Button, Input, Select, Table, Pagination, Typography } from 'antd';
import { PlusOutlined, ShareAltOutlined, DownloadOutlined, EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import styles from './ProductManagement.module.css';

const { Title } = Typography;
const { Option } = Select;

const columns = [
  { title: <div className={styles.center}>序号</div>, dataIndex: 'index', key: 'index', align: 'center' },
  { title: <div className={styles.center}>图片</div>, dataIndex: 'image', key: 'image', align: 'center', render: () => <div className={styles.imgPlaceholder}></div> },
  { title: <div className={styles.center}>名称</div>, dataIndex: 'name', key: 'name', align: 'center' },
  { title: <div className={styles.center}>品牌</div>, dataIndex: 'brand', key: 'brand', align: 'center' },
  { title: <div className={styles.center}>货号</div>, dataIndex: 'code', key: 'code', align: 'center' },
  { title: <div className={styles.center}>规格</div>, dataIndex: 'spec', key: 'spec', align: 'center' },
  { title: <div className={styles.center}>净含量</div>, dataIndex: 'net', key: 'net', align: 'center' },
  { title: <div className={styles.center}>产品尺寸</div>, dataIndex: 'size', key: 'size', align: 'center' },
  { title: <div className={styles.center}>装箱方式</div>, dataIndex: 'packType', key: 'packType', align: 'center' },
  { title: <div className={styles.center}>装箱规格</div>, dataIndex: 'packSpec', key: 'packSpec', align: 'center' },
  { title: <div className={styles.center}>装箱尺寸</div>, dataIndex: 'packSize', key: 'packSize', align: 'center' },
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
    dataIndex: 'price', 
    key: 'price', 
    align: 'center', 
    render: () => (
      <div className={styles.priceTiersCell}>
        <div className={styles.priceTierRow}>
          <span className={styles.tierQty}>≤200包</span>
          <span className={styles.tierRowDivider}></span>
          <span className={styles.tierPrice}>2.6元/包</span>
        </div>
        <div className={styles.priceTierRow}>
          <span className={styles.tierQty}>≤3000包</span>
          <span className={styles.tierRowDivider}></span>
          <span className={styles.tierPrice}>2.2元/包</span>
        </div>
        <div className={styles.priceTierRow}>
          <span className={styles.tierQty}>≤8000包</span>
          <span className={styles.tierRowDivider}></span>
          <span className={styles.tierPrice}>1.8元/包</span>
        </div>
      </div>
    )
  },
  { title: <div className={styles.center}>素材包</div>, dataIndex: 'material', key: 'material', align: 'center', render: () => <Button type="link" icon={<DownloadOutlined />} /> },
  { title: <div className={styles.center}>产品链接</div>, dataIndex: 'link', key: 'link', align: 'center', render: () => <Button type="link" icon={<EyeOutlined />} /> },
  { title: <div className={styles.center}>编辑</div>, dataIndex: 'edit', key: 'edit', align: 'center', render: () => <Button type="link" icon={<EditOutlined />} /> },
  { title: <div className={styles.center}>放入回收站</div>, dataIndex: 'recycle', key: 'recycle', align: 'center', render: () => <Button type="link">放入回收站</Button> },
  { title: <div className={styles.center}>删除</div>, dataIndex: 'delete', key: 'delete', align: 'center', render: () => <Button type="link" danger icon={<DeleteOutlined />} /> },
];

const dataSource = Array.from({ length: 10 }).map((_, i) => ({
  key: i + 1,
  index: i + 1,
  image: '',
  name: '纳米魔力擦',
  brand: '帮你',
  code: 'BN000235',
  spec: '10x6x2cm/片',
  net: '20片/包',
  size: '20x2x40cm/包',
  packType: '纸箱',
  packSpec: '60包/箱',
  packSize: '152x52x69cm',
  price: '',
  material: '',
  link: '',
  updateTime: '2025/03/26',
}));

const ProductManagement = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const isAdmin = user?.is_admin;
  
  // 如果未认证，返回null（让路由系统处理重定向）
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Title level={3}>{isAdmin ? '公司总货盘管理' : '我的货盘管理'}</Title>
      <div className={styles.toolbar}>
        <Input.Search placeholder="支持按产品名称、产品货号查询" style={{ width: 300, marginRight: 16 }} />
        <Select placeholder="全部品牌" style={{ width: 180, marginRight: 16 }}>
          <Option value="">全部品牌</Option>
          <Option value="帮你">帮你</Option>
        </Select>
        <div className={styles.toolbarRight}>
          <Button type="primary" icon={<PlusOutlined />} style={{ marginRight: 16 }}>添加产品</Button>
          <Button icon={<ShareAltOutlined />} className={styles.shareBtn}>分享货盘</Button>
        </div>
      </div>
      <Table
        className={styles.table}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
        scroll={{ x: 'max-content' }}
      />
      <div className={styles.paginationWrap}>
        <span className={styles.totalText}>共计 3256 条记录</span>
        <Pagination current={1} total={3256} pageSize={10} showSizeChanger showQuickJumper />
      </div>
    </div>
  );
};

export default ProductManagement; 