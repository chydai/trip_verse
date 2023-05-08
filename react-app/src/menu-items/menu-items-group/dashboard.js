// assets
import { IconDashboard } from '@tabler/icons';

import { useParams } from 'react-router';
// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const Dashboard = () => {
    const curGroupId = useParams();

    return {
        id: 'dashboard',
        // title: 'Dashboard',
        type: 'group',
        children: [
            {
                id: 'generalChannel',
                title: 'General Channel',
                type: 'item',
                url: `/group-page/${curGroupId.groupid}`,
                icon: icons.IconDashboard,
                breadcrumbs: false
            }
        ]
    }

};

export default Dashboard;
