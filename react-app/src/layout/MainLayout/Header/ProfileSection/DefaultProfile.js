import { useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { Button, ButtonGroup } from '@mui/material';

// material-ui
import { useTheme } from '@mui/material/styles';

// assets
import { IconLogout, IconSettings, IconUser, IconLogin } from '@tabler/icons';
// ==============================|| PROFILE MENU ||============================== //

const DefaultProfileSection = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);


    const handleToggle = (event, route = '') => {
        navigate(route)
    };


    return (
        <>
            <ButtonGroup sx={{
                height: '48px',
                px: '10px',
                alignItems: 'center',
                borderRadius: '27px',
                transition: 'all .2s ease-in-out',
                // borderColor: theme.palette.primary.light,
                // backgroundColor: theme.palette.primary.light,

            }}
                variant="text" aria-label="text button group">
                <Button sx={{
                    borderRadius: '15px',
                    px: '16px',
                }}
                    onClick={(e) => handleToggle(e, '/register')}>
                    Sign Up
                </Button>
                <Button sx={{
                    borderRadius: '15px',
                    px: '16px',
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: theme.palette.primary.main,
                        background: `${theme.palette.primary.main}!important`,
                        color: theme.palette.primary.light,
                        '& svg': {
                            stroke: theme.palette.primary.light
                        }
                    },
                }}
                    onClick={(e) => handleToggle(e, '/login')}
                >
                    Log In
                </Button>
            </ButtonGroup>
            
        </>
    );
};

export default DefaultProfileSection;
