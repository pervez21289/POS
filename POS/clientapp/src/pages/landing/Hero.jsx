import React, { useRef } from 'react';
import { useIntersectionObserver, pricingTiers } from '../../hooks/useIntersectionObserver';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import AppStyles from './appStyle';
import POSHERO from '../../assets/images/pos.jpg';

const Hero = () => {
    const { userDetails } = useSelector((state) => state.users);
    const pricingGridRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const contentRef = useRef(null);
    const imageRef = useRef(null);

    const handlePayment = () => {
      

        const tier = pricingTiers.find((p) => p.name === 'Free');

        if (!userDetails) {
            navigate('/login', { state: { redirectTo: '/order', plan: tier } });
        } else {
            navigate('/order', { state: { plan: tier } });
        }
    };

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
                        <a href="#" onClick={(e) => { e.preventDefault(); handlePayment(); }} className="btn btn-primary">
                            Get Started Free
                        </a>
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



export default Hero;
