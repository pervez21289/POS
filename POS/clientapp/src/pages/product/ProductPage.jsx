import React, { useState } from 'react';
import {
    Typography, Button, Box, Snackbar, Alert, IconButton, Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid } from '@mui/x-data-grid';
import ProductForm from './ProductForm';

import {
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} from './../../services/productApi';

import {
    useGetCategoriesQuery
} from './../../services/categoryApi';

const ProductManager = () => {
    const { data: products = [], isLoading } = useGetProductsQuery();
    const { data: categories = [] } = useGetCategoriesQuery();

    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    const [editingProduct, setEditingProduct] = useState(null);
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

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
        } catch (err) {
            showAlert('Failed to save product', 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProduct(id).unwrap();
            showAlert('Product deleted.');
        } catch (err) {
            showAlert('Failed to delete product', 'error');
        }
    };

    const showAlert = (message, severity = 'success') => {
        setAlert({ open: true, message, severity });
    };

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
                    <IconButton
                        onClick={() => {
                            debugger;
                            setEditingProduct(params.row)
                        }
                        }
                        color="primary"
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => handleDelete(params.row.productID)}
                        color="error"
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Product Management
            </Typography>

            <Box sx={{ mb: 4 }}>
                <ProductForm
                    initialData={editingProduct}
                    categories={categories}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setEditingProduct(null)}
                />
            </Box>

            <DataGrid
                rows={products}
                columns={columns}
                autoHeight
                loading={isLoading}
                disableRowSelectionOnClick
                getRowId={(row) => row.productID}
            />

            <Snackbar
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
