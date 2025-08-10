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
    Tooltip,
    Button
} from '@mui/material';
import {
    CheckCircleOutline,
    CancelOutlined,
    CalendarToday,
    MonetizationOn
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const SubscriptionPlan = () => {
    const { SubscriptionPlan } = useSelector((state) => state.users);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (!SubscriptionPlan) return null;

    const isActive = SubscriptionPlan?.planStatus === 'Active';
    const isPaid = SubscriptionPlan?.paymentStatus === 'Success';

    return (
        <Card
            elevation={8}
            sx={{
                borderRadius: 6,
                maxWidth: 700,
                mx: 'auto',
                mt: 6,
                overflow: 'hidden',
                boxShadow: '0px 8px 24px rgba(0, 0, 100, 0.05)',
                opacity: isActive ? 1 : 0.9
            }}
        >
            {/* 🔵 Top header */}
            <Box
                sx={{
                    backgroundColor: '#57d465',
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
                        label={SubscriptionPlan?.planStatus}
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

            {/* ⚪ Main content */}
            <CardContent sx={{ bgcolor: 'white', px: isMobile ? 2 : 4, py: isMobile ? 3 : 4 }}>
                {isActive && (<> < Typography
                    variant={isMobile ? 'h4' : 'h3'}
                    fontWeight="bold"
                    color="text.primary"
                    sx={{ mb: 2 }}
                >
                    {SubscriptionPlan?.planName}
                </Typography>

                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body1" color="text.secondary">
                            {new Date(SubscriptionPlan?.planStartDate).toLocaleDateString()} &rarr;{' '}
                            {new Date(SubscriptionPlan?.planEndDate).toLocaleDateString()}
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                        <MonetizationOn fontSize="small" color="primary" />
                        <Typography variant="body1" color="text.secondary">
                            Amount Paid:{' '}
                            <Box component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                ₹{Number(SubscriptionPlan?.amountPaid || 0).toFixed(2)}
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
                                {SubscriptionPlan?.paymentStatus}
                            </Box>
                        </Typography>
                    </Stack>
                </>)
                }

                {/* 🔴 Show inactive plan message */}
                {!isActive && (
                    <Box
                        sx={{
                            bgcolor: '#fff4f4',
                            border: '1px dashed red',
                            borderRadius: 4,
                            p: 2,
                            mt: 4,
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="body1" color="error" fontWeight="bold">
                            Your subscription is currently inactive.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Subscribe now to continue enjoying premium features.
                        </Typography>

                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{ mt: 2, fontWeight: 'bold' }}
                            onClick={() => {
                                window.location.href = '/subscribe';
                            }}
                        >
                            Subscribe Now
                        </Button>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default SubscriptionPlan;
