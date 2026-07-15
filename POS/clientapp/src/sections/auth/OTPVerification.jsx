import React, { useState, useRef } from 'react';
import { Link as RouterLink, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Button,
    Grid,
    OutlinedInput,
    Typography,
    FormHelperText,
} from '@mui/material';

import UserService from '../../services/UserService';
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "./../../store/reducers/users";

export default function OTPVerification() {
    const [submitError, setSubmitError] = useState('');
    const [OTPError, setOTPError] = useState("");
    const otpRefs = useRef([]);
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const handleVerifyOTP = async () => {
       
        setOTPError('');
        const registeredUserId = location.state?.registeredUserId;
        try {
            const response = await UserService.ValidateOTP({ userId: registeredUserId, otp });
            
            if (response.success) {
                window.localStorage.setItem('userDetails', JSON.stringify(response));
                dispatch(setUserDetails({ userDetails: response }));

                const redirectTo = location.state?.redirectTo || '/';
                const plan = location.state?.plan;
                if (redirectTo && plan) {
                    navigate('/login', { state: { redirectTo: '/order', plan: plan } });
                }
                else {
                    navigate('/dashboard/default');
                }
            }
        } catch (err) {
            setOTPError("Invalid OTP, please try again.");
        }
    };

    return (
        <Box sx={{ mt: 0 }}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleVerifyOTP();
                }}
            >
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Enter OTP sent to your mobile
                </Typography>

                <Grid container spacing={1} justifyContent="center">
                    {[...Array(4)].map((_, index) => (
                        <Grid item key={index}>
                            <OutlinedInput
                                inputRef={(el) => (otpRefs.current[index] = el)}
                                value={otp[index] || ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d?$/.test(val)) { // allow only one digit
                                        const newOtp = [...otp];
                                        newOtp[index] = val;
                                        setOtp(newOtp.join(""));
                                        if (val && index < otpRefs.current.length - 1) {
                                            otpRefs.current[index + 1].focus();
                                        }
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Backspace" && !otp[index] && index > 0) {
                                        otpRefs.current[index - 1].focus();
                                    }
                                }}
                                inputProps={{
                                    maxLength: 1,
                                    style: {
                                        textAlign: "center",
                                        fontSize: "1.5rem",
                                        width: "50px",
                                    },
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Verify OTP
                </Button>

                {OTPError && (
                    <Grid item xs={12}>
                        <FormHelperText error>{OTPError}</FormHelperText>
                    </Grid>
                )}
            </form>
        </Box>
    );
}
