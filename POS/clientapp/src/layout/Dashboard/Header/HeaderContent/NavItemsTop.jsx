import React,{ useState, useMemo } from 'react';

import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

import { getMuiIcon } from '../../../../components/getMuiIcon';
import { Link, useLocation, matchPath } from 'react-router-dom';

const NavItemsTop = ({ item }) => {
    const drawerOpen = true;
    const isParents = false;
    const { pathname } = useLocation();
    const isSelected = !!matchPath({ path: item?.link ? item.link : item.url, end: false }, pathname);

    const textColor = 'text.primary';
    const iconSelectedColor = 'primary.main';

    const level = 1;


    const Icon = getMuiIcon(item.icon);
    let itemIcon = null;
    if (Icon) {
        itemIcon = (
            <Icon
                style={{
                    fontSize: drawerOpen ? '1rem' : '1.25rem',
                    ...(isParents && { fontSize: 20, stroke: '1.5' })
                }}
            />
        );
    }


    return (
        <ListItemButton
            key={item.id}
            component={Link}
            to={item.url}
         
            disabled={item.disabled}
            selected={isSelected}
            sx={(theme) => ({
                zIndex: 1201,
                pl: drawerOpen ? `${level * 28}px` : 1.5,
                py: !drawerOpen && level === 1 ? 1.25 : 1,
                display: 'flex',
                justifyContent: 'center',
                ...(drawerOpen && {
                    '&:hover': { bgcolor: 'primary.lighter', ...theme.applyStyles('dark', { bgcolor: 'divider' }) },
                    '&.Mui-selected': {
                        bgcolor: 'primary.lighter',
                        ...theme.applyStyles('dark', { bgcolor: 'divider' }),
                        border: '1px solid',
                        borderColor: 'primary.main',
                        color: iconSelectedColor,
                        '&:hover': { color: iconSelectedColor, bgcolor: 'primary.lighter', ...theme.applyStyles('dark', { bgcolor: 'divider' }) }
                    }
                }),
                ...(!drawerOpen && {
                    '&:hover': { bgcolor: 'transparent' },
                    '&.Mui-selected': { '&:hover': { bgcolor: 'transparent' }, bgcolor: 'transparent' }
                })
            })}
            
        >
            {itemIcon && (
                <ListItemIcon
                    sx={(theme) => ({
                        minWidth: 28,
                        color: isSelected ? iconSelectedColor : textColor,
                        display: 'flex',
                        justifyContent: 'center',
                        ...(!drawerOpen && {
                            borderRadius: 1.5,
                            width: 36,
                            height: 36,
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': { bgcolor: 'secondary.lighter', ...theme.applyStyles('dark', { bgcolor: 'secondary.light' }) }
                        }),
                        ...(!drawerOpen &&
                            isSelected && {
                            bgcolor: 'primary.lighter',
                            ...theme.applyStyles('dark', { bgcolor: 'primary.900' }),
                            '&:hover': { bgcolor: 'primary.lighter', ...theme.applyStyles('dark', { bgcolor: 'primary.darker' }) }
                        })
                    })}
                >
                    {itemIcon}
                </ListItemIcon>
            )}
           
           
        </ListItemButton>
    )

}


export default NavItemsTop;
