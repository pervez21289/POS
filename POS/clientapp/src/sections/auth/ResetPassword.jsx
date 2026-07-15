import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Button,
    Grid,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography,
    FormHelperText,
    Alert,
    Paper
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import UserService from '../../services/UserService';
import { strengthIndicator, strengthColor } from '../../utils/password-strength';

export default function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState(strengthColor(0));

    // Get token from query string
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    const handlePasswordChange = (e, handleChange) => {
        handleChange(e);
        const temp = strengthIndicator(e.target.value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    const handleResetPassword = async (values, { setSubmitting }) => {
        setSubmitError('');
        setSubmitSuccess('');
        try {
            const response = await UserService.ResetPassword({ token, newPassword: values.password });
            if (response.success) {
                setSubmitSuccess('Password reset successfully. Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setSubmitError(response.message || 'Failed to reset password.');
            }
        } catch (error) {
            setSubmitError(error.response?.data?.message || 'Error occurred.');
        }
        setSubmitting(false);
    };

    return (
        <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '60vh' }}>
            <Grid item xs={12} sm={8} md={5}>
                <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
                    <Stack spacing={2} alignItems="center" textAlign="center">
                        <LockResetIcon sx={{ fontSize: 50, color: 'primary.main' }} />
                        <Typography variant="h4" fontWeight={600}>
                            Reset Password
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Create a new password for your account. Make sure it’s strong and easy to remember.
                        </Typography>
                    </Stack>

                    <Formik
                        initialValues={{ password: '' }}
                        validationSchema={Yup.object().shape({
                            password: Yup.string()
                                .required('Password is required')
                                .min(6, 'Password must be at least 6 characters')
                                .max(32, 'Password must be less than 32 characters'),
                        })}
                        onSubmit={handleResetPassword}
                    >
                        {({ errors, handleBlur, handleChange, touched, values, handleSubmit, isSubmitting }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Stack spacing={3} mt={3}>
                                    <Box>
                                        <InputLabel htmlFor="password-reset">New Password</InputLabel>
                                        <OutlinedInput
                                            id="password-reset"
                                            type="password"
                                            value={values.password}
                                            name="password"
                                            onBlur={handleBlur}
                                            onChange={(e) => handlePasswordChange(e, handleChange)}
                                            placeholder="Enter your new password"
                                            fullWidth
                                            error={Boolean(touched.password && errors.password)}
                                        />
                                        {values.password && (
                                            <FormHelperText style={{ color: level.color }}>
                                                {level.label}
                                            </FormHelperText>
                                        )}
                                        {touched.password && errors.password && (
                                            <FormHelperText error>{errors.password}</FormHelperText>
                                        )}
                                    </Box>

                                    {submitError && <Alert severity="error">{submitError}</Alert>}
                                    {submitSuccess && <Alert severity="success">{submitSuccess}</Alert>}

                                    <Button
                                        type="submit"
                                        fullWidth
                                        size="large"
                                        variant="contained"
                                        color="primary"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Resetting...' : 'Reset Password'}
                                    </Button>
                                </Stack>
                            </form>
                        )}
                    </Formik>
                </Paper>
            </Grid>
        </Grid>
    );
}
