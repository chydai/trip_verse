import { useDispatch, useSelector } from 'react-redux';
import { styled, useTheme } from '@mui/material/styles';
import { Button, ButtonGroup, Card, AppBar, Box, CssBaseline, Grid, Toolbar, useMediaQuery } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import SubCard from 'ui-component/cards/SubCard';
import { useState } from 'react';
import { setMode } from 'store/customizationSlice';
import PreCard from './PreCard';


const PreTrip = () => {

    return (
        <Box>

            <PreCard />
        </Box>
    )
}

export default PreTrip;