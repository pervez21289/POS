// src/hooks/useProductSync.js
import { useEffect } from 'react';
import { useGetProductsQuery } from '../services/productApi';
import { saveProducts, getProducts, saveSettings, getSettings } from '../data/db';
import ProductService from './../services/ProductService'; 
import { db } from '../data/db';

export const useIntersectionObserver = (ref, options, callback, delay = 0) => {
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

export const pricingTiers = [
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
