import { Grid, Link } from "@mui/material";
import MuiTypography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getUser } from "api/user";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import { Alert, CardActionArea, CardActions } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GroupIcon from "@mui/icons-material/Group";

import { deleteMyPost, fetchUserPosts } from "store/postSlice";

import ImageSlider from "./ImageSlider";

const SinglePost = (prop) => {
  const post = prop.post;
  console.log("post.imgUrls", post.imgUrls);
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  // const [userJoinedGroup, setUserJoinedGroup] = useState([]);
  const [poster, setPoster] = useState([]);

  const dateObj = new Date(post.createdAt);
  const displayCreateDate = dateObj.toLocaleString();

  // const getData = async () => {
  //     const response = await fetchMyJoinedGroups();
  //     setUserJoinedGroup(response.data);
  // }

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

  const slides = [
      "https://firebasestorage.googleapis.com/v0/b/tpchatchat.appspot.com/o/IMG_5485.jpeg?alt=media&token=90247e73-63d6-4475-acb3-bd52f5ca2ead",
      "https://firebasestorage.googleapis.com/v0/b/tpchatchat.appspot.com/o/dollar.png?alt=media&token=7fa721e4-bebb-4fe6-a8d9-50ccd978e899"
  ];
  // console.log("slides",slides)

  useEffect(() => {
    const getPoster = async (post) =>{
      const userObj = await getUser(post.userId)
          .then((response) => response.data)
          .catch((error) => {
            console.error(`Error retrieving user ${post.userId}: ${error}`);
          })
        
      const person = {
          name: userObj.name,
          id: userObj._id,
          };
      setPoster(person);
      console.log("p", person); // array of user objects
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

        <CardActionArea sx={{height:"300px"}}>
            <ImageSlider slides={post.imgUrls} />
          {/* {post.imgUrls.map((imgUrl) => (
            <CardMedia component="img" height="500" image={imgUrl} alt="Boston"/>
          ))} */}
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

        {/* <CardActions disableSpacing sx={{ mt: 0, pt: 0 }}>
                    <IconButton aria-label="like">
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>

                </CardActions> */}
      </Card>
    </Grid>
  );
};

export default SinglePost;
