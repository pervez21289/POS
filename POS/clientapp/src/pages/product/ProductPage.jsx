import React, { useState, useMemo, useCallback } from 'react';
import {
    TextField, Box, Snackbar, Alert, IconButton, Paper, Typography, 
    Container, Divider
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
import { useDispatch, useSelector } from 'react-redux';
import {
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} from './../../services/productApi';

import { useGetCategoriesQuery } from './../../services/categoryApi';

const ProductManager = () => {
    const { data: products = [], isLoading } = useGetProductsQuery();
    const { data: categories = [] } = useGetCategoriesQuery();

    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    const [editingProduct, setEditingProduct] = useState(null);
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
    const [searchText, setSearchText] = useState('');
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

    const handleFormSubmit = async (product) => {
        try {
            if (editingProduct) {
                await updateProduct(product).unwrap();
                showAlert('Product updated successfully!');
            } else {
                await createProduct(product).unwrap();
                showAlert('Product added successfully!');
            }
            setEditingProduct(null);
        } catch {
            showAlert('Failed to save product', 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProduct(id).unwrap();
            showAlert('Product deleted.');
        } catch {
            showAlert('Failed to delete product', 'error');
        }
    };

    const showAlert = (message, severity = 'success') => {
        setAlert({ open: true, message, severity });
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

    const filteredProducts = useMemo(() => {
        return products.filter((product) =>
            product.name.toLowerCase().includes(searchText) ||
            product.sku.toLowerCase().includes(searchText)
        );
    }, [products, searchText]);

    const columns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'sku', headerName: 'SKU', flex: 1 },
        { field: 'stock', headerName: 'Stock', flex: 1 },
        { field: 'price', headerName: 'Price', type: 'number', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => setEditingProduct(params.row)} color="primary">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row.productID)} color="error">
                        <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleAddInventory(params.row)} color="success">
                        <InventoryIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <Container maxWidth="xl">
            <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                    Product Management
                </Typography>
                
                <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                    <ProductForm
                        initialData={editingProduct}
                        categories={categories}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setEditingProduct(null)}
                    />
                </Paper>

                <Paper elevation={3} sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                        <TextField
                            label="Search by name or SKU"
                            variant="outlined"
                            fullWidth
                            size="small"
                            onChange={handleSearchChange}
                        />
                    </Box>
                    
                    <DataGrid
                        rows={filteredProducts}
                        columns={columns}
                        autoHeight
                        loading={isLoading}
                        disableRowSelectionOnClick
                        getRowId={(row) => row.productID}
                       
                    />
                </Paper>
            </Box>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={alert.open}
                autoHideDuration={3000}
                onClose={() => setAlert({ ...alert, open: false })}
            >
                <Alert 
                    severity={alert.severity}
                    variant="filled"
                    elevation={6}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ProductManager;
