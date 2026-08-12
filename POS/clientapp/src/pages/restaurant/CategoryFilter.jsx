import React from 'react';
import { Box, Chip, Skeleton } from '@mui/material';

const CategoryFilter = ({ categories, selectedCategory, onChange, loading }) => {
    if (loading) {
        return (
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', py: 0.5, flexWrap: 'nowrap' }}>
                {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} variant="rounded" width={70} height={28} />
                ))}
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 0.75,
                overflowX: 'auto',
                py: 0.5,           // 👈 reduced from 1
                flexWrap: 'nowrap',
                '&::-webkit-scrollbar': { height: 4 },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.300', borderRadius: 2 },
            }}
        >
            <Chip
                label="All"
                clickable
                size="small"       // 👈 smaller chip
                color={selectedCategory === null ? 'primary' : 'default'}
                variant={selectedCategory === null ? 'filled' : 'outlined'}
                onClick={() => onChange(null)}
                sx={{ flexShrink: 0 }}
            />
            {categories.map(cat => (
                <Chip
                    key={cat.categoryID}
                    label={cat.categoryName}
                    clickable
                    size="small"   // 👈 smaller chip
                    color={selectedCategory === cat.categoryID ? 'primary' : 'default'}
                    variant={selectedCategory === cat.categoryID ? 'filled' : 'outlined'}
                    onClick={() => onChange(cat.categoryID)}
                    sx={{ flexShrink: 0 }}
                />
            ))}
        </Box>
    );
};

export default CategoryFilter;