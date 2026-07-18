import React, { useState } from 'react';
import {
    Paper, Typography, Stack, Chip, IconButton, Button, Avatar, Divider, Badge,
    useTheme, Box, Menu, MenuItem, ListItemIcon, ListItemText,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PrintIcon from '@mui/icons-material/Print';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import SaveIcon from '@mui/icons-material/Save';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Top gradient bar: current table, KOT/order actions, printing actions, and (on mobile) the cart toggle.
const POSHeader = ({
    selectedTable,
    isMobile,
    cartItemCount,
    onSaveKOT,
    onViewKOTs,
    onNewOrder,
    onPrintOrder,
    onTestPrinter,
    onOpenPrinterSettings,
    onToggleCartDrawer,
}) => {
    const theme = useTheme();
    const [menuAnchor, setMenuAnchor] = useState(null);

    const gradientSx = {
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
    };

    const runFromMenu = (fn) => {
        setMenuAnchor(null);
        fn?.();
    };

    // ---------- Mobile: only the actions someone needs at a glance are visible;
    // everything else lives one tap away in the overflow menu, so nothing wraps
    // into a messy multi-row button soup on a narrow screen. ----------
    if (isMobile) {
        return (
            <Paper
                elevation={0}
                sx={{ p: 1, mb: 1.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 1, ...gradientSx }}
            >
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 34, height: 34, flexShrink: 0 }}>
                    <RestaurantIcon fontSize="small" />
                </Avatar>

                <Chip
                    icon={<ReceiptIcon />}
                    label={`Table ${selectedTable || '--'}`}
                    size="small"
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 'bold',
                        '& .MuiChip-icon': { color: 'white' },
                    }}
                />

                <Button
                    variant="contained"
                    size="small"
                    onClick={onNewOrder}
                    sx={{
                        bgcolor: '#4caf50',
                        '&:hover': { bgcolor: '#388e3c' },
                        textTransform: 'none',
                        minWidth: 0,
                        px: 1.25,
                        flexShrink: 0,
                    }}
                >
                    New
                </Button>

                <Box sx={{ flex: 1 }} />

                <IconButton
                    onClick={onToggleCartDrawer}
                    sx={{ color: 'white', width: 40, height: 40, flexShrink: 0 }}
                    aria-label="View cart"
                >
                    <Badge badgeContent={cartItemCount || 0} color="error">
                        <ShoppingCartIcon />
                    </Badge>
                </IconButton>

                <IconButton
                    onClick={(e) => setMenuAnchor(e.currentTarget)}
                    sx={{ color: 'white', width: 40, height: 40, flexShrink: 0 }}
                    aria-label="More actions"
                >
                    <MoreVertIcon />
                </IconButton>

                <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={() => setMenuAnchor(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MenuItem onClick={() => runFromMenu(onSaveKOT)}>
                        <ListItemIcon><SaveIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>Save KOT</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => runFromMenu(onViewKOTs)}>
                        <ListItemIcon><ListAltIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>View KOTs</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => runFromMenu(onPrintOrder)}>
                        <ListItemIcon><PrintIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>Print KOT</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => runFromMenu(onTestPrinter)}>
                        <ListItemIcon><PrintOutlinedIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>Test Printer</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => runFromMenu(onOpenPrinterSettings)}>
                        <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>Printer Settings</ListItemText>
                    </MenuItem>
                </Menu>
            </Paper>
        );
    }

    // ---------- Desktop / tablet: full action row ----------
    return (
        <Paper
            elevation={0}
            sx={{ p: 1.5, mb: 1.5, borderRadius: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, ...gradientSx }}
        >
            <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 36, height: 36 }}>
                    <RestaurantIcon />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">POS</Typography>
            </Stack>

            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />

            <Chip
                icon={<ReceiptIcon />}
                label={`Table ${selectedTable || '--'}`}
                sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold',
                    '& .MuiChip-icon': { color: 'white' },
                }}
            />

            <Stack direction="row" spacing={1} sx={{ flex: 1, flexWrap: 'wrap' }}>
                <Button
                    variant="contained"
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                    onClick={onSaveKOT}
                >
                    Save KOT
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                    onClick={onViewKOTs}
                >
                    View KOTs
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={onNewOrder}
                    sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
                >
                    New Order
                </Button>

                {/* Print Buttons */}
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<PrintIcon />}
                    onClick={onPrintOrder}
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                    }}
                >
                    Print KOT
                </Button>

                <Button
                    variant="contained"
                    size="small"
                    onClick={onTestPrinter}
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                    }}
                >
                    Test Printer
                </Button>

                <IconButton
                    size="small"
                    onClick={onOpenPrinterSettings}
                    sx={{ color: 'white' }}
                >
                    <SettingsIcon />
                </IconButton>
            </Stack>
        </Paper>
    );
};

export default POSHeader;
