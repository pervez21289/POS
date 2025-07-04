// src/store/store.js

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { productApi } from './../services/productApi';
import { categoryApi } from './../services/categoryApi';
import { salesApi } from './../services/salesApi';
import drawer from './reducers/drawer';
import sales from './reducers/sales';
import users from './reducers/users';
// import other reducers if needed
// import authReducer from './authSlice';

const rootReducer = combineReducers({
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    drawer,
    sales,
    users
    // auth: authReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            productApi.middleware,
            categoryApi.middleware,
            salesApi.middleware
        ),
});
