import * as React from 'react';
import {
    Box,
    List,
    ListItem,
    Divider,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material';

export default function PaymentMode({ setPaymentModeID, PaymentModeID }) {
    return (
        <Box sx={{ minWidth: 50 }}>
            <Box
                sx={{
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography
                    id="example-payment-channel-label"
                    textColor={'text.secondary'}
                    sx={{ fontWeight: 'bold' }}
                >
                    Pay with
                </Typography>
            </Box>

            <RadioGroup
                aria-labelledby="example-payment-channel-label"
                value={PaymentModeID}
                name="example-payment-channel"
                onChange={(e) => setPaymentModeID(e.target.value)}
                row // Makes it horizontal
            >
                {[{ value: '1', label: 'UPI' }, { value: '2', label: 'Cash' }, { value: '3', label: 'Card' }].map((item, index) => (
                    <FormControlLabel
                        key={item.value}
                        value={item.value}
                        control={<Radio />}
                        label={item.label}
                    />
                ))}
            </RadioGroup>
        </Box>
    );
}
