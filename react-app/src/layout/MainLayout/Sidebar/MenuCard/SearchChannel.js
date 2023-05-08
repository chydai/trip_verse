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

// assets
import CoPresentIcon from "@mui/icons-material/CoPresent";
import { joinNewChannel } from "store/channelSlice";

const CardStyle = styled(Card)(({ theme }) => ({
  background: "#f0ecfc",
  marginBottom: "22px",
  overflow: "hidden",
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    width: "137px",
    height: "137px",
    background: "#834bff",
    borderRadius: "50%",
    top: "-105px",
    right: "-96px",
  },
}));

// ==============================|| PROGRESS BAR WITH LABEL ||============================== //

// ==============================|| SIDEBAR MENU Card ||============================== //

const SearchChannel = () => {
  const theme = useTheme();
  const [channelName, setChannelName] = useState("");
  const dispatch = useDispatch();

  const handleSaveClose = async () => {
    try {
      await dispatch(joinNewChannel(channelName)).unwrap();
      setChannelName("");
    } catch (err) {
      console.error("Failed to find channel ", err);
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
                  color: "#834bff",
                  border: "none",
                  borderColor: "#c29fff",
                  background: "#fff",
                  marginRight: "12px",
                }}
              >
                <CoPresentIcon onClick={handleSaveClose} fontSize="inherit" />
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              sx={{ mt: 0 }}
              primary={
                <TextField
                  label="Join New Channel"
                  variant="outlined"
                  placeholder="Channel ID"
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

export default SearchChannel;
