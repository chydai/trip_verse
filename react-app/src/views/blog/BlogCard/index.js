import { Grid, Link } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
// import NewGroupButton from './NewGroupButton'; //!!!!!!!!!!!!!!
import NewPostButton from './NewPostButton';
// import { fetchRandomGroups, selectAllGroups } from 'store/groupSlice'; //!!!!!!!!!!!!!!!
import { fetchRandomPosts, selectAllPosts } from 'store/postSlice';
// import SingleGroup from './SingleGroup'; //!!!!!!!!!!!!!!
import SinglePost from './SinglePost';
// ==============================|| TYPOGRAPHY ||============================== //

const BlogCard = () => {
    // const longword = 'Lorem ipsum dolor sit amet, cua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    const curUser  = useSelector((state) => state.users.currentUser);
    const dispatch = useDispatch();
    // const blogStatus = useSelector((state) => state.posts.status);
    const blogStatus = useSelector((state) => {
        // console.log('state:', state);
        return state.posts.status;
    });
    
    useEffect(() => {
        // console.log('groupstat',groupStatus)
      if (blogStatus === 'idle') {
        dispatch(fetchRandomPosts())
      }
    }, [blogStatus, dispatch])
    
    const posts = useSelector(selectAllPosts);
    // const groups = useSelector(selectUserGroups);
    // console.log('groupstat2',groupStatus)
    // console.log('groupcard/groups', groups);

    return (
        <MainCard title="Travel Blogs" secondary={curUser && <NewPostButton />} >
            <Grid container spacing={gridSpacing}>
                {posts.map((post) => (<SinglePost key={post._id} post={post}/>))}
            </Grid>
        </MainCard>
    );
}

export default BlogCard;
