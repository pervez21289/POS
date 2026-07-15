import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    Divider,
    Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RazorpayCheckout from './RazorpayCheckout';
import PaymentService from '../../services/PaymentService';

const Order = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const plan = location.state?.plan;
 

    useEffect(() => {
        if (plan?.name === 'Free') {
            (async () => {
                try {
                    await PaymentService.SubscribeFreePlan();
                    navigate('/sales');
                } catch (err) {
                    console.error(err);
                    navigate('/orderfailed');
                }
            })();
        }
    }, [plan, navigate]);

    // Don't render anything for free plan
    
    if (plan?.name === 'Free') return <p>Loading...</p>;

    useEffect(() => {
        if (!plan) {
            navigate('/pricing');
        }
    }, [plan, navigate]);

    if (!plan) return null;

    const amount = parseInt(plan.price.replace(/[^0-9]/g, ''));
    const planname = plan.name;

    return (
        <Container maxWidth="sm" sx={{ mt: 6 }}>
            <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden' }}>
                {/* Header Section */}
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                        color: 'white',
                        p: 3,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        Review Your Plan
                    </Typography>
                    <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                        Confirm before proceeding to payment
                    </Typography>
                </Box>

                {/* Plan Details */}
                <Box sx={{ p: 4 }}>
                    <Box textAlign="center" mb={2}>
                        {plan.isPopular && (
                            <Chip label="Popular Choice" color="secondary" sx={{ mb: 2 }} />
                        )}
                        <Typography variant="h5" gutterBottom>{plan.name}</Typography>
                        <Typography variant="h1" color="primary">
                            ₹{amount} <small style={{ fontWeight: 400 }}>{plan.period}</small>
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle1" gutterBottom>
                        Features included:
                    </Typography>
                    <List dense>
                        {plan.features.map((feature, index) => (
                            <ListItem key={index}>
                                <ListItemIcon>
                                    <CheckCircleIcon color="success" />
                                </ListItemIcon>
                                <ListItemText primary={feature} />
                            </ListItem>
                        ))}
                    </List>

                    <Divider sx={{ my: 3 }} />

                    <Box textAlign="center">
                        <RazorpayCheckout amount={amount} plan={planname} />
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Order;
