﻿import React, { useState, useMemo, useCallback } from 'react';
import {
    TextField, Box,  IconButton, Paper, Typography, 
    Container, Button  ,   Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InventoryIcon from '@mui/icons-material/Inventory';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';
import debounce from 'lodash/debounce';
import ProductInventoryManager from './ProductInventoryManager';
import ProductForm from './ProductForm';
import { setDrawerComponent } from "./../../store/reducers/drawer";
import { useDispatch } from 'react-redux';
import {
    useGetProductsQuery,
    useDeleteProductMutation
} from './../../services/productApi';
import { showConfirmDialog } from './../../store/reducers/confirm';
import { showAlert } from "./../../store/reducers/alert";
import { useTheme, useMediaQuery } from '@mui/material';


const ProductManager = () => {
    const [searchText, setSearchText] = useState('');
    const { data: products = [], isLoading } = useGetProductsQuery(searchText);
    const [deleteProduct] = useDeleteProductMutation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch();

    const handleAddInventory = async (row) => {
        dispatch(
            setDrawerComponent({
                DrawerComponentChild: ProductInventoryManager,
                drawerProps: {
                    product: row
                },
                drawerOpen: true
            })
        );
    };

    const handleAddProduct = async (row) => {
        dispatch(
            setDrawerComponent({
                DrawerComponentChild: ProductForm,
                drawerProps: {
                    initialData: row,
                },
                drawerOpen: true
            })
        );
    };

    const requestDelete = (product) => {
        dispatch(
            showConfirmDialog({
                title: 'Delete Product',
                message: `Are you sure you want to delete "${product.name}"?`,
                confirmText: 'Delete',
                cancelText: 'Cancel',
                confirmColor: 'error',
                onConfirm: async () => handleDelete(product.productID)
            })
        );
    };



    const handleDelete = async (id) => {
        try {
            await deleteProduct(id).unwrap();
            dispatch(showAlert({ open: true, message: 'Deleted succefully!', severity: 'success' }));
        } catch {
            dispatch(showAlert({ open: true, message: 'Deleted succefully!', severity: 'error' }));
        }
    };


    const debouncedSearch = useCallback(
        debounce((value) => {
            setSearchText(value.toLowerCase());
        }, 300),
        []
    );

    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };



    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            minWidth: 200
        },
        {
            field: 'sku',
            headerName: 'SKU',
            flex: 0.7,
            minWidth: 120
        },
        {
            field: 'stock',
            headerName: 'Stock',
            flex: 0.5,
            minWidth: 100,
            align: 'right',
            headerAlign: 'right'
        },
        {
            field: 'price',
            headerName: 'Price',
            type: 'number',
            flex: 0.5,
            minWidth: 100,
            align: 'right',
            headerAlign: 'right'

        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 0.8,
            minWidth: 150,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        width: '100%',
                        height: '100%',
                        py: 0.5
                    }}
                >
                    <IconButton
                        onClick={() => handleAddProduct(params.row)}
                        color="primary"
                        size="small"
                        title="Edit Product"
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        onClick={() => requestDelete(params.row)}
                        color="error"
                        size="small"
                        title="Delete Product"
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        onClick={() => handleAddInventory(params.row)}
                        color="success"
                        size="small"
                        title="Manage Inventory"
                    >
                        <InventoryIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        }

    ];


    return (
    
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>

            {/* ✅ Shared header for both desktop and mobile */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 600,
                        color: 'primary.main',
                        textAlign: { xs: 'center', sm: 'left' }
                    }}
                >
                    Product Management
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => handleAddProduct(null)}
                    color="primary"
                    sx={{
                        minWidth: 120,
                        height: 40,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    Add Product
                </Button>
            </Box>

            {/* 🔍 Search input (shared) */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                <TextField
                    label="Search by name or SKU"
                    variant="outlined"
                    fullWidth
                    size="small"
                    onChange={handleSearchChange}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 1
                        }
                    }}
                />
            </Box>

            {/* 📱 Conditional content: card for mobile, grid for desktop */}
            {isMobile ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {products.map(product => (
                        <Paper key={product.productID} sx={{ p: 2 }}>
                            <Typography variant="h6">{product.name}</Typography>
                            <Typography variant="body2">SKU: {product.sku}</Typography>
                            <Typography variant="body2">Stock: {product.stock}</Typography>
                            <Typography variant="body2">Price: ${product.price}</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                                <IconButton onClick={() => handleAddProduct(product)} color="primary">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => requestDelete(product)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton onClick={() => handleAddInventory(product)} color="success">
                                    <InventoryIcon />
                                </IconButton>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            ) : (
                <DataGrid
                    rows={products}
                    columns={columns}
                    loading={isLoading}
                    disableRowSelectionOnClick
                    getRowId={(row) => row.productID}
                    pageSize={10}
                />
            )}
        </Paper>

    );
};

export default ProductManager;
