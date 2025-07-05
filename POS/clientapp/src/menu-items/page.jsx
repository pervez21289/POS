// assets
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';

// icons
const icons = {
    CategoryOutlined: CategoryOutlinedIcon,
    InventoryOutlined: InventoryOutlinedIcon
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
            icon: icons.CategoryOutlined
        },
        {
            id: 'inventory-product',
            title: 'Product',
            type: 'item',
            url: '/product',
            icon: icons.InventoryOutlined
        },
    ]
};

export default pages;