import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
// material-ui
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { updateGroup } from "store/groupSlice";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { fetchCurGroup } from "api/group";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function DatePickerValue(props) {
  const handleChange = (e) => {
    props.onSave(e);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={props.value}
        onChange={handleChange}
        label={props.title}
      />
    </LocalizationProvider>
  );
}

const EditGroup = (props) => {
  const item = props.item;
  const [open, setOpen] = useState(false);

  const curPageParams = useParams();
  const customization = useSelector((state) => state.customization);
  const dispatch = useDispatch();
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupOrigin, setGroupOrigin] = useState("");
  const [groupDestination, setGroupDestination] = useState("");
  const [groupStartDate, setgroupStartDate] = useState("");
  const [groupEndDate, setgroupEndDate] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const curUser = useSelector((state) => state.users.currentUser);

  useEffect(() => {
    fetchCurGroup(curPageParams.groupid)
      .then((response) => {
        setgroupStartDate(response.data.startDate);
        setgroupEndDate(response.data.endDate);
        setGroupDestination(response.data.destination);
        setGroupDescription(response.data.description);
        setGroupName(response.data.name);
        setGroupOrigin(response.data.origin);
      })
      .catch((error) => {
        console.error(
          `Error retrieving curGroup ${curPageParams.groupid}: ${error}`
        );
      });
  }, []);

  const canSave =
    [
      groupName,
      groupOrigin,
      groupDestination,
      groupStartDate,
      groupEndDate,
    ].every(Boolean) && addRequestStatus === "idle";

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveClose = async () => {
    const newGroup = {
      _id: curPageParams.groupid,
      userid: curUser._id,
      name: groupName,
      description: groupDescription,
      origin: groupOrigin,
      destination: groupDestination,
      startDate: groupStartDate,
      endDate: groupEndDate,
    };
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        await dispatch(updateGroup(newGroup)).unwrap();
      } catch (err) {
        console.error("Failed to update card: ", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
    setOpen(false);
  };

  const level = 2;
  const itemIcon = (
    <FiberManualRecordIcon
      sx={{
        width:
          customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
        height:
          customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
      }}
      fontSize={level > 0 ? "inherit" : "medium"}
    />
  );

  return (
    <>
      <ListItemButton
        disabled={item.disabled}
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
          {itemIcon}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="h5" color="inherit">
              Edit Group
            </Typography>
          }
          onClick={handleOpen}
        ></ListItemText>
      </ListItemButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Group Information</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Group Name"
            defaultValue={groupName}
            fullWidth
            variant="outlined"
            onChange={(e) => setGroupName(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Group Description"
            defaultValue={groupDescription}
            fullWidth
            variant="outlined"
            onChange={(e) => setGroupDescription(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Where to GO?"
            defaultValue={groupDestination}
            fullWidth
            variant="outlined"
            onChange={(e) => setGroupDestination(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Where to Departure?"
            defaultValue={groupOrigin}
            fullWidth
            variant="outlined"
            onChange={(e) => setGroupOrigin(e.target.value)}
          />
          <Box
            sx={{
              pt: "15px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: "15px",
            }}
          >
            <DatePickerValue
              value={dayjs(groupStartDate)}
              onSave={setgroupStartDate}
              title="Start Date"
            />
            <DatePickerValue
              value={dayjs(groupEndDate)}
              onSave={setgroupEndDate}
              title="End Date"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSaveClose}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditGroup;
