// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

// project imports
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';
import AppBarNav from '../HeaderContent/AppBarNav';

// project import
import { GithubOutlined } from '@ant-design/icons';
import Logo from '../../../../components/logo/LogoMain';
// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
      <>
       
        {!downLG && <Logo />}
           <AppBarNav></AppBarNav>
     
      <Notification />
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
