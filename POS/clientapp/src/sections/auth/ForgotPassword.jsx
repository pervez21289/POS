import React, { useState } from 'react';
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

export default function ForgotPassword() {
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');

    const handleForgotPassword = async (values, { setSubmitting, resetForm }) => {
        setSubmitError('');
        setSubmitSuccess('');
        try {
            const response = await UserService.ForgotPassword(values.email);
            if (response.success) {
                setSubmitSuccess('Password reset email sent successfully.');
                resetForm();
            } else {
                setSubmitError(response.message || 'Failed to send password reset email.');
            }
        } catch (error) {
            setSubmitError(error.response?.data?.message || 'Error occurred.');
        }
        setSubmitting(false);
    };

    return (
        <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '60vh' }}>
            <Grid item xs={12} sm={8} md={5}>
                <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
                    <Stack spacing={2} alignItems="center" textAlign="center">
                        <LockResetIcon sx={{ fontSize: 50, color: 'primary.main' }} />
                        <Typography variant="h4" fontWeight={600}>
                            Forgot Password?
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Enter your registered email address and we'll send you a link to reset your password.
                        </Typography>
                    </Stack>

                    <Formik
                        initialValues={{ email: '' }}
                        validationSchema={Yup.object().shape({
                            email: Yup.string().email('Invalid email').required('Email is required'),
                        })}
                        onSubmit={handleForgotPassword}
                    >
                        {({ errors, handleBlur, handleChange, touched, values, handleSubmit, isSubmitting }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Stack spacing={3} mt={3}>
                                    <Box>
                                        <InputLabel htmlFor="email-forgot">Email Address</InputLabel>
                                        <OutlinedInput
                                            id="email-forgot"
                                            type="email"
                                            value={values.email}
                                            name="email"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            fullWidth
                                            error={Boolean(touched.email && errors.email)}
                                        />
                                        {touched.email && errors.email && (
                                            <FormHelperText error>{errors.email}</FormHelperText>
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
                                        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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
