import React, { useState, useMemo, useCallback } from 'react';
import {
    Typography, Box, Snackbar, Alert, IconButton, breadcrumb
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid } from '@mui/x-data-grid';
import debounce from 'lodash/debounce';

import ProductForm from './ProductForm';

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

    // 🔁 Debounced search handler
    const debouncedSearch = useCallback(
        debounce((value) => {
            setSearchText(value.toLowerCase());
        }, 300),
        []
    );

    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };

    // 🧠 useMemo to avoid recalculating on every render
    const filteredProducts = useMemo(() => {
        return products.filter((product) =>
            product.name.toLowerCase().includes(searchText) ||
            product.sku.toLowerCase().includes(searchText)
        );
    }, [products, searchText]);

    const columns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'sku', headerName: 'SKU', flex: 1 },
        { field: 'price', headerName: 'Price', type: 'number', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => setEditingProduct(params.row)} color="primary">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row.productID)} color="error">
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <Box sx={{ p: 3 }}>

            <Box sx={{ mb: 4 }}>
                <ProductForm
                    initialData={editingProduct}
                    categories={categories}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setEditingProduct(null)}
                />
            </Box>

            <TextField
                label="Search by name or SKU"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                onChange={handleSearchChange}
            />

            <DataGrid
                rows={filteredProducts}
                columns={columns}
                autoHeight
                loading={isLoading}
                disableRowSelectionOnClick
                getRowId={(row) => row.productID}
            />

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={alert.open}
                autoHideDuration={3000}
                onClose={() => setAlert({ ...alert, open: false })}
            >
                <Alert severity={alert.severity}>{alert.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default ProductManager;
