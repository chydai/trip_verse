// assets
import { IconBrandChrome, IconNotebook } from '@tabler/icons';

// constant
const icons = { IconBrandChrome, IconNotebook };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const allother = {
    id: 'allother',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Travel Groups',
            type: 'item',
            url: '/travel-groups',
            icon: icons.IconBrandChrome,
            breadcrumbs: false
        },
        {
            id: 'travel-blogs',
            title: 'Travel Blogs',
            type: 'item',
            url: '/travel-blogs',
            icon: icons.IconNotebook,
            breadcrumbs: false

        }
    ]
};

export default allother;
