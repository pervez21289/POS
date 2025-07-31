import React, { useState, useRef, useEffect } from 'react';
import POSHERO from '../../assets/images/pos.jpg';

// --- CSS directly embedded ---
const AppStyles = `
:root {
    --primary-blue: #1976d2;
    --light-grey: #f8f8f8;
    --dark-grey: #333;
    --text-color: #555;
    --white: #fff;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Poppins', sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--white);
    scroll-behavior: smooth;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* --- Global Button Styles --- */
.btn {
    display: inline-block;
    padding: 15px 30px;
    border-radius: 30px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    border: none;
    cursor: pointer;
}

.btn-primary {
    background-color: var(--primary-blue);
    color: var(--white);
}

.btn-primary:hover {
    background-color: #1565c0;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.btn-secondary {
    background-color: var(--white);
    color: var(--primary-blue);
    border: 2px solid var(--primary-blue);
}

.btn-secondary:hover {
    background-color: var(--primary-blue);
    color: var(--white);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

/* --- Section Heading --- */
.section {
    padding: 80px 0;
    text-align: center;
}

.section-heading {
    font-size: 2.5rem;
    color: var(--primary-blue);
    margin-bottom: 60px;
    font-weight: 600;
}

/* --- Animations --- */
@keyframes fadeInSlideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animated {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.animated.fade-in {
    opacity: 1;
    transform: translateY(0);
}


/* --- Header --- */
header {
    background-color: var(--white);
    padding: 20px 0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    position: sticky;
    top: 0;
    z-index: 1000;
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--primary-blue);
    text-decoration: none;
}

.nav-links a {
    text-decoration: none;
    color: var(--dark-grey);
    font-weight: 500;
    margin-left: 30px;
    transition: color 0.3s ease;
}

.nav-links a:hover {
    color: var(--primary-blue);
}

/* --- Hero Section --- */
.hero-section {
    background: linear-gradient(135deg, var(--white) 0%, var(--light-grey) 100%);
    padding: 100px 0;
    display: flex;
    align-items: center;
    min-height: 80vh;
    overflow: hidden;
}

.hero-content {
    flex: 1;
    padding-right: 40px;
}

.hero-content h1 {
    font-size: 3.5rem;
    color: var(--primary-blue);
    margin-bottom: 20px;
    line-height: 1.2;
    font-weight: 700;
}

.hero-content p {
    font-size: 1.3rem;
    color: var(--dark-grey);
    margin-bottom: 40px;
}

.cta-buttons .btn {
    margin-right: 20px;
}
.cta-buttons .btn:last-child {
    margin-right: 0;
}


.hero-image {
    flex: 1;
    text-align: right;
}

.hero-image img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

/* --- About Section --- */
.about-section {
    background-color: var(--light-grey);
    padding: 100px 0;
}

.about-content {
    display: flex;
    align-items: center;
    gap: 60px;
    text-align: left;
}

.about-text {
    flex: 1;
}

.about-text h2 {
    font-size: 2.2rem;
    color: var(--primary-blue);
    margin-bottom: 30px;
    font-weight: 600;
}

.benefit-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 25px;
}

.benefit-item i {
    font-size: 2rem;
    color: var(--primary-blue);
    margin-right: 20px;
    width: 40px;
    text-align: center;
}

.benefit-item h3 {
    font-size: 1.3rem;
    color: var(--dark-grey);
    margin-bottom: 5px;
    font-weight: 600;
}

.benefit-item p {
    font-size: 1rem;
    color: var(--text-color);
}

.about-image {
    flex: 1;
    text-align: center;
}

.about-image img {
    max-width: 90%;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

/* --- Features Section --- */
.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.feature-card {
    background-color: var(--white);
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.08);
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.feature-card i {
    font-size: 3rem;
    color: var(--primary-blue);
    margin-bottom: 20px;
}

.feature-card h3 {
    font-size: 1.5rem;
    color: var(--dark-grey);
    margin-bottom: 10px;
    font-weight: 600;
}

.feature-card p {
    font-size: 1rem;
    color: var(--text-color);
}

/* --- Testimonials Section --- */
.testimonials-section {
    background-color: var(--light-grey);
}

.testimonial-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
}

.testimonial-card {
    background-color: var(--white);
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.08);
    text-align: left;
}

.testimonial-card p {
    font-size: 1.1rem;
    font-style: italic;
    color: var(--dark-grey);
    margin-bottom: 20px;
}

.customer-info {
    display: flex;
    align-items: center;
}

.customer-info img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 15px;
    border: 2px solid var(--primary-blue);
}

.customer-info h4 {
    font-size: 1.1rem;
    color: var(--primary-blue);
    margin-bottom: 5px;
    font-weight: 600;
}

.customer-info span {
    font-size: 0.9rem;
    color: var(--text-color);
}

/* --- Pricing Section --- */
.pricing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-top: 50px;
}

.pricing-card {
    background-color: var(--white);
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.08);
    text-align: center;
    position: relative;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.pricing-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.pricing-card.popular {
    border: 3px solid var(--primary-blue);
    box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3);
}

.pricing-card h3 {
    font-size: 1.8rem;
    color: var(--primary-blue);
    margin-bottom: 20px;
    font-weight: 700;
}

.pricing-card .price {
    font-size: 3rem;
    font-weight: 700;
    color: var(--dark-grey);
    margin-bottom: 20px;
}

.pricing-card .price span {
    font-size: 1.2rem;
    color: var(--text-color);
    font-weight: 400;
}

.pricing-card ul {
    list-style: none;
    text-align: left;
    margin-bottom: 30px;
}

.pricing-card ul li {
    margin-bottom: 10px;
    color: var(--text-color);
    font-size: 1rem;
    display: flex;
    align-items: center;
}

.pricing-card ul li::before {
    content: '✓';
    color: var(--primary-blue);
    margin-right: 10px;
    font-weight: 700;
}

.pricing-card .btn {
    width: 100%;
    padding: 12px 0;
    margin-top: 20px;
}

.popular-badge {
    background-color: var(--primary-blue);
    color: var(--white);
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
}

/* --- FAQ Section --- */
.faq-section {
    background-color: var(--light-grey);
}

.accordion {
    max-width: 800px;
    margin: 0 auto;
    text-align: left;
}

.accordion-item {
    background-color: var(--white);
    border-radius: 8px;
    margin-bottom: 15px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    overflow: hidden;
}

.accordion-header {
    padding: 20px 25px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--dark-grey);
    transition: background-color 0.3s ease;
}

.accordion-header:hover {
    background-color: #f0f0f0;
}

.accordion-header i {
    font-size: 1.2rem;
    transition: transform 0.3s ease;
}

.accordion-content {
    padding: 0 25px 20px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease-out, padding 0.4s ease-out;
    color: var(--text-color);
    font-size: 1rem;
}

.accordion-item.active .accordion-content {
    max-height: 200px; /* Adjust as needed */
    padding-top: 10px;
}

.accordion-item.active .accordion-header i {
    transform: rotate(180deg);
}

/* --- Footer --- */
footer {
    background-color: var(--dark-grey);
    color: var(--white);
    padding: 60px 0 30px;
    font-size: 0.95rem;
}

.footer-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 40px;
}

.footer-col {
    flex: 1;
    min-width: 200px;
}

.footer-col h4 {
    font-size: 1.2rem;
    margin-bottom: 20px;
    color: var(--primary-blue);
    font-weight: 600;
}

.footer-col p, .footer-col ul {
    margin-bottom: 10px;
}

.footer-col ul {
    list-style: none;
}

.footer-col ul li a {
    text-decoration: none;
    color: var(--white);
    transition: color 0.3s ease;
    display: block;
    margin-bottom: 8px;
}

.footer-col ul li a:hover {
    color: var(--primary-blue);
}

.social-icons a {
    color: var(--white);
    font-size: 1.5rem;
    margin-right: 15px;
    transition: color 0.3s ease;
}

.social-icons a:hover {
    color: var(--primary-blue);
}

.footer-bottom {
    text-align: center;
    margin-top: 50px;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.1);
}

/* --- Responsive Design --- */
@media (max-width: 992px) {
    .hero-content h1 {
        font-size: 3rem;
    }
    .hero-content p {
        font-size: 1.1rem;
    }
    .about-content {
        flex-direction: column;
        text-align: center;
    }
    .about-text, .about-image {
        padding-right: 0;
    }
    .about-image img {
        max-width: 70%;
        margin-top: 40px;
    }
    .testimonial-grid, .pricing-grid, .features-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .hero-section {
        flex-direction: column;
        text-align: center;
        padding: 80px 0 50px;
    }
    .hero-content {
        padding-right: 0;
    }
    .hero-image {
        margin-top: 40px;
        text-align: center;
    }
    .hero-image img {
        max-width: 80%;
    }
    .cta-buttons .btn {
        display: block;
        margin: 15px auto;
        width: 80%;
    }
    .nav-links {
        display: none;
    }
    .section-heading {
        font-size: 2rem;
    }
    .footer-content {
        flex-direction: column;
        text-align: center;
    }
    .footer-col {
        min-width: unset;
        width: 100%;
    }
    .social-icons {
        margin-top: 20px;
    }
}

@media (max-width: 480px) {
    .hero-content h1 {
        font-size: 2.2rem;
    }
    .hero-content p {
        font-size: 1rem;
    }
    .feature-card, .testimonial-card, .pricing-card, .accordion-item {
        padding: 20px;
    }
    .pricing-card .price {
        font-size: 2.5rem;
    }
}
`;

// --- Custom Hook: useIntersectionObserver ---
const useIntersectionObserver = (ref, options, callback, delay = 0) => {
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                if (delay > 0) {
                    setTimeout(() => {
                        callback(entry);
                    }, delay);
                } else {
                    callback(entry);
                }
            }
        }, options);

        const currentRef = ref.current;

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, options, callback, delay]);
};

// --- Component: Header ---
function Header() {
    return (
        <header>
            <div className="container">
                <nav>
                    <a href="#" className="logo">NexBill</a>
                    <div className="nav-links">
                        <a href="#about">Why NexBill?</a>
                        <a href="#features">Features</a>
                        <a href="#pricing">Pricing</a>
                        <a href="#faq">FAQ</a>
                        <a href="#contact">Contact</a>
                    </div>
                </nav>
            </div>
        </header>
    );
}

// --- Component: Hero ---
function Hero() {
    const contentRef = useRef(null);
    const imageRef = useRef(null);

    useIntersectionObserver(contentRef, { threshold: 0.1 }, (entry) => {
        if (entry.isIntersecting) entry.target.classList.add('fade-in');
    });
    useIntersectionObserver(imageRef, { threshold: 0.1 }, (entry) => {
        if (entry.isIntersecting) entry.target.classList.add('fade-in');
    }, 200);

    return (
        <section className="hero-section">
            <div className="container">
                <div className="hero-content animated" ref={contentRef}>
                    <h1>Smart POS System for Modern Businesses</h1>
                    <p>Simplify billing, manage inventory, and grow your business with NexBill.</p>
                    <div className="cta-buttons">
                        <a href="#" className="btn btn-primary">Get Started Free</a>
                        <a href="#" className="btn btn-secondary">Schedule a Demo</a>
                    </div>
                </div>
                <div className="hero-image animated" ref={imageRef}>
                    <img src={POSHERO} alt="NexBill POS Dashboard" />
                </div>
            </div>
        </section>
    );
}

// --- Component: About ---
function About() {
    const aboutSectionRef = useRef(null);
    useIntersectionObserver(aboutSectionRef, { threshold: 0.2 }, (entry) => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.benefit-item').forEach((item, index) => {
                item.style.animationDelay = `${index * 0.2}s`;
                item.classList.add('fade-in');
            });
            if (entry.target.querySelector('.about-image img')) {
                entry.target.querySelector('.about-image img').classList.add('fade-in');
            }
        }
    });

    return (
        <section id="about" className="section about-section" ref={aboutSectionRef}>
            <div className="container">
                <div className="about-content">
                    <div className="about-text">
                        <h2>Why NexBill?</h2>
                        <div className="benefit-item animated">
                            <i className="fas fa-bolt"></i>
                            <div>
                                <h3>Fast and intuitive billing</h3>
                                <p>Streamline your checkout process with an easy-to-use interface that speeds up transactions.</p>
                            </div>
                        </div>
                        <div className="benefit-item animated">
                            <i className="fas fa-chart-line"></i>
                            <div>
                                <h3>Real-time inventory tracking</h3>
                                <p>Keep track of your stock levels instantly and never miss a sale or overstock again.</p>
                            </div>
                        </div>
                        <div className="benefit-item animated">
                            <i className="fas fa-store"></i>
                            <div>
                                <h3>Multi-store management</h3>
                                <p>Manage all your business locations from a single, centralized dashboard with ease.</p>
                            </div>
                        </div>
                        <div className="benefit-item animated">
                            <i className="fas fa-cloud-download-alt"></i>
                            <div>
                                <h3>Offline mode support</h3>
                                <p>Continue making sales even when your internet connection is down, syncing automatically later.</p>
                            </div>
                        </div>
                    </div>
                    <div className="about-image animated">
                        <img src="/assets/pos-about.png" alt="NexBill Benefits Illustration" />
                    </div>
                </div>
            </div>
        </section>
    );
}

// --- Component: Features ---
const featuresData = [
    { icon: "fas fa-chart-bar", title: "Sales Reports", description: "Gain deep insights into your sales performance with customizable reports and analytics." },
    { icon: "fas fa-barcode", title: "Barcode Scanning", description: "Accelerate checkout processes and reduce errors with quick and accurate barcode scanning." },
    { icon: "fas fa-user-shield", title: "Role-Based Access", description: "Define user roles and permissions for secure and controlled access to your system." },
    { icon: "fas fa-file-invoice", title: "GST-Compliant Billing", description: "Ensure all your invoices and transactions meet the latest GST regulations effortlessly." },
    { icon: "fas fa-truck", title: "Supplier Management", description: "Efficiently manage your suppliers, orders, and purchase history in one place." },
    { icon: "fas fa-tag", title: "Discount & Promotions", description: "Create flexible discounts and promotions to attract customers and boost sales." },
];

function Features() {
    const featuresGridRef = useRef(null);
    useIntersectionObserver(featuresGridRef, { threshold: 0.15 }, (entry) => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.feature-card').forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
                card.classList.add('fade-in');
            });
        }
    });

    return (
        <section id="features" className="section">
            <div className="container">
                <h2 className="section-heading">Powerful Features to Empower Your Business</h2>
                <div className="features-grid" ref={featuresGridRef}>
                    {featuresData.map((feature, index) => (
                        <div className="feature-card animated" key={index}>
                            <i className={feature.icon}></i>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// --- Component: Testimonials ---
const testimonialsData = [
    {
        quote: "NexBill transformed our billing process! It's so fast and easy to use. Our staff loves it, and so do our customers.",
        name: "Jane Doe",
        title: "Owner, FreshBites Cafe",
        img: "https://via.placeholder.com/60/1976d2/FFFFFF?text=JD"
    },
    {
        quote: "The real-time inventory tracking is a game-changer. We've significantly reduced stockouts and improved our order accuracy.",
        name: "Sam Miller",
        title: "Manager, TechGadget Store",
        img: "https://via.placeholder.com/60/1976d2/FFFFFF?text=SM"
    },
    {
        quote: "Managing multiple stores used to be a headache. NexBill's multi-store feature has saved us countless hours and simplified everything.",
        name: "Lisa Andrews",
        title: "CEO, Global Retail",
        img: "https://via.placeholder.com/60/1976d2/FFFFFF?text=LA"
    },
];

function Testimonials() {
    const testimonialsGridRef = useRef(null);
    useIntersectionObserver(testimonialsGridRef, { threshold: 0.15 }, (entry) => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.testimonial-card').forEach((card, index) => {
                card.style.animationDelay = `${index * 0.15}s`;
                card.classList.add('fade-in');
            });
        }
    });

    return (
        <section className="section testimonials-section">
            <div className="container">
                <h2 className="section-heading">What Our Customers Say</h2>
                <div className="testimonial-grid" ref={testimonialsGridRef}>
                    {testimonialsData.map((testimonial, index) => (
                        <div className="testimonial-card animated" key={index}>
                            <p>"{testimonial.quote}"</p>
                            <div className="customer-info">
                                <img src={testimonial.img} alt={`Customer ${testimonial.name}`} />
                                <div>
                                    <h4>{testimonial.name}</h4>
                                    <span>{testimonial.title}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// --- Component: Pricing ---
const pricingTiers = [
    {
        name: "Free",
        price: "$0",
        period: "/month",
        isPopular: false,
        features: [
            "Basic billing features",
            "Single user",
            "Limited reports",
            "Email support"
        ],
        buttonText: "Get Started Free",
        buttonClass: "btn-secondary"
    },
    {
        name: "Pro",
        price: "$29",
        period: "/month",
        isPopular: true,
        features: [
            "All Free features",
            "Real-time inventory",
            "Multi-user access",
            "Advanced reports",
            "Priority support"
        ],
        buttonText: "Choose Pro Plan",
        buttonClass: "btn-primary"
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        isPopular: false,
        features: [
            "All Pro features",
            "Multi-store management",
            "Custom integrations",
            "Dedicated account manager",
            "24/7 Premium support"
        ],
        buttonText: "Contact Sales",
        buttonClass: "btn-secondary"
    },
];

function Pricing() {
    const pricingGridRef = useRef(null);
    useIntersectionObserver(pricingGridRef, { threshold: 0.15 }, (entry) => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.pricing-card').forEach((card, index) => {
                card.style.animationDelay = `${index * 0.15}s`;
                card.classList.add('fade-in');
            });
        }
    });

    return (
        <section id="pricing" className="section">
            <div className="container">
                <h2 className="section-heading">Simple Pricing, Powerful Features</h2>
                <div className="pricing-grid" ref={pricingGridRef}>
                    {pricingTiers.map((tier, index) => (
                        <div className={`pricing-card animated ${tier.isPopular ? 'popular' : ''}`} key={index}>
                            {tier.isPopular && <span className="popular-badge">Popular Choice</span>}
                            <h3>{tier.name}</h3>
                            <p className="price">{tier.price}<span>{tier.period}</span></p>
                            <ul>
                                {tier.features.map((feature, idx) => (
                                    <li key={idx}>{feature}</li>
                                ))}
                            </ul>
                            <a href="#" className={`btn ${tier.buttonClass}`}>{tier.buttonText}</a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// --- Component: FAQ ---
const faqData = [
    {
        question: "Is NexBill compatible with my existing hardware?",
        answer: "NexBill is designed for broad compatibility with most standard POS hardware including barcode scanners, receipt printers, and cash drawers. Our team can help you verify compatibility during setup."
    },
    {
        question: "Do I need an internet connection to use NexBill?",
        answer: "NexBill offers an robust offline mode. You can continue making sales and managing inventory even without an internet connection. All data will automatically sync once you're back online."
    },
    {
        question: "How secure is my data with NexBill?",
        answer: "We prioritize your data security. NexBill uses industry-standard encryption protocols and secure cloud infrastructure to protect your business information from unauthorized access."
    },
    {
        question: "Can I manage multiple stores with one NexBill account?",
        answer: "Yes, our Pro and Enterprise plans offer comprehensive multi-store management features, allowing you to oversee all your locations from a single dashboard."
    },
];

function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null);
    const accordionRef = useRef(null);

    useIntersectionObserver(accordionRef, { threshold: 0.1 }, (entry) => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.accordion-item').forEach((item, index) => {
                item.style.animationDelay = `${index * 0.1}s`;
                item.classList.add('fade-in');
            });
        }
    });

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="faq" className="section faq-section">
            <div className="container">
                <h2 className="section-heading">Frequently Asked Questions</h2>
                <div className="accordion" ref={accordionRef}>
                    {faqData.map((item, index) => (
                        <div className={`accordion-item animated ${activeIndex === index ? 'active' : ''}`} key={index}>
                            <div className="accordion-header" onClick={() => toggleAccordion(index)}>
                                {item.question}
                                <i className={`fas ${activeIndex === index ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                            </div>
                            <div className="accordion-content">
                                <p>{item.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// --- Component: Footer ---
function Footer() {
    return (
        <footer id="contact">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-col">
                        <h4>NexBill</h4>
                        <p>Simplify billing, manage inventory, and grow your business with NexBill.</p>
                        <p>Email: info@nexbill.com</p>
                        <p>Phone: +91 123 456 7890</p>
                    </div>
                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#about">Why NexBill?</a></li>
                            <li><a href="#features">Features</a></li>
                            <li><a href="#pricing">Pricing</a></li>
                            <li><a href="#faq">FAQ</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Connect With Us</h4>
                        <div className="social-icons">
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-linkedin-in"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 NexBill. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

// --- Main App Component ---
function App() {
    // Add global Font Awesome CDN link in public/index.html <head>
    // <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    // <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">


    // Smooth scroll for navigation links - This needs to be active on mount
    useEffect(() => {
        document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }, []);

    return (
        <div className="App">
            {/* Inject styles */}
            <style>{AppStyles}</style>
            <Header />
            <Hero />
            <About />
            <Features />
            <Testimonials />
            <Pricing />
            <FAQ />
            <Footer />
        </div>
    );
}

export default App;