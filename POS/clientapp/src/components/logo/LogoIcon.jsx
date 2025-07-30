// material-ui
import { useTheme } from '@mui/material/styles';
import logoIconDark from 'assets/images/logo.png';
import logoIcon from 'assets/images/logo.png';

// ==============================|| LOGO ICON IMAGE ||============================== //

export default function LogoIcon() {


    return (
        <img
            src={ logoIcon}
            alt="Mantis"
            width="50"
        />
    );
}
