import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Divider,
    Stack,
    useTheme,
    useMediaQuery,
    Tooltip
} from '@mui/material';
import {
    CheckCircleOutline,
    CancelOutlined,
    CalendarToday,
    MonetizationOn
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const SubscriptionPlan = () => {
    const { userDetails } = useSelector((state) => state.users);
    const [plan, setPlan] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        if (userDetails?.plan) {
            try {
                const parsedPlan = JSON.parse(userDetails.plan);
                setPlan(parsedPlan);
            } catch (e) {
                console.error('Invalid plan JSON:', e);
            }
        }
    }, [userDetails]);

    if (!plan) return null;

    const isActive = plan?.PlanStatus === 'Active';
    const isPaid = plan?.PaymentStatus === 'Success';

    return (
        <Card
            elevation={8}
            sx={{
                borderRadius: 6,
                maxWidth: 700,
                mx: 'auto',
                mt: 6,
                overflow: 'hidden', // ensures rounded corners apply to inner elements
                boxShadow: '0px 8px 24px rgba(0, 0, 100, 0.05)',
            }}
        >
            {/* 🔵 Top header section with background */}
            <Box
                sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    px: isMobile ? 2 : 4,
                    py: isMobile ? 2 : 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 1,
                }}
            >
                <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold">
                    Your Subscription Plan
                </Typography>

                <Tooltip title={isActive ? 'Subscription is Active' : 'Subscription is Inactive'}>
                    <Chip
                        icon={
                            isActive ? (
                                <CheckCircleOutline sx={{ color: 'green' }} />
                            ) : (
                                <CancelOutlined sx={{ color: 'red' }} />
                            )
                        }
                        label={plan?.PlanStatus}
                        variant="filled"
                        sx={{
                            backgroundColor: 'white',
                            color: isActive ? 'green' : 'red',
                            fontWeight: 600,
                            px: 1.5,
                            py: 0.5,
                            fontSize: '0.875rem',
                            borderRadius: '8px',
                        }}
                    />
                </Tooltip>
            </Box>

            {/* ⚪ White content area */}
            <CardContent sx={{ bgcolor: 'white', px: isMobile ? 2 : 4, py: isMobile ? 3 : 4 }}>
                <Typography
                    variant={isMobile ? 'h4' : 'h3'}
                    fontWeight="bold"
                    color="text.primary"
                    sx={{ mb: 2 }}
                >
                    {plan?.PlanName}
                </Typography>

                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body1" color="text.secondary">
                        {new Date(plan?.PlanStartDate).toLocaleDateString()} &rarr;{' '}
                        {new Date(plan?.PlanEndDate).toLocaleDateString()}
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    <MonetizationOn fontSize="small" color="primary" />
                    <Typography variant="body1" color="text.secondary">
                        Amount Paid:{' '}
                        <Box component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            ₹{Number(plan?.AmountPaid || 0).toFixed(2)}
                        </Box>
                    </Typography>
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Stack direction="row" spacing={2} alignItems="center">
                    <MonetizationOn color={isPaid ? 'primary' : 'error'} />
                    <Typography variant="body1" color="text.secondary">
                        Payment Status:{' '}
                        <Box
                            component="span"
                            sx={{
                                color: isPaid ? theme.palette.primary.main : 'red',
                                fontWeight: 'bold'
                            }}
                        >
                            {plan?.PaymentStatus}
                        </Box>
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default SubscriptionPlan;
