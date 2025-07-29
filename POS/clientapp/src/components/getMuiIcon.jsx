// utils/getMuiIcon.js
import * as Icons from '@mui/icons-material';

export const getMuiIcon = (iconName) => {
    if (!iconName || typeof iconName !== 'string') return null;
    return Icons[iconName] || null;
};
