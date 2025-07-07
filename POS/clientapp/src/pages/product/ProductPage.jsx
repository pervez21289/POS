import React, { useState, useMemo, useCallback } from 'react';
import {
    TextField, Box,  IconButton, Paper, Typography, 
    Container, Button
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


const ProductManager = () => {
    const { data: products = [], isLoading } = useGetProductsQuery();
    const [deleteProduct] = useDeleteProductMutation();
    const [searchText, setSearchText] = useState('');
    const dispatch = useDispatch();

    const handleAddInventory = async (row) => {
        dispatch(
            setDrawerComponent({
                DrawerComponentChild: ProductInventoryManager,
                drawerProps: {
                    initialData: row
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

    

    const handleDelete = async (id) => {
        try {
            await deleteProduct(id).unwrap();
            showAlert('Product deleted.');
        } catch {
            showAlert('Failed to delete product', 'error');
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
                    <IconButton onClick={() => handleAddProduct(params.row)} color="primary">
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
                    <Button
                        variant="contained"
                        onClick={() => handleAddProduct(null)}
                        color="primary"
                        sx={{ minWidth: 120 }}
                    >
                        Add Product
                    </Button>
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
        </Container>
    );
};

export default ProductManager;
