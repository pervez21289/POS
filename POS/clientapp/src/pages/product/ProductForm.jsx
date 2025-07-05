import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Grid, MenuItem, Checkbox, FormControlLabel,
    Typography, Box, Select, FormControl, InputLabel, Paper, Stack,
    InputAdornment, Divider
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PercentIcon from '@mui/icons-material/Percent';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const ProductForm = ({ categories = [], onSubmit, initialData = {}, onCancel }) => {
    const [product, setProduct] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleCheckbox = (e) => {
        setProduct({ ...product, isActive: e.target.checked });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(product);
    };

    useEffect(() => {
        setProduct(initialData);
    }, [initialData]);

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom color="primary">
                {initialData?.productID ? 'Edit Product' : 'Add New Product'}
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>Basic Information</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Product Name"
                        name="name"
                        value={product?.name || ''}
                        onChange={handleChange}
                        required
                        fullWidth
                        size="small"
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        label="SKU"
                        name="sku"
                        value={product?.sku || ''}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        label="Barcode"
                        name="barcode"
                        value={product?.barcode || ''}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                    />
                </Grid>

                {/* Pricing Section */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>Pricing</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={product?.price || ''}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AttachMoneyIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Cost Price"
                        name="costPrice"
                        type="number"
                        value={product?.costPrice || ''}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AttachMoneyIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Stock"
                        name="stock"
                        type="number"
                        value={product?.stock || ''}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <InventoryIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                {/* Discount Section */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>Discounts & Tax</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Discount Amount"
                        name="discountAmount"
                        type="number"
                        value={product?.discountAmount || ''}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocalOfferIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Discount %"
                        name="discountPercent"
                        type="number"
                        value={product?.discountPercent || ''}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="GST Rate"
                        name="gstRate"
                        type="number"
                        value={product?.gstRate || ''}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <PercentIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                {/* Category and Description */}
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
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
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Description"
                        name="description"
                        value={product?.description || ''}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        fullWidth
                        size="small"
                    />
                </Grid>

                <Grid item xs={12}>
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

                <Grid item xs={12}>
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        {initialData && (
                            <Button variant="outlined" color="secondary" onClick={onCancel}>
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
