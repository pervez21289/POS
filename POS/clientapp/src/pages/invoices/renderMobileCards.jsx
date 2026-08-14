import React from 'react';
import {
    Box,
    Typography,
    Stack,
    Chip,
    Card,
} from '@mui/material';

const renderMobileCards = (handleViewInvoice, rows) => (
    <Stack spacing={1}>
        {rows.map((row) => {
            const isPaid = row.p_Status?.toLowerCase() === 'paid';

            return (
                <Card
                    key={row.saleID}
                    elevation={0}
                    onClick={() => handleViewInvoice(row)}
                    sx={{
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: '#fff',
                        overflow: 'hidden',

                        // Makes the whole card feel tappable
                        cursor: 'pointer',
                        WebkitTapHighlightColor: 'transparent',

                        transition: 'all 0.15s ease',

                        '&:hover': {
                            borderColor: 'primary.light',
                            backgroundColor: 'rgba(25, 118, 210, 0.02)',
                        },

                        '&:active': {
                            transform: 'scale(0.985)',
                            backgroundColor: 'action.hover',
                        },
                    }}
                >
                    <Box sx={{ p: 1.1 }}>

                        {/* Row 1 */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                minWidth: 0,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '0.82rem',
                                    fontWeight: 700,
                                    color: 'text.primary',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {row.billNo}
                            </Typography>

                            <Typography
                                noWrap
                                sx={{
                                    flex: 1,
                                    minWidth: 0,
                                    fontSize: '0.72rem',
                                    color: 'text.secondary',
                                }}
                            >
                                {row.customerName || 'Walk-in Customer'}
                            </Typography>

                            <Chip
                                label={isPaid ? 'Paid' : 'Pending'}
                                size="small"
                                sx={{
                                    height: 20,
                                    borderRadius: 1,
                                    fontSize: '0.60rem',
                                    fontWeight: 700,
                                    flexShrink: 0,
                                    backgroundColor: isPaid
                                        ? 'rgba(46,125,50,0.10)'
                                        : 'rgba(237,108,2,0.10)',
                                    color: isPaid
                                        ? 'success.dark'
                                        : 'warning.dark',
                                    '& .MuiChip-label': {
                                        px: 0.8,
                                    },
                                }}
                            />
                        </Box>

                        {/* Row 2 */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mt: 0.65,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '0.95rem',
                                    fontWeight: 800,
                                    color: 'primary.main',
                                    lineHeight: 1,
                                }}
                            >
                                ₹{row.netAmount}
                            </Typography>

                            <Box
                                sx={{
                                    ml: 1.5,
                                    display: 'flex',
                                    gap: 1.25,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.65rem',
                                        color: 'text.secondary',
                                    }}
                                >
                                    Total ₹{row.totalAmount}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: '0.65rem',
                                        color: 'success.main',
                                    }}
                                >
                                    Disc ₹{row.discountAmount}
                                </Typography>
                            </Box>

                            <Typography
                                sx={{
                                    ml: 'auto',
                                    fontSize: '0.63rem',
                                    color: 'text.secondary',
                                }}
                            >
                                {row.saleTime}
                            </Typography>
                        </Box>

                    </Box>
                </Card>
            );
        })}
    </Stack>
);

export default renderMobileCards;