import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Grid, MenuItem, Checkbox, FormControlLabel,
    Typography, Box, Select, FormControl, InputLabel, Stack,
    InputAdornment, Divider
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PercentIcon from '@mui/icons-material/Percent';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useDispatch } from 'react-redux';
import {
    useCreateProductMutation,
    useUpdateProductMutation
    
} from './../../services/productApi';
import { openDrawer } from "./../../store/reducers/drawer";
import { showAlert } from "./../../store/reducers/alert";
import { useGetCategoriesQuery } from './../../services/categoryApi';

const ProductForm = ({ initialData = {}}) => {
    const [product, setProduct] = useState(null);
    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const { data: categories = [] } = useGetCategoriesQuery();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleCheckbox = (e) => {
        setProduct({ ...product, isActive: e.target.checked });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleFormSubmit(product);
    };

    const onCancel = async (row) => {
        dispatch(
            openDrawer({
                drawerOpen: true
            })
        );
    };

    const handleFormSubmit = async (product) => {
        try {
            if (product.productID) {
                await updateProduct(product).unwrap();
                dispatch(showAlert({ open: true, message: 'Updated saved succefully!', severity: 'success' }));
            } else {
                await createProduct(product).unwrap();
                dispatch(showAlert({ open: true, message: 'Product saved succefully!', severity: 'success' }));
            }
            dispatch(openDrawer({ drawerOpen: false }));
            setProduct(null);
        } catch (error) {
            dispatch(showAlert({ open: true, message: 'Failed to save product!', severity: 'error' }));
        }
    };


    useEffect(() => {
        setProduct(initialData);
    }, [initialData]);

    return (
      
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                '& .MuiTextField-root, & .MuiFormControl-root': {
                    my: 1
                },
                m:5
            }}
        >
            <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ mb: 2 }}
            >
                {initialData?.productID ? 'Edit Product' : 'Add New Product'}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Basic Information */}
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
                Basic Information
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Product Name"
                        name="name"
                        value={product?.name || ''}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="SKU"
                        name="sku"
                        value={product?.sku || ''}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Barcode"
                        name="barcode"
                        value={product?.barcode || ''}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            labelId="category-label"
                            name="categoryID"
                            value={product?.categoryID ?? 0}
                            onChange={handleChange}
                            label="Category"
                        >
                            <MenuItem value={0}><em>-Select Category-</em></MenuItem>
                            {categories.map((cat) => (
                                <MenuItem key={cat.categoryID} value={cat.categoryID}>
                                    {cat.categoryName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Pricing */}
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 'medium' }}>
                Pricing
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={product?.price || ''}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AttachMoneyIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Cost Price"
                        name="costPrice"
                        type="number"
                        value={product?.costPrice || ''}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AttachMoneyIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                
            </Grid>

            {/* Discounts & Tax */}
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 'medium' }}>
                Discounts & Tax
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Discount Amount"
                        name="discountAmount"
                        type="number"
                        value={product?.discountAmount || ''}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocalOfferIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Discount %"
                        name="discountPercent"
                        type="number"
                        value={product?.discountPercent || ''}
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="GST Rate"
                        name="gstRate"
                        type="number"
                        value={product?.gstRate || ''}
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <PercentIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
            </Grid>

            {/* Description & Status */}
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 'medium' }}>
                Other Details
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Description"
                        name="description"
                        value={product?.description || ''}
                        onChange={handleChange}
                        multiline
                        rows={2}
                    />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={product?.isActive}
                                onChange={handleCheckbox}
                                name="isActive"
                            />
                        }
                        label="Is Active"
                    />
                </Grid>
            </Grid>

            {/* Actions */}
            <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={12}>
                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                    >
                        {initialData && (
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={onCancel}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            sx={{ minWidth: 120 }}
                        >
                            {initialData ? 'Update' : 'Add'} Product
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
        
    );
};

export default ProductForm;