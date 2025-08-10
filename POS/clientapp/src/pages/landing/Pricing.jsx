import React, { useRef } from 'react';
import { useIntersectionObserver, pricingTiers } from '../../hooks/useIntersectionObserver';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import AppStyles from './appStyle';

const Pricing = () => {
    const { userDetails } = useSelector((state) => state.users);
    const pricingGridRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    useIntersectionObserver(pricingGridRef, { threshold: 0.15 }, (entry) => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.pricing-card').forEach((card, index) => {
                card.style.animationDelay = `${index * 0.15}s`;
                card.classList.add('fade-in');
            });
        }
    });

    const handlePayment = (tier) => {
        debugger;
        if (!userDetails) {
            navigate('/login', { state: { redirectTo: '/order', plan: tier } });
        } else {
            navigate('/order', { state: { plan: tier } });
        }
    };

    return (
        <>
        {(location.pathname === "/subscribe") && <style>{AppStyles}</style>}
        <section id="pricing" className="section_pricing">
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
                            <button
                                onClick={() => handlePayment(tier)}
                                className={`btn ${tier.buttonClass}`}
                            >
                                {tier.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            </section>
        </>
    );
};

export default Pricing;
