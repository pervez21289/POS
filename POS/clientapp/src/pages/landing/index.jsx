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
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Stack,
    IconButton,
} from '@mui/material';
import {
    PointOfSale,
    Speed,
    Security,
    WorkspacePremium,
    MonetizationOn,
    Star,
    Inventory,
    Store,
    WifiOff,
    ExpandMore,
    Facebook,
    Twitter,
    LinkedIn,
    Instagram,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import poshero from '../../assets/images/pos-hero.jpg';     
const features = [
    {
        title: 'Fast & Intuitive Billing',
        description: 'Lightning-fast POS interface with smart shortcuts and quick billing features.',
        icon: <PointOfSale fontSize="large" color="primary" />,
    },
    {
        title: 'Real-time Inventory',
        description: 'Track stock levels, get low inventory alerts, and manage products effortlessly.',
        icon: <Inventory fontSize="large" color="primary" />,
    },
    {
        title: 'Multi-store Management',
        description: 'Manage multiple locations from a single dashboard with real-time synchronization.',
        icon: <Store fontSize="large" color="primary" />,
    },
    {
        title: 'Offline Mode',
        description: 'Keep selling even without internet. Auto-sync when connection is restored.',
        icon: <WifiOff fontSize="large" color="primary" />,
    },
    {
        title: 'Smart Analytics',
        description: 'Make data-driven decisions with comprehensive sales and inventory reports.',
        icon: <Speed fontSize="large" color="primary" />,
    },
    {
        title: 'Enterprise Security',
        description: 'Bank-grade encryption with role-based access control and audit logs.',
        icon: <Security fontSize="large" color="primary" />,
    },
];

const pricingPlans = [
    {
        title: 'Free',
        price: '$0',
        period: '/month',
        popular: false,
        features: [
            'Up to 100 invoices/month',
            'Basic Analytics',
            'Single Store',
            'Email Support',
            'Basic Inventory Management',
            'Cloud Backup'
        ],
        icon: <Star color="primary" />,
    },
    {
        title: 'Pro',
        price: '$49',
        period: '/month',
        popular: true,
        features: [
            'Unlimited invoices',
            'Advanced Analytics',
            'Up to 3 Stores',
            'Priority Support',
            'Advanced Inventory',
            'Customer Management',
            'Offline Mode'
        ],
        icon: <MonetizationOn color="secondary" />,
    },
    {
        title: 'Enterprise',
        price: 'Custom',
        period: '',
        popular: false,
        features: [
            'Unlimited Everything',
            'Custom Analytics',
            'Unlimited Stores',
            '24/7 Dedicated Support',
            'Custom Integration',
            'White Label Option',
            'API Access'
        ],
        icon: <WorkspacePremium color="warning" />,
    },
];

const testimonials = [
    {
        name: 'Sarah Johnson',
        role: 'Restaurant Owner',
        quote: 'NexBill transformed how we handle rush hours. The speed and reliability are impressive!',
        avatar: '/assets/images/users/sarah.jpg'
    },
    {
        name: 'Michael Chen',
        role: 'Retail Chain Manager',
        quote: 'Managing multiple stores has never been easier. The real-time sync is a game-changer.',
        avatar: '/assets/images/users/michael.jpg'
    },
    {
        name: 'Emma Davis',
        role: 'Cafe Owner',
        quote: 'The offline mode saved us during internet outages. Customer support is exceptional!',
        avatar: '/assets/images/users/emma.jpg'
    }
];

const faqs = [
    {
        question: 'How easy is it to get started with NexBill?',
        answer: 'Getting started with NexBill is simple! Sign up for a free account, and you can start billing within minutes. Our setup wizard will guide you through the process of adding your products and configuring your store settings.'
    },
    {
        question: 'Can I use NexBill offline?',
        answer: 'Yes! NexBill works seamlessly offline. You can continue making sales during internet outages, and all data will automatically sync once the connection is restored.'
    },
    {
        question: 'Is my data secure with NexBill?',
        answer: 'Absolutely! We use bank-grade encryption to protect your data. All information is stored in secure cloud servers with regular backups. We are also compliant with industry security standards.'
    },
    {
        question: 'Do you offer custom integrations?',
        answer: 'Yes, our Enterprise plan includes custom integrations with your existing systems. Contact our sales team to discuss your specific requirements.'
    }
];

const POSLandingPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    minHeight: '90vh',
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 20% 150%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)',
                    },
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <Typography 
                                    variant="h2" 
                                    fontWeight={700} 
                                    gutterBottom
                                    sx={{
                                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                                        lineHeight: 1.2,
                                    }}
                                >
                                    Smart POS System for Modern Businesses
                                </Typography>
                                <Typography 
                                    variant="h5" 
                                    mb={4}
                                    sx={{ 
                                        opacity: 0.9,
                                        fontWeight: 400,
                                        lineHeight: 1.5,
                                    }}
                                >
                                    Simplify billing, manage inventory, and grow your business with NexBill.
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            bgcolor: '#fff',
                                            color: '#1976d2',
                                            fontSize: '1.1rem',
                                            py: 1.5,
                                            px: 4,
                                            '&:hover': {
                                                bgcolor: 'rgba(255,255,255,0.9)',
                                            },
                                        }}
                                        onClick={() => navigate('/register')}
                                    >
                                        Get Started Free
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        sx={{
                                            borderColor: 'rgba(255,255,255,0.5)',
                                            color: '#fff',
                                            fontSize: '1.1rem',
                                            py: 1.5,
                                            px: 4,
                                            '&:hover': {
                                                borderColor: '#fff',
                                                bgcolor: 'rgba(255,255,255,0.1)',
                                            },
                                        }}
                                        onClick={() => navigate('/contact')}
                                    >
                                        Schedule a Demo
                                    </Button>
                                </Stack>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <Box
                                    component="img"
                                    src={poshero}
                                    alt="NexBill POS System"
                                sx={{
                                    width: '100%',
                                    maxHeight: 500,
                                    borderRadius: 4,
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                    transform: 'perspective(1000px) rotateY(-5deg)',
                                }}
                            />
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* About Section */}
            <Container sx={{ py: 12 }}>
                <Grid container spacing={8} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <Typography variant="h3" fontWeight={700} gutterBottom color="primary">
                                Why NexBill?
                            </Typography>
                            <Box sx={{ mb: 4 }}>
                                {[
                                    'Fast and intuitive billing process',
                                    'Real-time inventory tracking',
                                    'Multi-store management capabilities',
                                    'Works offline - never miss a sale',
                                ].map((benefit, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2,
                                            '&:last-child': { mb: 0 },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: '50%',
                                                bgcolor: 'primary.main',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mr: 2,
                                            }}
                                        >
                                            <Typography color="white" fontSize={14}>✓</Typography>
                                        </Box>
                                        <Typography variant="h6" color="text.primary">
                                            {benefit}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                                Whether you run a small retail shop or a multi-branch business, NexBill provides everything you need for modern retail operations. With smart integrations and an intuitive interface, you'll wonder how you ever managed without it.
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                color="primary"
                                onClick={() => navigate('/register')}
                                sx={{ px: 4, py: 1.5 }}
                            >
                                Try It Free
                            </Button>
                        </motion.div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <Box
                                component="img"
                                src="/assets/images/pos-hero.jpg"
                                alt="NexBill Interface"
                                sx={{
                                    width: '100%',
                                    borderRadius: 4,
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                }}
                            />
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>

            {/* Features */}
            <Box sx={{ bgcolor: '#f8fafc', py: 12 }}>
                <Container>
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography 
                            variant="h3" 
                            fontWeight={700} 
                            gutterBottom
                            sx={{ color: theme.palette.primary.main }}
                        >
                            Features that Power Your Business
                        </Typography>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                color: 'text.secondary',
                                maxWidth: 600,
                                mx: 'auto',
                                mb: 1
                            }}
                        >
                            Everything you need to run your business efficiently
                        </Typography>
                    </Box>
                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card 
                                        sx={{ 
                                            p: 3, 
                                            height: '100%',
                                            borderRadius: 4,
                                            transition: 'all 0.3s ease',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            boxShadow: 'none',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                                                borderColor: 'transparent',
                                            }
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 3,
                                                bgcolor: 'primary.lighter',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mb: 2,
                                                '& svg': {
                                                    fontSize: 30,
                                                    color: theme.palette.primary.main,
                                                }
                                            }}
                                        >
                                            {feature.icon}
                                        </Box>
                                        <Typography 
                                            variant="h5" 
                                            gutterBottom
                                            sx={{ fontWeight: 600 }}
                                        >
                                            {feature.title}
                                        </Typography>
                                        <Typography 
                                            variant="body1" 
                                            color="text.secondary"
                                            sx={{ lineHeight: 1.7 }}
                                        >
                                            {feature.description}
                                        </Typography>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Testimonials */}
            <Container sx={{ py: 12 }}>
                <Typography 
                    variant="h3" 
                    align="center" 
                    fontWeight={700} 
                    gutterBottom
                    color="primary"
                >
                    Trusted by Businesses
                </Typography>
                <Typography 
                    variant="h6" 
                    align="center" 
                    color="text.secondary" 
                    sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}
                >
                    See what our customers say about their experience with NexBill
                </Typography>
                <Grid container spacing={4}>
                    {testimonials.map((testimonial, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card
                                    sx={{
                                        p: 4,
                                        height: '100%',
                                        borderRadius: 4,
                                        boxShadow: 'none',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            mb: 3,
                                            fontStyle: 'italic',
                                            color: 'text.secondary',
                                            lineHeight: 1.7
                                        }}
                                    >
                                        "{testimonial.quote}"
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar
                                            src={testimonial.avatar}
                                            sx={{ width: 48, height: 48, mr: 2 }}
                                        />
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {testimonial.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {testimonial.role}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Pricing */}
            <Box sx={{ bgcolor: '#f8fafc', py: 12 }}>
                <Container>
                    <Typography 
                        variant="h3" 
                        align="center" 
                        fontWeight={700} 
                        gutterBottom
                        color="primary"
                    >
                        Simple, Transparent Pricing
                    </Typography>
                    <Typography 
                        variant="h6" 
                        align="center" 
                        color="text.secondary"
                        sx={{ mb: 8, maxWidth: 600, mx: 'auto' }}
                    >
                        Choose the perfect plan for your business needs
                    </Typography>
                    <Grid container spacing={4} alignItems="center">
                        {pricingPlans.map((plan, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card
                                        sx={{
                                            p: 4,
                                            height: '100%',
                                            borderRadius: 4,
                                            position: 'relative',
                                            transition: 'all 0.3s ease',
                                            border: '1px solid',
                                            borderColor: plan.popular ? 'primary.main' : 'divider',
                                            boxShadow: plan.popular ? '0 8px 24px rgba(0,0,0,0.12)' : 'none',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                                            },
                                        }}
                                    >
                                        {plan.popular && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 12,
                                                    right: 12,
                                                    bgcolor: 'primary.main',
                                                    color: 'white',
                                                    px: 2,
                                                    py: 0.5,
                                                    borderRadius: 6,
                                                    fontSize: '0.875rem',
                                                }}
                                            >
                                                Popular
                                            </Box>
                                        )}
                                        <Box 
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                borderRadius: 3,
                                                bgcolor: 'primary.lighter',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mb: 3,
                                            }}
                                        >
                                            {plan.icon}
                                        </Box>
                                        <Typography variant="h5" fontWeight={600} gutterBottom>
                                            {plan.title}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                                            <Typography variant="h3" fontWeight={700} color="primary">
                                                {plan.price}
                                            </Typography>
                                            <Typography variant="h6" color="text.secondary" sx={{ ml: 1 }}>
                                                {plan.period}
                                            </Typography>
                                        </Box>
                                        {plan.features.map((feature, i) => (
                                            <Box
                                                key={i}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mb: 1.5,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 20,
                                                        height: 20,
                                                        borderRadius: '50%',
                                                        bgcolor: 'primary.lighter',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mr: 1.5,
                                                    }}
                                                >
                                                    <Typography color="primary" fontSize={12}>✓</Typography>
                                                </Box>
                                                <Typography variant="body1" color="text.secondary">
                                                    {feature}
                                                </Typography>
                                            </Box>
                                        ))}
                                        <Button
                                            variant={plan.popular ? "contained" : "outlined"}
                                            color="primary"
                                            fullWidth
                                            size="large"
                                            sx={{ mt: 4 }}
                                            onClick={() => navigate('/register')}
                                        >
                                            Get Started
                                        </Button>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* FAQ Section */}
            <Container sx={{ py: 12 }}>
                <Typography 
                    variant="h3" 
                    align="center" 
                    fontWeight={700} 
                    gutterBottom
                    color="primary"
                >
                    Frequently Asked Questions
                </Typography>
                <Typography 
                    variant="h6" 
                    align="center" 
                    color="text.secondary"
                    sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
                >
                    Got questions? We've got answers
                </Typography>
                <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                    {faqs.map((faq, index) => (
                        <Accordion
                            key={index}
                            sx={{
                                mb: 2,
                                boxShadow: 'none',
                                '&:before': { display: 'none' },
                                borderRadius: '8px !important',
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                sx={{
                                    '& .MuiAccordionSummary-content': {
                                        my: 2,
                                    },
                                }}
                            >
                                <Typography variant="h6" fontWeight={500}>
                                    {faq.question}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                    {faq.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Container>

            {/* CTA Section */}
            <Box 
                sx={{ 
                    bgcolor: 'primary.main',
                    color: 'white',
                    py: 12,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 20% 150%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)',
                    },
                }}
            >
                <Container>
                    <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                        <Typography variant="h3" fontWeight={700} gutterBottom>
                            Ready to Transform Your Business?
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                            Join thousands of businesses that trust NexBill
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                bgcolor: 'white',
                                color: 'primary.main',
                                fontSize: '1.1rem',
                                py: 1.5,
                                px: 4,
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.9)',
                                },
                            }}
                            onClick={() => navigate('/register')}
                        >
                            Start Free Trial
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ bgcolor: '#0A1929', color: 'white', py: 6 }}>
                <Container>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                NexBill
                            </Typography>
                            <Typography variant="body2" color="grey.400" sx={{ mb: 2 }}>
                                Smart POS System for Modern Businesses
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <IconButton size="small" sx={{ color: 'grey.400' }}>
                                    <Facebook />
                                </IconButton>
                                <IconButton size="small" sx={{ color: 'grey.400' }}>
                                    <Twitter />
                                </IconButton>
                                <IconButton size="small" sx={{ color: 'grey.400' }}>
                                    <LinkedIn />
                                </IconButton>
                                <IconButton size="small" sx={{ color: 'grey.400' }}>
                                    <Instagram />
                                </IconButton>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                Product
                            </Typography>
                            <Stack spacing={1}>
                                <Typography variant="body2" color="grey.400">Features</Typography>
                                <Typography variant="body2" color="grey.400">Pricing</Typography>
                                <Typography variant="body2" color="grey.400">Demo</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                Company
                            </Typography>
                            <Stack spacing={1}>
                                <Typography variant="body2" color="grey.400">About</Typography>
                                <Typography variant="body2" color="grey.400">Blog</Typography>
                                <Typography variant="body2" color="grey.400">Careers</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                Contact
                            </Typography>
                            <Typography variant="body2" color="grey.400" gutterBottom>
                                support@nexbill.com
                            </Typography>
                            <Typography variant="body2" color="grey.400">
                                +1 (555) 123-4567
                            </Typography>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                        <Typography variant="body2" color="grey.400">
                            © {new Date().getFullYear()} NexBill. All rights reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default POSLandingPage;
