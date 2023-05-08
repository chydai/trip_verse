import { Grid, Link } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// project imports
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import NewPostButton from "./NewPostButton";
import { fetchRandomPosts, selectAllPosts } from "store/postSlice";
import SinglePost from "./SinglePost";
// ==============================|| TYPOGRAPHY ||============================== //

const BlogCard = () => {
  const curUser = useSelector((state) => state.users.currentUser);
  const dispatch = useDispatch();
  const blogStatus = useSelector((state) => {
    return state.posts.status;
  });

  useEffect(() => {
    if (blogStatus === "idle") {
      dispatch(fetchRandomPosts());
    }
  }, [blogStatus, dispatch]);

  const posts = useSelector(selectAllPosts);

  return (
    <MainCard title="Travel Blogs" secondary={curUser && <NewPostButton />}>
      <Grid container spacing={gridSpacing}>
        {posts.map((post) => (
          <SinglePost key={post._id} post={post} />
        ))}
      </Grid>
    </MainCard>
  );
};

export default BlogCard;
