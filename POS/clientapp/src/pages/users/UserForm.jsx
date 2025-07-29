import React, { useState, useEffect } from 'react';
import {
    Box, TextField, Button, MenuItem, Typography, Grid, Paper, Select, InputLabel, FormControl,
    OutlinedInput, Checkbox, ListItemText, Divider,Stack
} from '@mui/material';
import { useUpdateOrCreateUserMutation } from './../../services/userAPI';
import { showAlert } from "./../../store/reducers/alert";
import { openDrawer } from "./../../store/reducers/drawer";
import { useDispatch } from 'react-redux';

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
    roleIDs: []
};

export default function UserForm({ editUser }) {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [saveUser, { isLoading }] = useUpdateOrCreateUserMutation();
    const dispatch = useDispatch();

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
        if (formData.userID === 0) {
            if (!/^[6-9]\d{9}$/.test(formData.mobile)) newErrors.mobile = 'Enter valid mobile';
            if (!formData.email.includes('@')) newErrors.email = 'Invalid email';
        }
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
            await saveUser(payload).unwrap();
            dispatch(showAlert({ open: true, message: 'Updated saved succefully!', severity: 'success' }));
            setErrors({});
        } catch (error) {
          
            console.error('Error saving user:', error);
            dispatch(showAlert({ open: true, message: error?.data, severity: 'error' }));
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" mb={3}>
                {formData.userID ? 'Update User' : 'Create User'}
            </Typography>

            <Grid container spacing={3} direction="column">

                {/* --- Personal Details --- */}
                <Grid item>
                    <Typography variant="subtitle1" fontWeight="bold">Personal Details</Typography>
                    <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item>
                    <TextField fullWidth label="Full Name" name="firstName" value={formData.firstName} onChange={handleChange} error={!!errors.firstName} helperText={errors.firstName} />
                </Grid>
                {(formData.userID === 0)&&<><Grid item>
                    <TextField fullWidth label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} error={!!errors.mobile} helperText={errors.mobile} />
                </Grid>
                <Grid item>
                    <TextField fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} />
                    </Grid>  </>
                }

                {/* --- Security Section --- */}
                <Grid item>
                    <Typography variant="subtitle1" fontWeight="bold">Security</Typography>
                    <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item>
                    <TextField
                        fullWidth
                        label="Password"
                        name="passwordHash"
                        type="password"
                        value={formData.passwordHash}
                        onChange={handleChange}
                        error={!!errors.passwordHash}
                        helperText={formData.userID ? 'Leave blank to keep current password' : errors.passwordHash}
                    />
                </Grid>

                {/* --- Role Assignment --- */}
                <Grid item>
                    <Typography variant="subtitle1" fontWeight="bold">Role Assignment</Typography>
                    <Divider sx={{ my: 1 }} />
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
                            renderValue={(selected) =>
                                roles
                                    .filter(r => selected.includes(r.id))
                                    .map(r => r.label)
                                    .join(', ')
                            }
                        >
                            {roles.map(role => (
                                <MenuItem key={role.id} value={role.id}>
                                    <Checkbox checked={formData.roleIDs.includes(role.id)} />
                                    <ListItemText primary={role.label} />
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.roleIDs && <Typography variant="caption" color="error">{errors.roleIDs}</Typography>}
                    </FormControl>
                </Grid>

                {/* Submit Button */}
              
                    
                <Grid item>
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button variant="outlined" color="secondary" onClick={() => dispatch(openDrawer({ drawerOpen: false }))}>
                            Cancel
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {formData.userID ? 'Update User' : 'Create User'}
                        </Button>
                    </Stack>
                </Grid>
                
            </Grid>
        </Paper>
    );
}
