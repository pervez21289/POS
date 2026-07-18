import React from 'react';
import { Paper, Typography, Stack, Chip, IconButton, Avatar, Divider } from '@mui/material';
import TableBarIcon from '@mui/icons-material/TableBar';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';

const TableCard = ({ tableNo, items, isSelected, onSelect, onDelete, onPrintKOT }) => {
    const itemCount = items?.length || 0;
    const totalAmount = items?.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0) || 0;

    const handlePrintKOT = async (e) => {
        e.stopPropagation();
        await onPrintKOT(tableNo, items);
    };

    return (
        <Paper
            elevation={isSelected ? 8 : 2}
            sx={{
                p: 2, // unchanged
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: isSelected ? '2px solid' : '2px solid transparent',
                borderColor: isSelected ? 'primary.main' : 'transparent',
                bgcolor: isSelected ? 'primary.50' : 'white',
                position: 'relative',
                minHeight: 120, // unchanged
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                    bgcolor: isSelected ? 'primary.50' : 'grey.50',
                },
            }}
            onClick={onSelect}
        >
            {/* Header - unchanged */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                        sx={{
                            bgcolor: isSelected ? 'primary.main' : 'primary.light',
                            width: 36,
                            height: 36,
                        }}
                    >
                        <TableBarIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" color={isSelected ? 'primary.main' : 'text.primary'}>
                        Table {tableNo}
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5}>
                    <IconButton
                        size="small"
                        onClick={handlePrintKOT}
                        sx={{
                            color: 'primary.main',
                            '&:hover': { bgcolor: 'primary.lighter' },
                        }}
                        title="Print KOT"
                    >
                        <PrintIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        sx={{
                            color: 'error.main',
                            '&:hover': { bgcolor: 'error.lighter' },
                        }}
                        title="Delete"
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
            </Stack>

            <Divider sx={{ mb: 1 }} /> {/* unchanged */}

            {/* ✅ Only change: merged Items and Amount into one row, 
                but kept the exact same wrapper + spacing + flex */}
            <Stack spacing={0.5} flex={1} justifyContent="center">
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                        Items:
                        <Chip
                            label={itemCount}
                            size="small"
                            color={isSelected ? 'primary' : 'default'}
                            sx={{ height: 20, fontSize: '0.75rem' }}
                        />
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color={isSelected ? 'primary.main' : 'text.primary'}>
                        ₹{totalAmount.toFixed(2)}
                    </Typography>
                </Stack>
            </Stack>

            {/* Active badge - unchanged */}
            {isSelected && (
                <Chip
                    label="Active"
                    size="small"
                    color="primary"
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        height: 20,
                        fontSize: '0.65rem',
                    }}
                />
            )}
        </Paper>
    );
};

export default TableCard;