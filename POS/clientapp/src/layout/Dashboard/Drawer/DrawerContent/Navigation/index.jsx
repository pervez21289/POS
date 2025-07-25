// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import NavGroup from './NavGroup';
/*import menuItem from 'menu-items';*/
import { useSelector } from 'react-redux';
import { useState, useMemo } from 'react';
// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
    const [menuItem, setMenuItems] = useState([]);
    const { userDetails } = useSelector((state) => state.users);

    useMemo(() => {
        if (userDetails) {
            const menuItemsData = JSON.parse(userDetails?.menus);
            setMenuItems(menuItemsData);
        }
    }, [userDetails])

    return (<Box sx={{ pt: 2 }}>
        {menuItem?.items?.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Fix - Navigation Group
                    </Typography>
                );
        }
    })}</Box>
    );
}
