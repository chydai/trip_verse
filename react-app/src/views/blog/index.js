import { useEffect, useState } from 'react';

// material-ui
import { Grid, Button, Box } from '@mui/material';

import { gridSpacing } from 'store/constant';

import AnimateButton from 'ui-component/extended/AnimateButton';
// import GroupCard from './GroupCard';
import BlogCard from './BlogCard';
import MainCard from 'ui-component/cards/MainCard';

const Blog = () => {

    return (
        <Grid data-testid='dashboard-grid' container spacing={gridSpacing}>
            <Grid item xs={12}>
                <BlogCard />
            </Grid>
        </Grid>
    );
};

export default Blog;