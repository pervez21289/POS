import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    Avatar,
    useTheme,
} from '@mui/material';
import { PointOfSale, Speed, Security } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';

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
                    justifyContent: 'center',
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="md">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <Typography variant="h2" fontWeight={600} gutterBottom>
                            Power Your Business with Smart POS
                        </Typography>
                        <Typography variant="h6" mb={4}>
                            The next-gen cloud-based POS system designed for speed, efficiency, and growth.
                        </Typography>
                        <Button variant="contained" color="secondary" size="large" onClick={() => navigate('/register')}>
                            Get a Free Demo
                        </Button>
                    </motion.div>
                </Container>
            </Box>

            {/* Features Section */}
            <Container sx={{ py: 10 }}>
                <Typography variant="h4" align="center" fontWeight={600} gutterBottom>
                    Features that Make Us Stand Out
                </Typography>
                <Typography variant="subtitle1" align="center" mb={6}>
                    Crafted to simplify your sales operations and improve customer satisfaction.
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3.6} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                            >
                                <Card sx={{ p: 3, borderRadius: 3, boxShadow: 4, textAlign: 'center', height: '100%' }}>
                                    <Avatar
                                        sx={{ bgcolor: theme.palette.primary.main, mx: 'auto', mb: 2 }}
                                    >
                                        {feature.icon}
                                    </Avatar>
                                    <Typography
                                        variant="h6"
                                        gutterBottom
                                        sx={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                                    >
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

            {/* CTA Section */}
            <Box
                sx={{
                    backgroundColor: '#e3f2fd',
                    py: 8,
                    textAlign: 'center',
                }}
            >
                <Container>
                    <Typography variant="h5" mb={2}>
                        Ready to streamline your operations?
                    </Typography>
                    <Button variant="contained" color="primary" size="large">
                        Book a Live Demo
                    </Button>
                </Container>
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    backgroundColor: '#0d47a1',
                    color: 'white',
                    py: 2,
                    textAlign: 'center',
                }}
            >
                <Typography variant="body2">© {new Date().getFullYear()} POS System. All rights reserved.</Typography>
            </Box>
        </Box>
    );
};

export default POSLandingPage;
