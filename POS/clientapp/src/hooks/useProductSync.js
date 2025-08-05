// src/hooks/useProductSync.js
import { useEffect } from 'react';
import { useGetProductsQuery } from '../services/productApi';
import { saveProducts, getProducts, saveSettings, getSettings } from '../data/db';
import ProductService from './../services/ProductService'; 
import { db } from '../data/db';

export const useProductSync = () => {
    const { data: products, isSuccess } = useGetProductsQuery('');

    useEffect(() => {
        if (navigator.onLine && isSuccess && products?.length > 0) {
            saveProducts(products);
        }
    }, [isSuccess, products]);
};

export const manualProductSync = async () => {

    try {
        const products = await ProductService.GetProduct('');
        await saveProducts(products);
        await saveSettingsSync();
    } catch (err) {
        console.error('Product sync failed:', err);
    }
};

export const getProductsSync = async () => {

    try {
        const products = await getProducts();
        return products;
    } catch (err) {
        console.error('Product sync failed:', err);
    }
};


export const saveSettingsSync = async () => {
    try {
        const settings = await ProductService.GetBasicSettings();
        await saveSettings(settings);
    } catch (err) {
        console.error('Product sync failed:', err);
    }
};

export const getSettingsSync = async () => {

    try {
        const settings = await getSettings();
        return settings;
    } catch (err) {
        console.error('Product sync failed:', err);
    }
};