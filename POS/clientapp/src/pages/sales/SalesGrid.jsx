import React, { useEffect, useState, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Box, Button, Paper, Typography, Stack,Chip} from '@mui/material';
import SaleService from './../../services/SaleService';
import debounce from 'lodash.debounce';
import { useDispatch } from 'react-redux';
import { setDrawerComponent } from "./../../store/reducers/drawer";
import ReceiptPrintWrapper from './ReceiptPrintWrapper';

const SalesGrid = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [date, setDate] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const dispatch = useDispatch();


    const handleViewInvoice = async (row) => {
        const data = await SaleService.GetSalesById(row.saleID);
        dispatch(
            setDrawerComponent({
                DrawerComponentChild: ReceiptPrintWrapper,
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
                console.error('Error fetching products:', err);
                setRows([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        debouncedFetch();

        return () => debouncedFetch.cancel();
    }, [search, date, page, pageSize]);


    const columns = [
        { field: 'billNo', headerName: 'Bill No.', width: 150 },
        { field: 'customerName', headerName: 'Customer Name', width: 140 },
        { field: 'saleTime', headerName: 'Sale Time', width: 180 },
        { field: 'totalAmount', headerName: 'Total Amount', width: 130 },
        { field: 'discountAmount', headerName: 'Discount', width: 120 },
        { field: 'netAmount', headerName: 'Net Amount', width: 130 },
        {
            field: 'p_Status', headerName: 'Payment Status', width: 140, renderCell: (params) => {
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
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewInvoice(params.row)}
                >
                    View Invoice
                </Button>
            )
        },
    ];

    return (
        <Paper elevation={2} sx={{ p: 3, width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Sales Transactions
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                />
                <TextField
                    label="Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    size="small"
                />
            </Stack>
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
        </Paper>
    );
};

export default SalesGrid;