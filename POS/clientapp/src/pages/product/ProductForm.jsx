import React, { useState } from 'react';
import {
    TextField,
    Button,
    Grid,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Typography,
    Box,
    Select
} from '@mui/material';
import { useEffect } from 'react';

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
        <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
                {initialData?.productID ? 'Edit Product' : 'Add Product'}
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Product Name"
                        name="name"
                        value={product?.name||''}
                        onChange={handleChange}
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="SKU"
                        name="sku"
                        value={product?.sku || ''}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Barcode"
                        name="barcode"
                        value={product?.barcode || ''}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
               
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={product?.price || ''}
                        onChange={handleChange}
                        fullWidth
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
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Discount Amount"
                        name="discountAmount"
                        type="number"
                        value={product?.discountAmount || ''}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Discount %"
                        name="discountPercent"
                        type="number"
                        value={product?.discountPercent || ''}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Select
                        labelId="category-label"
                        name="categoryID"
                        value={product?.categoryID ?? 0}
                        onChange={handleChange}
                        label="Category"
                    >
                        <MenuItem key="0" value="0">
                            <em>-Category--</em>
                        </MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat.categoryID} value={cat.categoryID}>
                                {cat.categoryName}
                            </MenuItem>
                        ))}
                    </Select>
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button variant="contained" type="submit" color="primary">
                            {initialData ? 'Update' : 'Add'} Product
                        </Button>
                        {initialData && (
                            <Button variant="outlined" color="secondary" onClick={onCancel}>
                                Cancel
                            </Button>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </form>
    );
};

export default ProductForm;
