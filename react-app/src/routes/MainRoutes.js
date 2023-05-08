import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));
const BlogDefault = Loadable(lazy(() => import('views/blog')));
const MyGroup = Loadable(lazy(() => import('views/mygroup')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: 'travel-groups',
            element: <DashboardDefault />
        },
        {

            path: 'travel-blogs',
            element: <BlogDefault />
            // element: <DashboardDefault />
        },
        {

            path: 'my-group',
            element: <MyGroup />
        },
        
    ]
};

export default MainRoutes;
