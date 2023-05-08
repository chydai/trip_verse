import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';

const Group = Loadable(lazy(() => import('views/group')));


const GroupRoutes = {
  path: 'group-page/:groupid',
  element: <Group />,
};

export default GroupRoutes;