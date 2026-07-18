import React from 'react';
import { Paper, Typography, Stack, IconButton, Box, Button } from '@mui/material';
import TableBarIcon from '@mui/icons-material/TableBar';
import TableCard from './TableCard';

// Grid of saved KOTs/tables, collapsible via a "Show/Hide" toggle.
const ActiveTablesSection = ({
    draftCarts,
    selectedTable,
    showTableLayout,
    onToggleShow,
    onSelectTable,
    onDeleteTable,
    onPrintKOT,
}) => {
    if (!draftCarts.length) return null;

    if (!showTableLayout) {
        return (
            <Button
                variant="outlined"
                size="small"
                startIcon={<TableBarIcon />}
                onClick={() => onToggleShow(true)}
                sx={{ mb: 1.5, borderRadius: 2, textTransform: 'none' }}
            >
                Show Active Tables ({draftCarts.length})
            </Button>
        );
    }

    return (
        <Paper elevation={2} sx={{ p: 2, mb: 1.5, borderRadius: 3, bgcolor: 'white' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <TableBarIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                        Active Tables ({draftCarts.length})
                    </Typography>
                </Stack>
                <IconButton size="small" onClick={() => onToggleShow(false)} sx={{ color: 'text.secondary' }}>
                    <Typography variant="caption" sx={{ mr: 0.5 }}>Hide</Typography>
                </IconButton>
            </Stack>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'repeat(2, 1fr)',
                        sm: 'repeat(3, 1fr)',
                        md: 'repeat(4, 1fr)',
                        lg: 'repeat(6, 1fr)',
                    },
                    gap: 2,
                }}
            >
                {draftCarts.map((draft) => (
                    <TableCard
                        key={draft.tableNo}
                        tableNo={draft.tableNo}
                        items={draft.saleItems}
                        isSelected={selectedTable === draft.tableNo}
                        onSelect={() => onSelectTable(draft.tableNo)}
                        onDelete={() => onDeleteTable(draft.tableNo)}
                        onPrintKOT={onPrintKOT}
                    />
                ))}
            </Box>
        </Paper>
    );
};

export default ActiveTablesSection;
