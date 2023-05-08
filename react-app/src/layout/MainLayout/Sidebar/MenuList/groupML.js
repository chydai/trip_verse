import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';

import menuItem from '../../../../menu-items/menu-items-group';
import NavChannel from './NavChannel';
import NavManageGroup from './NavManageGroup';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const navItems = menuItem.items.map((item) => {
    if (typeof (item) === 'function') {
      item = item();
      // console.log('this is item ', item);
    }

    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      case 'channel':
        return <NavChannel key={item.id} item={item} />;
      case 'manage':
        return <NavManageGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>
  {navItems}
  </>;
};

export default MenuList;