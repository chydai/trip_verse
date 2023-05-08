// assets
import { IconArchive } from '@tabler/icons';

// constant
const icons = { IconArchive };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const mygroup = {
    id: 'mygroup',
    type: 'group',
    children: [
        {
            id: 'my-group',
            title: 'My Group',
            type: 'item',
            url: '/my-group',
            icon: icons.IconArchive,
            breadcrumbs: false
        }
    ]
};

export default mygroup;
