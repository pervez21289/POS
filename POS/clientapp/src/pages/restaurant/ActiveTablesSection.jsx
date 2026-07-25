import React from 'react';
import { Paper, Typography, Stack, IconButton, Box } from '@mui/material';
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
    // If no tables, render nothing
    if (!draftCarts.length) return null;

    // If collapsed, render nothing (the button is removed)
    if (!showTableLayout) return null;

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
                    display: { xs: 'flex', sm: 'grid' },
                    flexWrap: { xs: 'nowrap', sm: 'wrap' },
                    overflowX: { xs: 'auto', sm: 'visible' },
                    gap: { xs: 1.25, sm: 2 },
                    pb: { xs: 0.5, sm: 0 },
                    // Grid styles for sm and up
                    gridTemplateColumns: {
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)',
                    },
                    // Flex child sizing for mobile
                    '& > *': {
                        flex: { xs: '0 0 38%', sm: 'unset' },
                        scrollSnapAlign: { xs: 'start', sm: 'unset' },
                    },
                    scrollSnapType: { xs: 'x mandatory', sm: 'none' },
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