import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Chip,
    IconButton,
    Button,
    Avatar,
    Badge,
    Box,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Tooltip,
    useTheme,
    useMediaQuery,
    Stack,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
    const [printMenuAnchor, setPrintMenuAnchor] = useState(null);
    const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);

    const handlePrintMenuOpen = (event) => setPrintMenuAnchor(event.currentTarget);
    const handlePrintMenuClose = () => setPrintMenuAnchor(null);

    const handleMoreMenuOpen = (event) => setMoreMenuAnchor(event.currentTarget);
    const handleMoreMenuClose = () => setMoreMenuAnchor(null);

    // Helper to close menu and execute action
    const runAction = (fn) => {
        handlePrintMenuClose();
        handleMoreMenuClose();
        fn?.();
    };

    // ---------- Shared sub‑components ----------
    const TableChip = () => (
        <Chip
            icon={<ReceiptIcon fontSize="small" />}
            label={`Table ${selectedTable || '—'}`}
            size="small"
            variant="outlined"
            sx={{
                fontWeight: 500,
                borderColor: 'divider',
                '& .MuiChip-icon': { color: 'text.secondary' },
            }}
        />
    );

    // Print dropdown menu items (reused for both desktop and mobile)
    const PrintMenuItems = () => (
        <>
            <MenuItem onClick={() => runAction(onPrintOrder)}>
                <ListItemIcon><PrintIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Print KOT</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => runAction(onTestPrinter)}>
                <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Test Printer</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => runAction(onOpenPrinterSettings)}>
                <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Printer Settings</ListItemText>
            </MenuItem>
        </>
    );

    // More menu items - only print options now
    const MoreMenuItems = () => (
        <>
            <PrintMenuItems />
        </>
    );

    // ---------- Mobile View ----------
    if (isMobile) {
        return (
            <Paper
                elevation={1}
                sx={{
                    px: 1.5,
                    py: 1,
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    flexWrap: 'wrap',
                    gap: 0.5,
                }}
            >
                {/* Left: Table chip */}
                <TableChip />

                {/* Right: All action buttons */}
                <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap">
                    {/* Save KOT - now visible */}
                    <Tooltip title="Save KOT">
                        <IconButton
                            onClick={onSaveKOT}
                            size="small"
                            color="primary"
                        >
                            <SaveIcon />
                        </IconButton>
                    </Tooltip>

                    {/* View KOTs - now visible */}
                    <Tooltip title="View KOTs">
                        <IconButton
                            onClick={onViewKOTs}
                            size="small"
                            color="primary"
                        >
                            <ListAltIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="New Order">
                        <IconButton
                            color="primary"
                            onClick={onNewOrder}
                            size="small"
                            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Cart">
                        <IconButton onClick={onToggleCartDrawer} size="small">
                            <Badge badgeContent={cartItemCount || 0} color="error">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    {/* More menu - now only contains print options */}
                    <Tooltip title="More">
                        <IconButton onClick={handleMoreMenuOpen} size="small">
                            <MoreVertIcon />
                        </IconButton>
                    </Tooltip>

                    <Menu
                        anchorEl={moreMenuAnchor}
                        open={Boolean(moreMenuAnchor)}
                        onClose={handleMoreMenuClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <MoreMenuItems />
                    </Menu>
                </Stack>
            </Paper>
        );
    }

    // ---------- Desktop / Tablet View ----------
    return (
        <Paper
            elevation={1}
            sx={{
                px: 2,
                py: 1.25,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 2,
                bgcolor: 'background.paper',
                flexWrap: 'wrap',
                gap: 1,
            }}
        >
            {/* Left: Brand + Table */}
            <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                    <RestaurantIcon sx={{ fontSize: 20, color: 'white' }} />
                </Avatar>
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                    POS
                </Typography>
                <Divider orientation="vertical" flexItem sx={{ borderColor: 'divider' }} />
                <TableChip />
            </Stack>

            {/* Right: Actions */}
            <Stack direction="row" spacing={1} alignItems="center">
                {/* Save & View KOTs – text buttons with icons */}
                <Button
                    variant="text"
                    size="small"
                    startIcon={<SaveIcon />}
                    onClick={onSaveKOT}
                    sx={{ textTransform: 'none', fontWeight: 500 }}
                >
                    Save
                </Button>
                <Button
                    variant="text"
                    size="small"
                    startIcon={<ListAltIcon />}
                    onClick={onViewKOTs}
                    sx={{ textTransform: 'none', fontWeight: 500 }}
                >
                    View KOTs
                </Button>

                <Divider orientation="vertical" flexItem sx={{ borderColor: 'divider' }} />

                {/* New Order – primary contained button */}
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={onNewOrder}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                    New Order
                </Button>

                {/* Print dropdown */}
                <Button
                    variant="outlined"
                    size="small"
                    endIcon={<ExpandMoreIcon />}
                    onClick={handlePrintMenuOpen}
                    sx={{ textTransform: 'none', fontWeight: 500 }}
                >
                    <PrintIcon sx={{ mr: 0.5 }} /> Print
                </Button>
                <Menu
                    anchorEl={printMenuAnchor}
                    open={Boolean(printMenuAnchor)}
                    onClose={handlePrintMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <PrintMenuItems />
                </Menu>

                {/* Cart with badge */}
                <Tooltip title="Cart">
                    <IconButton onClick={onToggleCartDrawer} size="small" sx={{ ml: 0.5 }}>
                        <Badge badgeContent={cartItemCount || 0} color="error">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                </Tooltip>
            </Stack>
        </Paper>
    );
};

export default POSHeader;