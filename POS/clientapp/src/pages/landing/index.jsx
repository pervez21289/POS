import React, { useState, useRef, useEffect } from 'react';
import AppStyles from './appStyle';
import POSHERO from '../../assets/images/pos.jpg';


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
                        <a href="/register" className="btn btn-primary">Get Started Free</a>
                        <a href="/register" className="btn btn-secondary">Schedule a Demo</a>
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
                        {/*<div className="benefit-item animated">*/}
                        {/*    <i className="fas fa-cloud-download-alt"></i>*/}
                        {/*    <div>*/}
                        {/*        <h3>Offline mode support</h3>*/}
                        {/*        <p>Continue making sales even when your internet connection is down, syncing automatically later.</p>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
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
        price: "\u20B90",
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
        price: "\u20B9499",
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
        price: "\u20B9999",
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
                        <p>Phone: +91 8077599608</p>
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
          {/*  <Testimonials />*/}
            <Pricing />
            <FAQ />
            <Footer />
        </div>
    );
}

export default App;