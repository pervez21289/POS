import React from 'react';
import { ErrorOutline } from '@mui/icons-material';
import {
    Box,
    Typography,
    Paper,
    Button,
    Container,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const OrderFailed = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
                <ErrorOutline color="error" sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h4" gutterBottom color="error.main">
                    Payment Failed!
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Your payment could not be processed. Please try again or contact support.
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/pricing')} // or your payment/retry page
                >
                    Try Again
                </Button>

                <Box mt={2}>
                    <Button variant="text" onClick={() => navigate('/')}>
                        Back to Home
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default OrderFailed;
