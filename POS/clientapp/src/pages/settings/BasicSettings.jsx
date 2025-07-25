import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Snackbar,
    Alert,
    Stack
} from '@mui/material';
import {
    useGetBasicSettingsQuery,
    useCreateBasicSettingMutation,
    useUpdateBasicSettingMutation
} from './../../services/basicSettingAPI';

const initialState = {
    id: 0,
    storeName: '',
    address: '',
    contactEmail: '',
    gstin: ''
};

export default function BasicSettingForm() {
    const { data, isLoading } = useGetBasicSettingsQuery();
    const [createBasicSetting] = useCreateBasicSettingMutation();
    const [updateBasicSetting] = useUpdateBasicSettingMutation();

    const [formData, setFormData] = useState(initialState);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (data?.length > 0) setFormData(data[0]);
    }, [data]);

    const validate = () => {
        const temp = {};
        temp.storeName = formData.storeName ? '' : 'Store Name is required';
        temp.contactEmail = /\S+@\S+\.\S+/.test(formData.contactEmail)
            ? ''
            : 'Invalid email';
        temp.gstin = formData.gstin ? '' : 'GSTIN is required';
        setErrors(temp);
        return Object.values(temp).every((x) => x === '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        if (formData.id === 0) {
            await createBasicSetting(formData);
        } else {
            await updateBasicSetting(formData);
        }
        setSuccess(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    if (isLoading) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto', mt: 5, px: 2 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Basic Store Settings
                </Typography>

                <form onSubmit={handleSubmit} noValidate>
                    <Stack spacing={3}>
                        <TextField
                            label="Store Name"
                            name="storeName"
                            fullWidth
                            value={formData.storeName}
                            onChange={handleChange}
                            error={!!errors.storeName}
                            helperText={errors.storeName}
                        />

                        <TextField
                            label="Address"
                            name="address"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.address}
                            onChange={handleChange}
                        />

                        <TextField
                            label="Contact Email"
                            name="contactEmail"
                            fullWidth
                            value={formData.contactEmail}
                            onChange={handleChange}
                            error={!!errors.contactEmail}
                            helperText={errors.contactEmail}
                        />

                        <TextField
                            label="GSTIN"
                            name="gstin"
                            fullWidth
                            value={formData.gstin}
                            onChange={handleChange}
                            error={!!errors.gstin}
                            helperText={errors.gstin}
                        />

                        <Button type="submit" variant="contained" fullWidth size="large">
                            {formData.id === 0 ? 'Save' : 'Update'}
                        </Button>
                    </Stack>
                </form>
            </Paper>

            <Snackbar
                open={success}
                autoHideDuration={3000}
                onClose={() => setSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Settings saved successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
}
