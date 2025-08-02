import { useState } from 'react';
import { useNavigate } from 'react-router';

// material-ui
import List from '@mui/material/List';
import Link from '@mui/material/Link';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
// assets
import CommentOutlined from '@ant-design/icons/CommentOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import UnorderedListOutlined from '@ant-design/icons/UnorderedListOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "./../../../../../store/reducers/users";
// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

export default function SettingTab() {
    const navigate = useNavigate();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { userDetails } = useSelector((state) => state.users);
    const dispatch = useDispatch();
    const handleListItemClick = (event, index, route = '') => {
        setSelectedIndex(index);

        if (route && route !== '') {
            navigate(route);
        }
    };

    const handleLogout = async () => {

        window.localStorage.removeItem('userDetails',);
        dispatch(setUserDetails({ userDetails: null }));
    };

    const handlePrinter = () => {
        window.ReactNativeWebView?.postMessage('OPEN_SETTINGS');
    }

    return (
        <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>

            {(userDetails?.role?.indexOf('SuperAdmin') > -1) && (<>< ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0, 'usermanagement')}>
                <ListItemIcon>
                    <ManageAccountsOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="User Management" />
            </ListItemButton>


                <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1, 'settings')}>
                    <ListItemIcon>
                        <UserOutlined />
                    </ListItemIcon>
                    <ListItemText primary="Account Settings" />
                </ListItemButton>

                <ListItemButton selected={selectedIndex === 3} onClick={(event) => handleListItemClick(event, 3, 'history')}>
                    <ListItemIcon>
                        <UnorderedListOutlined />
                    </ListItemIcon>
                    <ListItemText primary="History" />
                </ListItemButton>
            </>)
            }
            <ListItemButton selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2, 'support')}>
                <ListItemIcon>
                    <LockOutlined />
                </ListItemIcon>
                <ListItemText primary="Support" />
            </ListItemButton>



            <ListItemButton selected={selectedIndex === 4} onClick={handlePrinter}>
                <ListItemIcon>
                    <UnorderedListOutlined />
                </ListItemIcon>
                <ListItemText primary="Printer" />
            </ListItemButton>
            <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                    <LogoutOutlined />
                </ListItemIcon>
                <ListItemText primary="Logout" />
            </ListItemButton>
        </List>
    );
}
