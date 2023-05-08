import { useEffect, useState } from 'react';

// material-ui
import { Grid, Button, Box } from '@mui/material';

import { gridSpacing } from 'store/constant';

import AnimateButton from 'ui-component/extended/AnimateButton';
import GroupCard from './GroupCard';
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    // const groupStatus = useSelector(state => state.groups.status)
    
    // useEffect(() => {
    //   if (groupStatus === 'idle') {
    //     dispatch(fetchRandomGroups())
    //   }
    // }, [groupStatus, dispatch])

    // useEffect(() => {
    //     setLoading(false);
    // }, []);

    return (
        <Grid data-testid='dashboard-grid' container spacing={gridSpacing}>
            <Grid item xs={12}>
                <GroupCard />
            </Grid>
        </Grid>
    );
};

export default Dashboard;
