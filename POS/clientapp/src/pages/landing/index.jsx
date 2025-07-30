import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Avatar,
    useTheme,
    CardActions,
} from '@mui/material';
import { PointOfSale, Speed, Security, WorkspacePremium, MonetizationOn, Star } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import poshero from '../../assets/images/hero.png';     
const features = [
    {
        title: 'Smart Billing',
        description: 'Generate digital receipts, barcodes, and detailed tax invoices with ease.',
        icon: <PointOfSale fontSize="large" color="primary" />,
    },
    {
        title: 'Real-time Analytics',
        description: 'Track sales, inventory, and customer behavior instantly.',
        icon: <Speed fontSize="large" color="primary" />,
    },
    {
        title: 'Robust Security',
        description: 'Advanced encryption, role-based access and audit logs.',
        icon: <Security fontSize="large" color="primary" />,
    },
];

const pricingPlans = [
    {
        title: 'Free',
        price: '₹0',
        invoices: 'Up to 100 invoices/month',
        features: ['Basic Analytics', 'Email Support'],
        icon: <Star color="primary" />,
    },
    {
        title: 'Silver',
        price: '₹499',
        invoices: 'Up to 1000 invoices/month',
        features: ['Priority Support', 'Advanced Reports'],
        icon: <MonetizationOn color="secondary" />,
    },
    {
        title: 'Gold',
        price: '₹999',
        invoices: 'Unlimited invoices',
        features: ['All Features Unlocked', 'Dedicated Support'],
        icon: <WorkspacePremium color="warning" />,
    },
];

const POSLandingPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #1976d2 30%, #42a5f5 90%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    py: { xs: 6, md: 10 },
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h3" fontWeight={700} gutterBottom>
                                NexBill – Smart POS for Modern Businesses
                            </Typography>
                            <Typography variant="h6" mb={3}>
                                Streamline your billing, inventory, and insights with our
                                cloud-based POS system built for speed and growth.
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{ backgroundColor: '#ffb300', color: '#fff' }}
                                onClick={() => window.location.href = '/register'}
                            >
                                Get a Free Demo
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                component="img"
                                src={poshero}
                                alt="POS system illustration"
                                sx={{
                                    width: '100%',
                                    maxHeight: 400,
                                    borderRadius: 2,
                                    boxShadow: 6,
                                }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* About NexBill */}
            <Container sx={{ py: 10 }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <motion.img
                            src="/assets/pos-about.png"
                            alt="About NexBill"
                            style={{ width: '100%' }}
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Typography variant="h4" fontWeight={600} gutterBottom>
                                Why Choose NexBill POS?
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                NexBill helps businesses digitize their point-of-sale operations with ease. Whether you run a small retail shop or a multi-branch business, NexBill provides everything — from quick billing to detailed analytics. With smart integrations, intuitive UX, and robust support, NexBill is your all-in-one solution for smarter sales.
                            </Typography>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>

            {/* Features */}
            <Container sx={{ py: 10 }}>
                <Typography variant="h4" align="center" fontWeight={600} gutterBottom>
                    Features that Make Us Stand Out
                </Typography>
                <Typography variant="subtitle1" align="center" mb={6}>
                    Crafted to simplify your sales operations and improve customer satisfaction.
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                            >
                                <Card sx={{ p: 3, borderRadius: 3, boxShadow: 4, textAlign: 'center', height: '100%' }}>
                                    <Avatar sx={{ bgcolor: theme.palette.primary.main, mx: 'auto', mb: 2 }}>
                                        {feature.icon}
                                    </Avatar>
                                    <Typography variant="h6" gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Pricing */}
            <Box sx={{ backgroundColor: '#f4f6f8', py: 10 }}>
                <Container>
                    <Typography variant="h4" align="center" fontWeight={600} gutterBottom>
                        Choose Your Plan
                    </Typography>
                    <Typography variant="subtitle1" align="center" mb={6}>
                        Transparent pricing to match your business needs.
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {pricingPlans.map((plan, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                >
                                    <Card
                                        sx={{
                                            p: 4,
                                            borderRadius: 4,
                                            textAlign: 'center',
                                            boxShadow: 6,
                                            backgroundColor: 'white',
                                            transition: '0.3s',
                                            '&:hover': {
                                                boxShadow: 10,
                                                transform: 'translateY(-5px)',
                                            },
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: theme.palette.primary.light,
                                                width: 56,
                                                height: 56,
                                                mx: 'auto',
                                                mb: 2,
                                            }}
                                        >
                                            {plan.icon}
                                        </Avatar>
                                        <Typography variant="h6" fontWeight={600}>
                                            {plan.title}
                                        </Typography>
                                        <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
                                            {plan.price}
                                        </Typography>
                                        <Typography variant="subtitle2" color="text.secondary" mb={2}>
                                            {plan.invoices}
                                        </Typography>
                                        {plan.features.map((f, i) => (
                                            <Typography variant="body2" key={i} color="text.secondary">
                                                • {f}
                                            </Typography>
                                        ))}
                                        <CardActions sx={{ justifyContent: 'center', mt: 3 }}>
                                            <Button variant="outlined" color="primary" fullWidth onClick={() => navigate('/register')}>
                                                Choose Plan
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* CTA */}
            <Box sx={{ backgroundColor: '#e3f2fd', py: 8, textAlign: 'center' }}>
                <Container>
                    <Typography variant="h5" mb={2}>
                        Ready to streamline your operations?
                    </Typography>
                    <Button variant="contained" color="primary" size="large" onClick={() => navigate('/register')}>
                        Book a Live Demo
                    </Button>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ backgroundColor: '#0d47a1', color: 'white', py: 2, textAlign: 'center' }}>
                <Typography variant="body2">
                    © {new Date().getFullYear()} NexBill POS System. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
};

export default POSLandingPage;
