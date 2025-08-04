import { lazy } from 'react';

// project imports
import AuthLayout from 'layout/Auth';
import Loadable from 'components/Loadable';

// jwt auth
const LoginPage = Loadable(lazy(() => import('pages/auth/Login')));
const RegisterPage = Loadable(lazy(() => import('pages/auth/Register')));

import Landing from '../pages/landing';
import PrivacyPolicy from '../pages/landing/PrivacyPolicy'; 
import TermCondition from '../pages/landing/TermCondition';
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
                }
            ]
        }
        
    ]
};

export default LoginRoutes;
