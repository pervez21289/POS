import React from 'react';
import { CheckCircleOutline } from '@mui/icons-material';
import {
    Box,
    Typography,
    Paper,
    Button,
    Container,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
                <CheckCircleOutline color="success" sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h4" gutterBottom color="success.main">
                    Payment Successful!
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Your subscription has been activated. Thank you for your purchase!
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/dashboard/default')}
                >
                    Go to Dashboard
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

export default OrderSuccess;
