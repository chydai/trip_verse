// similar to precard
import { useTheme } from "@mui/material/styles";
import { TextField, Checkbox, Box, Grid, Typography } from "@mui/material";
import {
  Divider,
  Avatar,
  ListItem,
  List,
  ListItemText,
  Collapse,
  ListItemAvatar,
  IconButton,
  Dialog,
  DialogContent,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Cancel as CancelIcon } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChatIcon from "@mui/icons-material/Chat";

import { useState, useEffect } from "react";
import BillForm from "./BillForm";

import {
  createComment,
  fetchCommentByPlace,
  deleteCommentById,
} from "api/comment";
import { useDispatch, useSelector } from "react-redux";
import { selectUserProfile } from "store/userSlice";
import { addComment, deleteComment } from "store/preTripPlaceSlice";
import { getUser } from "api/user";

const Comment = (props) => {
  const [commenter, setCommenter] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.comment.userId) {
      getUser(props.comment.userId)
        .then((response) => {
          setCommenter(response.data);
        })
        .catch((error) => {
          console.error(`Error retrieving user ${error}`);
        });
    }
  }, [props.comment.userId]);

  const handleClick = () => {
    deleteCommentById(props.comment._id).then(
      dispatch(deleteComment(props.comment))
    );
    props.onDelete(!props.isDelete);
  };

  return (
    commenter && (
      <>
        <Divider component="li" />
        <ListItem
          alignItems="flex-start"
          secondaryAction={
            commenter?._id === props.curUser._id && (
              <IconButton onClick={handleClick}>
                <CancelIcon />
              </IconButton>
            )
          }
        >
          <ListItemAvatar>
            {commenter.avatarUrl ? (
              <Avatar alt={commenter.name} src={commenter.avatarUrl} />
            ) : (
              <Avatar alt={commenter.name}>{commenter.name[0]}</Avatar>
            )}
          </ListItemAvatar>
          <ListItemText
            primary={props.comment.content}
            secondary={
              <>
                <Typography
                  sx={{ display: "inline", fontSize: "11px" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {commenter.name + " — " + props.time}
                </Typography>
              </>
            }
          />
        </ListItem>
      </>
    )
  );
};

const InCardList = (props) => {
  const temp = props.temp;
  const theme = useTheme();
  const dispatch = useDispatch();

  const curUser = useSelector(selectUserProfile);
  const [openEdit, setOpenEdit] = useState(false);
  const [openBill, setOpenBill] = useState(false);
  const [content, setContent] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [allComments, setAllComments] = useState([]);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (expanded) {
      fetchCommentByPlace(temp._id).then((response) => {
        setAllComments(response.data);
      });
    }
  }, [update, expanded]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleClickEdit = () => {
    setOpenEdit(!openEdit);
  };
  const handleClickBill = () => {
    setOpenBill(true);
  };

  const handleClose = () => {
    setOpenBill(false);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleSaveEdit = () => {
    setOpenEdit(false);

    createComment({
      placeId: temp._id,
      userId: curUser._id,
      content: content,
    }).then((response) => {
      dispatch(addComment(response.data));
      setUpdate(!update);
    });
  };

  return (
    <Grid container spacing={0.5}>
      <Grid item xs={12}>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Checkbox />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="h4" color="text.primary">
                {temp.name}
              </Typography>
            }
            secondary={
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {temp.note}
              </Typography>
            }
          />
          <Box>
            <IconButton
              sx={{
                marginLeft: "5px",
                "&:hover": {
                  background: theme.palette.secondary.light,
                  color: theme.palette.secondary.dark,
                },
              }}
              onClick={handleClickEdit}
            >
              <EditIcon />
            </IconButton>

            <IconButton
              sx={{
                color: expanded ? theme.palette.secondary.dark : "",
                background: expanded ? theme.palette.secondary.light : "",
                marginLeft: "5px",
                "&:hover": {
                  background: theme.palette.secondary.light,
                  color: theme.palette.secondary.dark,
                },
              }}
              onClick={handleExpandClick}
            >
              <ChatIcon />
            </IconButton>

            <IconButton
              sx={{
                marginLeft: "5px",
                "&:hover": {
                  background: theme.palette.secondary.light,
                  color: theme.palette.secondary.dark,
                },
              }}
              onClick={handleClickBill}
            >
              <AttachMoneyIcon />
            </IconButton>
          </Box>
          <Dialog open={openBill} onClose={handleClose}>
            <DialogContent>
              <BillForm
                onClick={handleClose}
                description={temp.name}
                datePlanID={props.datePlanID}
              />
            </DialogContent>
          </Dialog>
        </ListItem>
      </Grid>

      <Grid item xs={12}>
        {openEdit && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <TextField
              fullWidth
              placeholder="Add Your Thoughts..."
              onChange={(event) => {
                setContent(event.target.value);
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
              <IconButton
                sx={{
                  marginLeft: "10px",
                  "&:hover": {
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                  },
                }}
                onClick={handleSaveEdit}
              >
                <CheckCircleIcon />
              </IconButton>
              <IconButton
                sx={{
                  marginLeft: "10px",
                  "&:hover": {
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                  },
                }}
                onClick={handleCloseEdit}
              >
                <CancelIcon />
              </IconButton>
            </Box>
          </Box>
        )}
      </Grid>

      <Grid item xs={12}>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            {allComments
              .slice()
              .reverse()
              .map((comment, index) => {
                return (
                  <Comment
                    key={index}
                    time={new Date(comment.createdAt).toLocaleString()}
                    comment={comment}
                    curUser={curUser}
                    onDelete={setUpdate}
                    isDelete={update}
                  />
                );
              })}
          </List>
        </Collapse>
      </Grid>
    </Grid>
  );
};

export default InCardList;
