import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "api/user";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { CardActionArea } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { deleteMyPost, fetchUserPosts } from "store/postSlice";

import ImageSlider from "./ImageSlider";

const SinglePost = (prop) => {
  const post = prop.post;
  const theme = useTheme();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [poster, setPoster] = useState([]);

  const dateObj = new Date(post.createdAt);
  const displayCreateDate = dateObj.toLocaleString();

  useEffect(() => {
    dispatch(fetchUserPosts());
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleClose();
    dispatch(deleteMyPost(post._id));
  };

  useEffect(() => {
    const getPoster = async (post) => {
      const userObj = await getUser(post.userId)
        .then((response) => response.data)
        .catch((error) => {
          console.error(`Error retrieving user ${post.userId}: ${error}`);
        });

      const person = {
        name: userObj.name,
        id: userObj._id,
      };
      setPoster(person);
    };
    getPoster(post);
  }, []);

  return (
    <Grid item key={post._id} xs={12} sm={6} md={6} lg={4}>
      <Card
        sx={{
          border: "2px solid",
          borderColor: theme.palette.primary.light,
          ":hover": {
            boxShadow: "0 4px 14px 0 rgb(32 40 45 / 8%)",
          },
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardHeader
          action={
            <>
              <IconButton aria-label="settings" onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="group-option"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                variant="selectedMenu"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={handleDelete}>Delete Post</MenuItem>
              </Menu>
            </>
          }
          title={<Typography variant="h3">{post.title}</Typography>}
          subheader={displayCreateDate}
        />

        <CardActionArea sx={{ height: "300px" }}>
          <ImageSlider slides={post.imgUrls} />
        </CardActionArea>

        <CardActionArea>
          <CardContent sx={{ marginY: "0px", flexGrow: 1 }}>
            <Typography variant="body2" color="text.primary">
              Poster:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {poster.name}
            </Typography>

            <Typography variant="body2" color="text.primary">
              Post Content:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {post.content}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default SinglePost;
