import React,{ useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import { useSelector } from 'react-redux';
import NavGroupTop from './NavGroupTop';


function AppBarNav() {
    const [menuItem, setMenuItems] = useState([]);
    const { userDetails } = useSelector((state) => state.users);

    useMemo(() => {
        if (userDetails) {
            const menuItemsData = JSON.parse(userDetails?.menus);
            setMenuItems(menuItemsData);
        }
    }, [userDetails])
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };



    return (
       
            <Box sx={{
                flexGrow: 1,
                width: '70%',             // take full width of navbar
                display: 'flex',
                justifyContent: 'center',  // center the menu items
                alignItems: 'center',      // center vertically
                flexWrap: 'nowrap'        // keep them in one line
               
            }}>
                {menuItem?.items?.map((item) => {
                    return <NavGroupTop key={item.id} item={item} />
                })}
            </Box>
        
    );
}
export default AppBarNav;
