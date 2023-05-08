import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GroupIcon from "@mui/icons-material/Group";

import { setChatId } from "store/chatSlice";

import { red, blue } from "@mui/material/colors";

import {
  deleteMyGroup,
  joinGroup,
  exitGroup,
  likeGroup,
  dislikeGroup,
} from "store/groupSlice";

const SingleGroup = (prop) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [group, setUpdateGroup] = useState(prop.group);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showAlert, setShowAlert] = useState(-1);
  const [errMsg, setErrMsg] = useState("");

  const dateObj = new Date(group.createdAt);
  const displayCreateDate = dateObj.toLocaleString();

  const user = useSelector((store) => store.users);

  const isGroupOwner = useMemo(
    () => user?.currentUser?._id === group?.userId,
    [user, group]
  );
  const isGroupMember = useMemo(
    () => group?.members?.includes(user?.currentUser?._id),
    [user, group]
  );

  const isGroupLiked = useMemo(
    () => group?.likes?.includes(user?.currentUser?._id),
    [user, group]
  );

  const [isLike, setIsLike] = useState(isGroupLiked);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickItem = (event, route = "") => {
    handleClose();

    const isJoined = (group?.members || []).includes(user?.currentUser?._id);
    const groupID = group._id;

    if (!isJoined) {
      setShowAlert(0);
    } else if (route) {
      navigate(route);
      dispatch(setChatId(groupID));
    }
  };

  const handleDelete = async () => {
    handleClose();
    const res = await dispatch(deleteMyGroup(group._id));
    if (res?.payload) {
      setUpdateGroup(res.payload);
    }
  };

  const handleJoinClick = async () => {
    const res = await dispatch(joinGroup(group._id));
    setShowAlert(1);
    if (res?.payload) {
      setUpdateGroup(res.payload);
    }
  };

  const handleExitClick = async () => {
    const res = await dispatch(exitGroup(group._id));
    if (res?.error) {
      setShowAlert(3);
      setErrMsg(res.error.message);
    } else {
      setShowAlert(2);
      if (res?.payload) {
        setUpdateGroup(res.payload);
      }
    }
  };

  const handleLikeClick = async () => {
    if (!isLike) {
      dispatch(likeGroup(group._id)).then((response) => {
        setIsLike(true);
        setUpdateGroup(response.payload);
      });
    } else {
      dispatch(dislikeGroup(group._id)).then((response) => {
        setIsLike(false);
        setUpdateGroup(response.payload);
      });
    }
  };

  return (
    <Grid item key={group._id} xs={12} sm={6} md={6} lg={4}>
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
                {!isGroupOwner && isGroupMember && (
                  <MenuItem onClick={handleExitClick}>Exit Group</MenuItem>
                )}

                {!isGroupMember && (
                  <MenuItem onClick={handleJoinClick}>Join Group</MenuItem>
                )}

                {isGroupOwner && (
                  <MenuItem onClick={handleDelete}>Delete Group</MenuItem>
                )}
              </Menu>
            </>
          }
          title={<Typography variant="h3">{group.name}</Typography>}
          subheader={displayCreateDate}
        />
        <CardActionArea
          onClick={(event) =>
            handleClickItem(event, `/group-page/${group._id}`)
          }
        >
          <CardMedia
            component="img"
            height="130"
            image={
              group.imgUrl ? group.imgUrl : "https://picsum.photos/400/300"
            }
            alt="Boston"
          />
          <CardContent sx={{ marginY: "0px", flexGrow: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {group.description}
            </Typography>
          </CardContent>
        </CardActionArea>

        {showAlert === 0 && (
          <Alert onClose={() => setShowAlert(-1)} severity="error">
            You haven't joined this group!
          </Alert>
        )}

        {showAlert === 1 && (
          <Alert onClose={() => setShowAlert(-1)} severity="success">
            You successfully joined this group!
          </Alert>
        )}

        {showAlert === 2 && (
          <Alert onClose={() => setShowAlert(-1)} severity="success">
            You successfully exited this group!
          </Alert>
        )}

        {showAlert === 3 && (
          <Alert onClose={() => setShowAlert(-1)} severity="error">
            {errMsg}
          </Alert>
        )}
        <CardActions disableSpacing sx={{ mt: 0, pt: 0 }}>
          <IconButton aria-label="add to favorites" onClick={handleLikeClick}>
            <FavoriteIcon sx={{ color: isLike ? red[700] : "default" }} />
            <Typography
              variant="button"
              sx={{ color: isLike ? red[700] : "default" }}
            >
              {group.likes.length}
            </Typography>
          </IconButton>

          <IconButton aria-label="group size" disabled>
            <GroupIcon
              sx={{
                color: isGroupOwner
                  ? blue[700]
                  : isGroupMember
                  ? "#7e57c2"
                  : "gray",
              }}
            />
            <Typography
              variant="button"
              sx={{
                color: isGroupOwner
                  ? blue[700]
                  : isGroupMember
                  ? "#7e57c2"
                  : "gray",
              }}
            >
              {group.members.length}
            </Typography>
          </IconButton>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default SingleGroup;
