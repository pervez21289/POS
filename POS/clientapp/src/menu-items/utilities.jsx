// assets
import {
    PointOfSale as SalesIcon,
    Receipt as InvoiceIcon
} from '@mui/icons-material';

// icons
const icons = {
    SalesIcon,
    InvoiceIcon
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
    id: 'utilities',
    title: 'Utilities',
    type: 'group',
    children: [
        {
            id: 'util-sales',
            title: 'Sales',
            type: 'item',
            url: '/sales',
            icon: icons.SalesIcon
        },
        {
            id: 'util-invoice',
            title: 'Invoice',
            type: 'item',
            url: '/invoice',
            icon: icons.InvoiceIcon
        }
    ]
};

export default utilities;