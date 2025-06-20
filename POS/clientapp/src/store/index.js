// src/store/store.js

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { productApi } from './../services/productApi';
import { categoryApi } from './../services/categoryApi';
// import other reducers if needed
// import authReducer from './authSlice';

const rootReducer = combineReducers({
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    // auth: authReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            productApi.middleware,
            categoryApi.middleware
        ),
});
