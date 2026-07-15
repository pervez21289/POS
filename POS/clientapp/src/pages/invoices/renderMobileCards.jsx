import React from 'react';
import {
    Box,
    Button,
    Typography,
    Stack,
    Chip,
    Card,
    CardContent
} from '@mui/material';

const renderMobileCards = (handleViewInvoice, rows) => (
    <Stack spacing={2}>
        {rows.map((row) => {
            const isPaid = row.p_Status?.toLowerCase() === 'paid';
            return (
                <Card key={row.saleID} variant="outlined">
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Chip
                                label={row.billNo}
                                color="primary"
                                variant="outlined"
                                sx={{ fontSize: '0.85rem', fontWeight: 'bold' }}
                            />
                        </Box>

                        <Typography variant="body2">
                            <strong>Customer:</strong> {row.customerName}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Sale Time:</strong> {row.saleTime}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Total:</strong> ₹{row.totalAmount}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Discount:</strong> ₹{row.discountAmount}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Net:</strong> ₹{row.netAmount}
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mt: 2,
                            }}
                        >
                            <Chip
                                label={isPaid ? 'Paid' : 'Not Paid'}
                                color={isPaid ? 'success' : 'error'}
                                variant="outlined"
                            />
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleViewInvoice(row)}
                            >
                                View Invoice
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            );
        })}
    </Stack>
);

export default renderMobileCards;
