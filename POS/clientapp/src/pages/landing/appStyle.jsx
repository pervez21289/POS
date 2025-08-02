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
    margin-top: 40px;
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

export default AppStyles;