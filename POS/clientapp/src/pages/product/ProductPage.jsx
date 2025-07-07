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
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                        onClick={() => handleAddProduct(params.row)}
                        color="primary"
                        size="small"
                        title="Edit Product"
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => handleDelete(params.row.productID)}
                        color="error"
                        size="small"
                        title="Delete Product"
                    >
                        <DeleteIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => handleAddInventory(params.row)}
                        color="success"
                        size="small"
                        title="Manage Inventory"
                    >
                        <InventoryIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];


    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: 600,
                            color: 'primary.main'
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

                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: 'background.paper'
                    }}
                >
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
                    <DataGrid
                        rows={filteredProducts}
                        columns={columns}
                        autoHeight
                        loading={isLoading}
                        disableRowSelectionOnClick
                        getRowId={(row) => row.productID}
                        sx={{
                            '& .MuiDataGrid-cell': { py: 1 },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: 'action.hover',
                                borderRadius: 1
                            },
                            border: 'none',
                            borderRadius: 1
                        }}
                        density="comfortable"
                        pageSize={10}
                    />
                </Paper>
            </Box>
        </Container>
    );
};

export default ProductManager;
