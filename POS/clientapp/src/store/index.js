// src/store/store.js

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { productApi } from './../services/productApi';
import { categoryApi } from './../services/categoryApi';
import { salesApi } from './../services/salesApi';
import { basicSettingApi } from './../services/basicSettingApi';
import { userAPI } from './../services/userAPI';
import drawer from './reducers/drawer';
import sales from './reducers/sales';
import users from './reducers/users';
import alert from './reducers/alert';
import confirm from './reducers/confirm';
import { ticketApi } from './../services/ticketApi';
// import other reducers if needed
// import authReducer from './authSlice';

const rootReducer = combineReducers({
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [basicSettingApi.reducerPath]: basicSettingApi.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [ticketApi.reducerPath]: ticketApi.reducer,
    drawer,
    sales,
    users,
    alert,
    confirm
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            basicSettingApi.middleware,
            productApi.middleware,
            categoryApi.middleware,
            salesApi.middleware,
            userAPI.middleware,
            ticketApi.middleware
        ),
});
