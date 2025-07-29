import React, { useEffect, useState } from 'react';
import {
    TextField,
    Box,
    Button,
    Paper,
    Typography,
    Stack,
    Chip,
    Card,
    CardContent,
    CardActions,
    Divider,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SaleService from './../../services/SaleService';
import debounce from 'lodash.debounce';
import { useDispatch } from 'react-redux';
import { setDrawerComponent } from "./../../store/reducers/drawer";
import SalesReceipt from './SalesReceipt';
import { DataGrid } from '@mui/x-data-grid';

const SalesGrid = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [date, setDate] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const dispatch = useDispatch();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleViewInvoice = async (row) => {
        const data = await SaleService.GetSalesById(row.saleID);
        dispatch(
            setDrawerComponent({
                DrawerComponentChild: SalesReceipt,
                drawerProps: {
                    receiptInfo: data
                },
                drawerOpen: true
            })
        );
    };

    useEffect(() => {
        const debouncedFetch = debounce(async () => {
            setLoading(true);
            try {
                const response = await SaleService.GetSales({ search, date, page: page + 1, pageSize });
                setRows(response.rows);
                setRowCount(response.total);
            } catch (err) {
                console.error('Error fetching sales:', err);
                setRows([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        debouncedFetch();
        return () => debouncedFetch.cancel();
    }, [search, date, page, pageSize]);

    const columns = [
        { field: 'billNo', headerName: 'Bill No.', width: 120 },
        { field: 'customerName', headerName: 'Customer Name', width: 140 },
        { field: 'saleTime', headerName: 'Sale Time', width: 180 },
        { field: 'totalAmount', headerName: 'Total Amount', width: 130 },
        { field: 'discountAmount', headerName: 'Discount', width: 120 },
        { field: 'netAmount', headerName: 'Net Amount', width: 130 },
        {
            field: 'p_Status',
            headerName: 'Payment Status',
            width: 140,
            renderCell: (params) => {
                const status = params.value?.toLowerCase();
                const isPaid = status === 'paid';
                return (
                    <Chip
                        label={isPaid ? 'Paid' : 'Not Paid'}
                        color={isPaid ? 'success' : 'error'}
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                    />
                );
            }
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 130,
            sortable: false,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewInvoice(params.row)}
                >
                    View
                </Button>
            )
        },
    ];

    const renderMobileCards = () => (
        <Stack spacing={2}>
            {rows.map((row) => {
                const isPaid = row.p_Status?.toLowerCase() === 'paid';
                return (
                    <Card key={row.saleID} variant="outlined">
                        <CardContent>
                            <Typography variant="subtitle2" gutterBottom>
                                <strong>Bill No:</strong> {row.billNo}
                            </Typography>
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
                            <Chip
                                label={isPaid ? 'Paid' : 'Not Paid'}
                                color={isPaid ? 'success' : 'error'}
                                variant="outlined"
                                sx={{ mt: 1 }}
                            />
                        </CardContent>
                        <Divider />
                        <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleViewInvoice(row)}
                            >
                                View Invoice
                            </Button>
                        </CardActions>
                    </Card>
                );
            })}
        </Stack>
    );

    return (
        // Inside SalesGrid return JSX
        <Paper
            elevation={2}
            sx={{ p: { xs: 2, sm: 3 }, width: '100%', boxSizing: 'border-box' }}
        >
            <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
                Sales Transactions
            </Typography>

            {/* 🔁 Common Search + Date Fields */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mb: 2 }}
            >
                <TextField
                    fullWidth
                    label="Search"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                />
                <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    size="small"
                />
            </Stack>

            {/* 🔁 Grid or Card View Based on Screen Size */}
            <Box sx={{ width: '100%' }}>
                {isMobile ? (
                    renderMobileCards()
                ) : (
                    <Box sx={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pagination
                            paginationMode="server"
                            rowCount={rowCount}
                            page={page}
                            pageSize={pageSize}
                            onPageChange={(newPage) => setPage(newPage)}
                            onPageSizeChange={(newSize) => setPageSize(newSize)}
                            loading={loading}
                            getRowId={(row) => row.saleID}
                            disableSelectionOnClick
                        />
                    </Box>
                )}
            </Box>
        </Paper>

    );
};

export default SalesGrid;
