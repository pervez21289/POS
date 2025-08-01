import { useEffect, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
// project imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import UserService from '../../services/UserService';

// ============================|| JWT - REGISTER ||============================ //

export default function AuthRegister() {
    const [level, setLevel] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setLevel(strengthColor(temp));
    };

    const [searchParams] = useSearchParams();
    const auth = searchParams.get('auth'); // get auth and set route based on that

    useEffect(() => {
        changePassword('');
    }, []);

    return (
        <>
            <Formik
                initialValues={{
                    firstname: '',
                    mobile: '',
                    email: '',
                    company: '',
                    password: ''

                }}
                validationSchema={Yup.object().shape({
                    firstname: Yup.string().max(255).required('First Name is required'),
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    mobile: Yup.string()
                        .min(10)
                        .required("Mobile is required"),
                    password: Yup.string()
                        .required('Password is required')
                        .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value.trim())
                        .max(10, 'Password must be less than 10 characters')
                })}
                onSubmit={async (values, { setSubmitting, setErrors }) => {

                    try {
                        await UserService.SaveUser(values);
                        navigate('/login'); // redirect on success
                    } catch (error) {
                        const msg = error?.response?.data || 'Registration failed';
                        setErrors({ submit: msg });
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, touched, values, handleSubmit, setFieldValue }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6, lg: 12 }}>
                                <Stack sx={{ gap: 1 }}>

                                    <OutlinedInput
                                        id="firstname-login"
                                        type="firstname"
                                        value={values.firstname}
                                        name="firstname"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Name"
                                        fullWidth
                                        error={Boolean(touched.firstname && errors.firstname)}
                                    />
                                </Stack>
                                {touched.firstname && errors.firstname && (
                                    <FormHelperText error id="helper-text-firstname-signup">
                                        {errors.firstname}
                                    </FormHelperText>
                                )}
                            </Grid>

                            <Grid size={12}>
                                <Stack sx={{ gap: 1 }}>

                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.company && errors.company)}
                                        id="company-signup"
                                        value={values.company}
                                        name="company"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Business Name"
                                    />
                                </Stack>
                                {touched.company && errors.company && (
                                    <FormHelperText error id="helper-text-company-signup">
                                        {errors.company}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid size={12}>
                                <Stack sx={{ gap: 1 }}>

                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.email && errors.email)}
                                        id="email-login"
                                        type="email"
                                        value={values.email}
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Email"
                                    />
                                </Stack>
                                {touched.email && errors.email && (
                                    <FormHelperText error id="helper-text-email-signup">
                                        {errors.email}
                                    </FormHelperText>
                                )}
                            </Grid>

                            <Grid size={12}>
                                <Stack sx={{ gap: 1 }}>
                                    <OutlinedInput
                                        id="mobile-login"
                                        type="number"
                                        value={values.mobile}
                                        name="mobile"
                                        onBlur={handleBlur}
                                        onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            const { value } = e.target;
                                            const regex = /^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/;
                                            if (regex.test(value.toString())) {

                                                if (e.currentTarget.value.length <= 10) {
                                                    setFieldValue('mobile', e.currentTarget.value);
                                                    setOTPSent(false);
                                                }

                                            }
                                            else
                                                setFieldValue('mobile', e.currentTarget.value);

                                        }}
                                        placeholder="9999 999 999"
                                        fullWidth
                                        error={Boolean(touched.mobile && errors.mobile)}
                                        inputProps={{
                                            maxLength: 10,
                                            autoComplete: 'none'
                                        }}

                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LocalPhoneOutlinedIcon
                                                        aria-label="toggle password visibility"
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                        size="large"
                                                    ></LocalPhoneOutlinedIcon>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {touched.mobile && errors.mobile && (
                                        <FormHelperText
                                            error
                                            id="standard-weight-helper-text-email-login"
                                        >
                                            {errors.mobile}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid size={12}>
                                <Stack sx={{ gap: 1 }}>

                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.password && errors.password)}
                                        id="password-signup"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            handleChange(e);
                                            changePassword(e.target.value);
                                        }}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    color="secondary"
                                                >
                                                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="******"
                                    />
                                </Stack>
                                {touched.password && errors.password && (
                                    <FormHelperText error id="helper-text-password-signup">
                                        {errors.password}
                                    </FormHelperText>
                                )}
                                <FormControl fullWidth sx={{ mt: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid>
                                            <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                                        </Grid>
                                        <Grid>
                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                {level?.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </FormControl>
                            </Grid>
                            <Grid size={12}>
                                <Typography variant="body2">
                                    By Signing up, you agree to our &nbsp;
                                    <Link variant="subtitle2" component={RouterLink} to="#">
                                        Terms of Service
                                    </Link>
                                    &nbsp; and &nbsp;
                                    <Link variant="subtitle2" component={RouterLink} to="#">
                                        Privacy Policy
                                    </Link>
                                </Typography>
                            </Grid>
                            {errors.submit && (
                                <Grid size={12}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Grid>
                            )}
                            <Grid size={12}>
                                <AnimateButton>
                                    <Button type="submit" fullWidth size="large" variant="contained" color="primary">
                                        Create Account
                                    </Button>
                                </AnimateButton>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
}
