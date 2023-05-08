import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthRoutes';
import ProfileRoutes from './ProfileRoutes';
import GroupRoutes from './GroupRoutes';
import GroupDetailRoutes from './GroupDetailRoutes';
import ChannelRoutes from './ChannelRoutes';
import MapRoutes from './MapRoutes'
// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return useRoutes([MainRoutes, AuthenticationRoutes, ProfileRoutes, GroupRoutes, GroupDetailRoutes,  ChannelRoutes]);
}
