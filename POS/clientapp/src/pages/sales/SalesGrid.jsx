import React, { useEffect, useState,useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Box } from '@mui/material';
import SaleService from './../../services/SaleService';
import debounce from 'lodash.debounce';

const SalesGrid = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [date, setDate] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);

    const fetchSales = useMemo(() => debounce(async () => {
        
        setLoading(true);
        try {
            const response = await SaleService.GetSales({ search, date, page: page + 1, pageSize });
            setRows(response.rows);
            setRowCount(response.total);
            //setSearchResults(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching products:', err);
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, 300), []);

    //const fetchSales = async () => {
    //    setLoading(true);
    //    try {
    //        //const response = await axios.get('/api/sales', {
    //        //    params: {
    //        //        search,
    //        //        date,
    //        //        page: page + 1,
    //        //        pageSize,
    //        //    },
    //        //});
    //        const response = await SaleService.GetSales({ search, date, page: page + 1, pageSize });
    //        debugger;
    //        setRows(response.rows);
    //        setRowCount(response.total);
    //    } catch (error) {
    //        console.error('Error fetching sales:', error);
    //    } finally {
    //        setLoading(false);
    //    }
    //};

    useEffect(() => {
        /* fetchSales();*/

        fetchSales();
        return () => fetchSales.cancel();

    }, [search, date, page, pageSize]);

    const columns = [
        { field: 'saleID', headerName: 'Sale ID', width: 100 },
        { field: 'billedBy', headerName: 'Billed By', width: 100 },
        { field: 'saleTime', headerName: 'Sale Time', width: 180 },
        { field: 'totalAmount', headerName: 'Total Amount', width: 130 },
        { field: 'discountAmount', headerName: 'Discount', width: 120 },
        { field: 'taxAmount', headerName: 'Tax', width: 100 },
        { field: 'netAmount', headerName: 'Net Amount', width: 130 },
        { field: 'paymentStatus', headerName: 'Payment Status', width: 140 }
        
    ];
    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Box display="flex" gap={2} mb={2}>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <TextField
                    label="Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </Box>
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
            />
        </Box>
    );
};

export default SalesGrid;
