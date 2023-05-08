import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';

const Profile = Loadable(lazy(() => import('views/profile')));


const ProfileRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: 'profile/:userid',
      element: <Profile />
    }
  ]
};

export default ProfileRoutes;