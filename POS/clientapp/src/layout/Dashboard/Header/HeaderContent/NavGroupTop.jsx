import React,{ useState, useMemo } from 'react';
import Typography from '@mui/material/Typography';
import NavItemsTop from './NavItemsTop';

const NavGroupTop = ({item })=>{
        const navCollapse = item.children?.map((menuItem) => {
            switch (menuItem.type) {
                case 'collapse':
                    return (
                        <Typography key={menuItem.id} variant="caption" color="error" sx={{ p: 2.5 }}>
                            collapse - only available in paid version
                        </Typography>
                    );
                case 'item':
                    return (menuItem.title == "Help")?<></>:< NavItemsTop key = { menuItem.id } item = { menuItem } ></NavItemsTop >;
                default:
                    return (
                        <Typography key={menuItem.id} variant="h6" color="error" align="center">
                            Fix - Group Collapse or Items
                        </Typography>
                    );
            }
        });

    return (<>{ navCollapse }</>);
}


export default NavGroupTop;
