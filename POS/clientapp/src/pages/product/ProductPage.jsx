import React, { useState } from 'react';
import {
    Typography, Button, Modal, Box,
    Snackbar, Alert, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid } from '@mui/x-data-grid';
import ProductForm from './ProductForm';
import {
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} from './../../services/productApi'; // adjust path accordingly

import {
    useGetCategoriesQuery
} from './../../services/categoryApi';

const style = {
    position: 'absolute',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const ProductManager = () => {
    const { data: products = [], isLoading } = useGetProductsQuery();
    const { data: categories = [], refetch } = useGetCategoriesQuery();

    const [createProduct] = useCreateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    const [editingProduct, setEditingProduct] = useState(null);
    const [updateProduct] = useUpdateProductMutation();

    const [openModal, setOpenModal] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

    const handleAddProduct = async (product) => {
        debugger;
        try {
            if (editingProduct) {
                await updateProduct(product).unwrap();
                showAlert('Product updated successfully!');
            } else {
                await createProduct(product).unwrap();
                showAlert('Product added successfully!');
            }
            setOpenModal(false);
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
            renderCell: (params) => (    <>
                 <IconButton
          onClick={() => {
            setEditingProduct(params.row);
            setOpenModal(true);
          }}
          color="primary"
        >
          <EditIcon />
        </IconButton>
                <IconButton onClick={() => handleDelete(params.row.productID)} color="error">
                    <DeleteIcon />
                </IconButton>   </>
            ),
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Product Management
            </Typography>

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                    setEditingProduct(null);
                    setOpenModal(true);
                }}
                sx={{ mb: 2 }}
            >
                Add Product
            </Button>

            <DataGrid
                rows={products}
                columns={columns}
                autoHeight
                loading={isLoading}
                disableRowSelectionOnClick
                getRowId={(row) => row.productID}
            />

            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box sx={style}>
                    <ProductForm initialData={editingProduct} categories={categories} onSubmit={handleAddProduct} />
                </Box>
            </Modal>

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
