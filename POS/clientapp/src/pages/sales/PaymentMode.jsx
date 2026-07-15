import * as React from "react";
import { Box, Typography, Chip, Stack } from "@mui/material";

export default function PaymentMode({ setPaymentModeID, PaymentModeID }) {
    const options = [
        { value: "1", label: "UPI" },
        { value: "2", label: "Cash" },
        { value: "3", label: "Card" },
    ];

    return (
        <Box>
            <Typography sx={{ fontWeight: "bold", mb: 1 }} color="text.secondary">
                Pay with
            </Typography>

            <Stack direction="row" spacing={2}>
                {options.map((item) => (
                    <Chip
                        key={item.value}
                        label={item.label}
                        clickable
                        variant={PaymentModeID === item.value ? "filled" : "outlined"}
                        color={PaymentModeID === item.value ? "primary" : "default"}
                        onClick={() => setPaymentModeID(item.value)}
                        sx={{ px: 2, py: 1, fontWeight: "bold" }}
                    />
                ))}
            </Stack>
        </Box>
    );
}
