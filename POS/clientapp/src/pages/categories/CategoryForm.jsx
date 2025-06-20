import React, { useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
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
        if (category.categoryID === 0) {
            await createCategory(category);
        } else {
            await updateCategory(category);
        }
        setCategory({ categoryID: 0, categoryName: '' });
        refetch();
    };

    const handleEdit = (cat) => {
        setCategory(cat);
    };

    const handleDelete = async (id) => {
        await deleteCategory(id);
        refetch();
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 500, margin: 'auto', mt: 5 }}>
            <Typography variant="h6" gutterBottom>
                {category.CategoryID === 0 ? 'Add Category' : 'Edit Category'}
            </Typography>
            <form onSubmit={handleSubmit}>

                <TextField
                    fullWidth
                    name="categoryName"
                    label="Category Name"
                    value={category.categoryName}
                    onChange={handleChange}
                    margin="normal"
                    required   >
                </TextField>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button type="submit" variant="contained">
                        {category.CategoryID === 0 ? 'Create' : 'Update'}
                    </Button>
                    {category.CategoryID !== 0 && (
                        <Button
                            color="secondary"
                            onClick={() => setCategory({ CategoryID: 0, CategoryName: '' })}
                        >
                            Cancel
                        </Button>
                    )}
                </Box>
            </form>

            <Typography variant="h6" sx={{ mt: 4 }}>
                Categories
            </Typography>
            <List>
                {categories.map((cat) => (
                    <ListItem
                        key={cat.CategoryID}
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
    );
}
