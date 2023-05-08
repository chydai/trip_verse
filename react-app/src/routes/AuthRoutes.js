import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';

const AuthLogin = Loadable(lazy(() => import('views/user/authentication/SignInPage')));
const AuthRegister = Loadable(lazy(() => import('views/user/authentication/SignUpPage')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
    // element: ,
    children: [
        {
            path: 'login',
            element: <AuthLogin />
        },
        {
            path: 'register',
            element: <AuthRegister />
        }
    ]
};

export default AuthenticationRoutes;
