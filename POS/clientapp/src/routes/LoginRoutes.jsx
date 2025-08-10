import { lazy } from 'react';

// project imports
import AuthLayout from 'layout/Auth';
import Loadable from 'components/Loadable';

// jwt auth
import LoginPage from '../pages/auth/Login';
const RegisterPage = Loadable(lazy(() => import('pages/auth/Register')));

import Landing from '../pages/landing';
import PrivacyPolicy from '../pages/landing/PrivacyPolicy'; 
import TermCondition from '../pages/landing/TermCondition';

import Order from '../pages/landing/Order';
import OrderSuccess from '../pages/landing/OrderSuccess';
import OrderFailed from '../pages/landing/OrderFailed';
import Pricing from '../pages/landing/Pricing';
// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
    path: '/',
    children: [
        {
            path: '/',
            element: <Landing />
        },
        {
            path: '/',
            element: <AuthLayout />,
            children: [
                {
                    path: '/login',
                    element: <LoginPage />
                },
                {
                    path: '/register',
                    element: <RegisterPage />
                },
                
                {
                    path: '/tandc',
                    element: <TermCondition />
                },
                {
                    path: '/privacypolicy',
                    element: <PrivacyPolicy />
                },
                {
                    path: '/order',
                    element: <Order />
                },
                {
                    path: '/ordersuccess',
                    element: <OrderSuccess />
                },
                {
                    path: '/orderfailed',
                    element: <OrderFailed />
                },
                {
                    path: '/subscribe',
                    element: <Pricing />
                }
            ]
        }
        
    ]
};

export default LoginRoutes;
