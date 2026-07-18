import React from 'react';
import { Paper, Typography, Stack, IconButton, Box, Button } from '@mui/material';
import TableBarIcon from '@mui/icons-material/TableBar';
import TableCard from './TableCard';

// Grid of saved KOTs/tables, collapsible via a "Show/Hide" toggle.
// On mobile it becomes a horizontally-scrolling strip instead of a wrapping
// grid, so it doesn't eat vertical space that the product grid needs.
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
                sx={{ mb: 1.5, borderRadius: 2, textTransform: 'none', minHeight: 40 }}
            >
                Show Active Tables ({draftCarts.length})
            </Button>
        );
    }

    return (
        <Paper elevation={2} sx={{ p: { xs: 1.5, sm: 2 }, mb: 1.5, borderRadius: 3, bgcolor: 'white' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <TableBarIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                        Active Tables ({draftCarts.length})
                    </Typography>
                </Stack>
                <IconButton
                    size="small"
                    onClick={() => onToggleShow(false)}
                    sx={{ color: 'text.secondary', width: 36, height: 36 }}
                >
                    <Typography variant="caption" sx={{ mr: 0.5 }}>Hide</Typography>
                </IconButton>
            </Stack>

            <Box
                sx={{
                    display: 'grid',
                    gridAutoFlow: { xs: 'column', sm: 'row' },
                    gridAutoColumns: { xs: '38%', sm: 'unset' },
                    gridTemplateColumns: {
                        sm: 'repeat(3, 1fr)',
                        md: 'repeat(4, 1fr)',
                        lg: 'repeat(6, 1fr)',
                    },
                    gap: { xs: 1.25, sm: 2 },
                    overflowX: { xs: 'auto', sm: 'visible' },
                    pb: { xs: 0.5, sm: 0 },
                    scrollSnapType: { xs: 'x mandatory', sm: 'none' },
                    '& > *': { scrollSnapAlign: { xs: 'start', sm: 'unset' } },
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
