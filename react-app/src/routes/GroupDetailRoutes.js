import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';

const GroupInfo = Loadable(lazy(() => import('views/group/groupinfo')));


const GroupDetailRoutes = {
  path: '/group-info',
  element: <GroupInfo />,
};

export default GroupDetailRoutes;