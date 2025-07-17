import React, { useState, useEffect } from 'react';
import {
    Box, TextField, Button, MenuItem, Typography, Grid, Paper, Select, InputLabel, FormControl, OutlinedInput, Checkbox, ListItemText
} from '@mui/material';
import { useUpdateOrCreateUserMutation } from './../../services/userAPI';

const roles = [
    { id: 2, label: 'Admin' },
    { id: 3, label: 'Cashier' },
    { id: 4, label: 'Inventory Manager' }
];

const initialState = {
    userID: 0,
    firstName: '',
    mobile: '',
    email: '',
    passwordHash: '',
    companyID: 1,
    roleIDs: [] // <-- MULTI ROLE SUPPORT
};

export default function UserForm({ editUser }) {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [saveUser, { isLoading }] = useUpdateOrCreateUserMutation();

    useEffect(() => {
        if (editUser) {
            const roleIds = editUser.roleId.split(',').map(id => parseInt(id, 10));
            setFormData({ ...editUser, passwordHash: '', roleIDs: roleIds || [] });
        }
    }, [editUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = 'Name required';
        if (!/^[6-9]\d{9}$/.test(formData.mobile)) newErrors.mobile = 'Enter valid mobile';
        if (!formData.email.includes('@')) newErrors.email = 'Invalid email';
        if (!formData.userID && !formData.passwordHash) newErrors.passwordHash = 'Password required';
        if (!formData.roleIDs || formData.roleIDs.length === 0) newErrors.roleIDs = 'Select at least one role';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        const payload = { ...formData };
        if (!payload.passwordHash) delete payload.passwordHash;
        try {
            await saveUser(payload);
            setFormData(initialState);
            setErrors({});
        } catch (error) {
            setErrors(error);
        }
        /*onSuccess();*/
       
    };

    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" mb={3}>
                {formData.userID ? 'Update User' : 'Create User'}
            </Typography>
            <Grid container spacing={2} direction="column">
                <Grid item>
                    <TextField fullWidth label="Full Name" name="firstName" value={formData.firstName} onChange={handleChange} error={!!errors.firstName} helperText={errors.firstName} />
                </Grid>
                <Grid item>
                    <TextField fullWidth label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} error={!!errors.mobile} helperText={errors.mobile} />
                </Grid>
                <Grid item>
                    <TextField fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} />
                </Grid>
                <Grid item>
                    <TextField fullWidth label="Password" name="passwordHash" type="password" value={formData.passwordHash} onChange={handleChange} error={!!errors.passwordHash} helperText={formData.userID ? 'Leave blank to keep current password' : errors.passwordHash} />
                </Grid>
                <Grid item>
                    <FormControl fullWidth error={!!errors.roleIDs}>
                        <InputLabel>Roles</InputLabel>
                        <Select
                            multiple
                            name="roleIDs"
                            value={formData.roleIDs}
                            onChange={(e) => setFormData({ ...formData, roleIDs: e.target.value })}
                            input={<OutlinedInput label="Roles" />}
                            renderValue={(selected) => roles.filter(r => selected.includes(r.id)).map(r => r.label).join(', ')}
                        >
                            {roles.map(role => (
                                <MenuItem key={role.id} value={role.id}>
                                    <Checkbox checked={formData.roleIDs.indexOf(role.id) > -1} />
                                    <ListItemText primary={role.label} />
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.roleIDs && <Typography variant="caption" color="error">{errors.roleIDs}</Typography>}
                    </FormControl>
                </Grid>
                <Grid item>
                    <Box textAlign="right">
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            sx={{ px: 4, py: 1.5 }}
                        >
                            {formData.userID ? 'Update User' : 'Create User'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}
