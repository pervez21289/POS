import React, { useState } from 'react';
import PaymentService from '../../services/PaymentService';
import { Button, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RazorpayCheckout = ({ amount,plan }) => {
    const [loading, setLoading] = useState(false);
    const { userDetails } = useSelector((state) => state.users);
    const navigate = useNavigate();

    const loadRazorpay = async () => {
        setLoading(true);
        try {
            const data = await PaymentService.CreateOrder({ amount,plan});

            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                order_id: data.orderId,
                prefill: {
                    name: userDetails.name,
                    email: userDetails.email
                },
                handler: async function (response) {
                    const verifyResponse = await PaymentService.VerifyOrder({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    });
                    if (verifyResponse.status == 'Payment Verified') {
                        navigate('/ordersuccess');
                    }
                    else {
                        navigate('/orderfailed');
                    }
                }
            };
           
            const rzp = new window.Razorpay(options);
            rzp.open();

            // Handle when user closes the Razorpay modal
            rzp.on('payment.failed', () => {
                setLoading(false);
                navigate('/orderfailed');
            });

        } catch (error) {
            console.error(error);
            alert('Something went wrong!');
            setLoading(false);
            navigate('/orderfailed');
        }
    };

    return (
        <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={loadRazorpay}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
            {loading ? 'Processing...' : 'Pay Now'}
        </Button>
    );
};

export default RazorpayCheckout;
