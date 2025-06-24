import React, { useState } from 'react';
import {
    Container, // ✅ Add this
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
    Stack
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

import {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} from './../../services/categoryApi';

export default function CategoryForm() {
    const { data: categories = [], refetch } = useGetCategoriesQuery();
    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const [category, setCategory] = useState({ categoryID: 0, categoryName: '' });

    const handleChange = (e) => {
        setCategory({ ...category, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!category.categoryName.trim()) return;

        try {
            if (category.categoryID === 0) {
                await createCategory({ categoryName: category.categoryName });
            } else {
                await updateCategory(category);
            }
            resetForm();
            refetch();
        } catch (err) {
            console.error('Error saving category:', err);
        }
    };

    const handleEdit = (cat) => {
        setCategory({ categoryID: cat.categoryID, categoryName: cat.categoryName });
    };

    const handleDelete = async (id) => {
        try {
            await deleteCategory(id);
            refetch();
        } catch (err) {
            console.error('Error deleting category:', err);
        }
    };

    const resetForm = () => {
        setCategory({ categoryID: 0, categoryName: '' });
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    {category.categoryID === 0 ? 'Add New Category' : 'Edit Category'}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        name="categoryName"
                        label="Category Name"
                        value={category.categoryName}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />

                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button type="submit" variant="contained">
                            {category.categoryID === 0 ? 'Create' : 'Update'}
                        </Button>
                        {category.categoryID !== 0 && (
                            <Button variant="outlined" color="secondary" onClick={resetForm}>
                                Cancel
                            </Button>
                        )}
                    </Stack>
                </form>

                <Typography variant="h6" sx={{ mt: 4 }}>
                    All Categories
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <List>
                    {categories.length === 0 && (
                        <ListItem>
                            <ListItemText primary="No categories found." />
                        </ListItem>
                    )}
                    {categories.map((cat) => (
                        <ListItem
                            key={cat.categoryID}
                            secondaryAction={
                                <>
                                    <IconButton edge="end" onClick={() => handleEdit(cat)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton edge="end" onClick={() => handleDelete(cat.categoryID)}>
                                        <Delete />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemText primary={cat.categoryName} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
}
