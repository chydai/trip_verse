// material-ui
import { styled, useTheme } from "@mui/material/styles";
import {
  Avatar,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";

import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { addNewChannel } from "store/channelSlice";
import { useParams } from "react-router";

const CardStyle = styled(Card)(({ theme }) => ({
  background: theme.palette.primary.light,
  marginBottom: "22px",
  overflow: "hidden",
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    width: "137px",
    height: "137px",
    background: theme.palette.primary[200],
    borderRadius: "50%",
    top: "-105px",
    right: "-96px",
  },
}));

const MenuCard = () => {
  const theme = useTheme();
  const [channelName, setChannelName] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const curGroup = useParams();
  const dispatch = useDispatch();

  const canSave = [channelName].every(Boolean) && addRequestStatus === "idle";

  const handleSaveClose = async () => {
    const newChannel = {
      groupid: curGroup.groupid,
      name: channelName,
    };
    if (canSave) {
      try {
        setAddRequestStatus("pending");

        //We need to add it to the channel
        await dispatch(addNewChannel(newChannel)).unwrap();
        setChannelName("");
      } catch (err) {
        console.error("Failed to update card: ", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };
  return (
    <CardStyle>
      <CardContent sx={{ p: 2 }}>
        <List sx={{ p: 0, m: 0 }}>
          <ListItem alignItems="flex-start" disableGutters sx={{ p: 0 }}>
            <ListItemAvatar sx={{ mt: 0 }}>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.largeAvatar,
                  color: theme.palette.primary.main,
                  border: "none",
                  borderColor: theme.palette.primary.main,
                  background: "#fff",
                  marginRight: "12px",
                }}
              >
                <GroupAddIcon onClick={handleSaveClose} fontSize="inherit" />
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              sx={{ mt: 0 }}
              primary={
                <TextField
                  label="Add New Channel"
                  variant="outlined"
                  placeholder="Channel Name"
                  onChange={(e) => setChannelName(e.target.value)}
                ></TextField>
              }
            />
          </ListItem>
        </List>
      </CardContent>
    </CardStyle>
  );
};

export default MenuCard;
