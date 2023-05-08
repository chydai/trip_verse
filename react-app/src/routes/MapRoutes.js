import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';

const MapInfo = Loadable(lazy(() => import('views/group/mapInfo')));


const MapRoutes = {
  path: '/',
  element: <MapInfo/>,
};

export default MapRoutes;