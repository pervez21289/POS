// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
    id: 'Inventory',
  title: 'Inventory',
  type: 'group',
  children: [
      {
          id: 'inventory-category',
          title: 'Category',
          type: 'item',
          url: '/category',
          icon: icons.FontSizeOutlined
      },
      {
          id: 'inventory-product',
          title: 'Product',
          type: 'item',
          url: '/product',
          icon: icons.FontSizeOutlined
      },
  ]
};

export default pages;
