// assets
import SettingsIcon from '@mui/icons-material/Settings';
const icons = {
    SettingsIcon
};


const management = {
    id: 'management',
    type: 'group',
    children: [
        {
            id: 'groupmanagement',
            title: 'Manage Group',
            type: 'collapse',
            icon: icons.SettingsIcon,
            children: []
        }
    ]
}


export default management;
