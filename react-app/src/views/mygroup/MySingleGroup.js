import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
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
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GroupIcon from "@mui/icons-material/Group";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";

import {
  deleteMyGroup,
  transferGroup,
  fetchUserGroups,
  exitGroup,
} from "store/groupSlice";
import { getUser } from "api/user";
import { selectUserProfile } from "store/userSlice";

const MySingleGroup = (prop) => {
  const group = prop.group;
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [showAlert, setShowAlert] = useState(-1);
  const [openDelete, setOpenDelete] = useState(false);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [selectUser, setSelectUser] = useState("");
  const [people, setPeople] = useState([]);
  const curUser = useSelector(selectUserProfile);

  const dateObj = new Date(group.createdAt);
  const displayCreateDate = dateObj.toLocaleString();

  useEffect(() => {
    if (curUser) {
      dispatch(fetchUserGroups(curUser._id));
    }
  }, []);

  useEffect(() => {
    Promise.all(
      group.members.map((userId) =>
        getUser(userId)
          .then((response) => response.data)
          .catch((error) => {
            console.error(`Error retrieving user ${userId}: ${error}`);
          })
      )
    )
      .then((userObjects) => {
        const people = userObjects
          .map((user) => user && { name: user.name, id: user._id })
          .filter(Boolean);
        setPeople(people);
      })
      .catch((error) => {
        console.error(`Error retrieving users: ${error}`);
      });
  }, []);

  const handleDeleteOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const handleTransferOpen = () => {
    setOpenTransfer(true);
  };

  const handleTransferClose = () => {
    setOpenTransfer(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickItem = (event, route = "") => {
    handleClose();
    if (route) {
      navigate(route);
    }
  };

  const handleDelete = () => {
    handleClose();
    handleDeleteClose();
    dispatch(deleteMyGroup(group._id));
  };

  const handleExitClick = async () => {
    dispatch(exitGroup(group._id));
    setShowAlert(2);
  };

  const handleTransfer = () => {
    handleClose();
    handleDeleteClose();
    dispatch(transferGroup({ groupId: group._id, userId: selectUser }));
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
                {prop.join ? (
                  <MenuItem onClick={handleExitClick}>Exit Group</MenuItem>
                ) : (
                  [
                    <MenuItem key="delete" onClick={handleDeleteOpen}>
                      Delete
                    </MenuItem>,
                    <MenuItem key="transfer" onClick={handleTransferOpen}>
                      Transfer
                    </MenuItem>,
                  ]
                )}
              </Menu>
            </>
          }
          title={<Typography variant="h3">{group.name}</Typography>}
          subheader={displayCreateDate}
        />

        <Dialog open={openDelete} onClose={handleDeleteClose}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this group?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose}>Cancel</Button>
            <Button onClick={handleDelete}>Delete</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openTransfer} onClose={handleTransferClose}>
          <DialogTitle>Confirm Transfer</DialogTitle>
          <DialogContent>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel>User Name</InputLabel>
              <Select
                value={selectUser}
                label="selectUser"
                onChange={(event) => setSelectUser(event.target.value)}
              >
                {people.map((temp, index) => {
                  if (!(temp.name === curUser.name)) {
                    return (
                      <MenuItem key={index} value={temp.id}>
                        {temp.name}
                      </MenuItem>
                    );
                  }
                })}
              </Select>
              <FormHelperText>
                Please select one user you want to transfer the group to.
              </FormHelperText>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleTransferClose}>Cancel</Button>
            <Button onClick={handleTransfer}>Confirm</Button>
          </DialogActions>
        </Dialog>

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
        <CardActions disableSpacing sx={{ mt: 0, pt: 0 }}>
          <IconButton aria-label="add to favorites" disabled>
            <FavoriteIcon sx={{ color: "gray" }} />
            <Typography sx={{ color: "gray" }} variant="button">
              {group.likes.length}
            </Typography>
          </IconButton>

          <IconButton aria-label="group size" disabled>
            <GroupIcon sx={{ color: "gray" }} />
            <Typography sx={{ color: "gray" }} variant="button">
              {group.members.length}
            </Typography>
          </IconButton>

          {/* <IconButton aria-label="share" disabled>
            <ShareIcon sx={{ color: "gray" }} />
          </IconButton> */}
        </CardActions>
      </Card>
    </Grid>
  );
};

export default MySingleGroup;
