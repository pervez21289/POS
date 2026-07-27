import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Grid, MenuItem, Checkbox, FormControlLabel,
    Typography, Box, Select, InputAdornment, Stack, Divider
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useDispatch } from 'react-redux';
import {
    useCreateProductMutation,
    useUpdateProductMutation
} from './../../services/productApi';
import { openDrawer } from "./../../store/reducers/drawer";
import { showAlert } from "./../../store/reducers/alert";
import { useGetCategoriesQuery } from './../../services/categoryApi';

const ProductForm = ({initialData=null}) => {
    const [product, setProduct] = useState(null);
    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const { data: categories = [] } = useGetCategoriesQuery();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedProduct = { ...product, [name]: value };

        const costPrice = parseFloat(name === 'costPrice' ? value : updatedProduct.costPrice) || 0;

        if (name === 'price' && costPrice > 0) {
            const newPrice = parseFloat(value) || 0;
            const newDiscountAmount = costPrice - newPrice;
            const newDiscountPercent = (newDiscountAmount / costPrice) * 100;
            updatedProduct.discountAmount = newDiscountAmount.toFixed(2);
            updatedProduct.discountPercent = newDiscountPercent.toFixed(2);
        }

        if (name === 'costPrice') {
            const newCost = parseFloat(value) || 0;
            const newDiscountAmount = parseFloat(updatedProduct.discountAmount) || 0;
            const newDiscountPercent = (newDiscountAmount / newCost) * 100;
            updatedProduct.discountPercent = newDiscountPercent.toFixed(2);
            updatedProduct.price = (newCost - newDiscountAmount).toFixed(2);
        }

        setProduct(updatedProduct);
    };

    const handleCheckbox = (e) => {
        setProduct({ ...product, isActive: e.target.checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (product.productID) {
                await updateProduct(product).unwrap();
                dispatch(showAlert({ open: true, message: 'Updated successfully!', severity: 'success' }));
            } else {
                await createProduct(product).unwrap();
                dispatch(showAlert({ open: true, message: 'Product saved successfully!', severity: 'success' }));
            }
            setProduct(null); 
            dispatch(openDrawer({ drawerOpen: false }));
        } catch {
            dispatch(showAlert({ open: true, message: 'Failed to save product!', severity: 'error' }));
        }
    };

    useEffect(() => {
        setProduct(initialData);
        console.log('ProductForm initialData:', initialData);
    }, [initialData]);

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                {initialData?.productID ? 'Edit Product' : 'Add New Product'}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2} direction="column">
                <Grid item xs={12}>
                    <Select
                        fullWidth
                        size="small"
                        name="categoryID"
                        value={product?.categoryID ?? 0}
                        onChange={handleChange}
                    >
                        <MenuItem value={0}><em>-Select Category-</em></MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat.categoryID} value={cat.categoryID}>
                                {cat.categoryName}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Product Name"
                        name="name"
                        value={product?.name || ''}
                        onChange={handleChange}
                        required
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Barcode"
                        name="barcode"
                        value={product?.barcode || ''}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        size="small"
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

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        size="small"
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

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Description"
                        name="description"
                        value={product?.description || ''}
                        onChange={handleChange}
                        multiline
                        rows={2}
                    />
                </Grid>

                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={!!product?.isActive}
                                onChange={handleCheckbox}
                                name="isActive"
                            />
                        }
                        label="Is Active"
                    />
                </Grid>

                <Grid item xs={12}>
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                                dispatch(openDrawer({ drawerOpen: false }));
                                setProduct(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                        >
                            {initialData ? 'Update' : 'Add'} Product
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </form>
    );
};

export default ProductForm;
