import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';

const Group = Loadable(lazy(() => import('views/group')));


const ChannelRoutes = {
  path: '/:groupid/channels/:channelid',
  element: <Group />,
};

export default ChannelRoutes;