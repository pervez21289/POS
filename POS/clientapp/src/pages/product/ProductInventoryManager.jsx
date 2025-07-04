import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    Alert,
    CircularProgress,
} from '@mui/material';
import { useAdjustStockMutation, useGetInventoryLogsQuery } from '../../services/productApi';

const ProductInventoryManager = ({ product }) => {
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [adjustStock, { isLoading: isAdjusting }] = useAdjustStockMutation();
    const { data: logs, isLoading: isLogsLoading, refetch } = useGetInventoryLogsQuery(product?.productID);

    const handleAdjust = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');
        if (!quantity || !reason) {
            setError('Please enter both quantity and reason.');
            return;
        }
        try {
            await adjustStock({
                productId: product?.productID,
                data: { quantity: Number(quantity), reason, userID: 23 },
            }).unwrap();
            setSuccess('Stock adjusted successfully.');
            setQuantity('');
            setReason('');
            refetch();
        } catch (err) {
            setError('Failed to adjust stock.');
        }
    };

    console.log('Product:', product);

    return (
        <Paper sx={{ p: 3, maxWidth: 500, margin: '0 auto' }}>
            <Typography variant="h6" gutterBottom>
                Inventory Management
            </Typography>
            <Box component="form" onSubmit={handleAdjust} sx={{ mb: 2 }}>
                <TextField
                    label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    size="small"
                    sx={{ mr: 2, width: 120 }}
                />
                <TextField
                    label="Reason"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    size="small"
                    sx={{ mr: 2, width: 200 }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isAdjusting}
                >
                    {isAdjusting ? <CircularProgress size={20} /> : 'Adjust'}
                </Button>
            </Box>
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Inventory Logs
            </Typography>
            {isLogsLoading ? (
                <CircularProgress size={24} />
            ) : (
                    <Box sx={{ maxHeight: 400, overflowY: 'auto', mt: 1 }}>
                <List dense>
                    {logs && logs.length > 0 ? (
                            logs.map(log => (
                                <React.Fragment key={log.logID}>
                                    <ListItem>
                                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>{log.timestamp}</span>
                                            <Typography
                                                variant="body1"
                                                sx={{ minWidth: 60, textAlign: 'right', fontWeight: 600, color: log.quantityChanged > 0 ? 'success.main' : 'error.main' }}
                                            >
                                                {log.quantityChanged > 0 ? '+' : ''}
                                                {log.quantityChanged}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            secondary={`Reason: ${log.reason} | By User: ${log.userID}`}
                                        />
                                    </ListItem>
                                    <Divider component="li" />
                                </React.Fragment>
                            ))
                    ) : (
                        <ListItem>
                            <ListItemText primary="No inventory logs found." />
                        </ListItem>
                    )}
                        </List>
                    </Box>
            )}
        </Paper>
    );
};


export default ProductInventoryManager;