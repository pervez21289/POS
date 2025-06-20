import React, { useState } from 'react';
import {
    TextField,
    Button,
    Grid,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Typography,
} from '@mui/material';

const ProductForm = ({ categories = [], onSubmit, initialData = {} }) => {
    const [product, setProduct] = useState({
        name: initialData.name || '',
        sku: initialData.sku || '',
        barcode: initialData.barcode || '',
        description: initialData.description || '',
        price: initialData.price || '',
        costPrice: initialData.costPrice || '',
        stock: initialData.stock || '',
        categoryID: initialData.categoryID || '',
        isActive: initialData.isActive ?? true,
    });

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

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
                {initialData.productID ? 'Edit Product' : 'Add Product'}
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Product Name"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="SKU"
                        name="sku"
                        value={product.sku}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Barcode"
                        name="barcode"
                        value={product.barcode}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Description"
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={product.price}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Cost Price"
                        name="costPrice"
                        type="number"
                        value={product.costPrice}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Stock"
                        name="stock"
                        type="number"
                        value={product.stock}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        select
                        label="Category"
                        name="categoryID"
                        value={product.categoryID}
                        onChange={handleChange}
                        fullWidth
                    >
                        <MenuItem value="">Select Category</MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat.categoryID} value={cat.categoryID}>
                                {cat.categoryName}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={product.isActive}
                                onChange={handleCheckbox}
                                name="isActive"
                            />
                        }
                        label="Is Active"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                        {initialData.productID ? 'Update' : 'Create'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default ProductForm;
