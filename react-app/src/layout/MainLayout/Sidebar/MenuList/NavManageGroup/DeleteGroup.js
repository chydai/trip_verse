import { useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// material-ui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { deleteMyGroup } from "store/groupSlice";
import { menuOpen } from "store/customizationSlice";

const DeleteGroup = (props) => {
  const item = props.item;
  const [open, setOpen] = useState(false);

  const curPageParams = useParams();
  const customization = useSelector((state) => state.customization);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveClose = () => {
    dispatch(deleteMyGroup(curPageParams.groupid));
    dispatch(menuOpen("default"));
    navigate(`/`);
    setOpen(false);
  };

  const level = 2;

  return (
    <>
      <ListItemButton
        sx={{
          borderRadius: `${customization.borderRadius}px`,
          mb: 0.5,
          alignItems: "flex-start",
          backgroundColor: level > 1 ? "transparent !important" : "inherit",
          py: level > 1 ? 1 : 1.25,
          pl: `${level * 24}px`,
        }}
      >
        <ListItemIcon sx={{ my: "auto", minWidth: !item?.icon ? 18 : 36 }}>
          <FiberManualRecordIcon
            sx={{
              width:
                customization.isOpen.findIndex((id) => id === item?.id) > -1
                  ? 8
                  : 6,
              height:
                customization.isOpen.findIndex((id) => id === item?.id) > -1
                  ? 8
                  : 6,
            }}
            fontSize={level > 0 ? "inherit" : "medium"}
          />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="h5" color="inherit">
              Delete Group
            </Typography>
          }
          onClick={handleOpen}
        ></ListItemText>
      </ListItemButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this group?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSaveClose}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteGroup;
