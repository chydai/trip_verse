import { Grid, Button, Box, Alert } from "@mui/material";
import AnimateButton from "ui-component/extended/AnimateButton";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { addNewGroup } from "store/groupSlice";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase_setup/firebase";

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

const NewGroupButton = () => {
  const [open, setOpen] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupOrigin, setGroupOrigin] = useState("");
  const [groupDestination, setGroupDestination] = useState("");
  const [groupStartDate, setgroupStartDate] = useState(dayjs());
  const [groupEndDate, setgroupEndDate] = useState(dayjs());
  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const [isError, setIsError] = useState(0);

  const allInputs = { imgUrl: "" };
  const [imageAsFile, setImageAsFile] = useState("");
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);

  const curUser = useSelector((state) => state.users.currentUser);
  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setImageAsUrl(allInputs);
    setImageAsFile("");
  };

  const handleSaveClose = async () => {
    const canSave =
      [
        groupName,
        groupOrigin,
        groupDestination,
        groupStartDate,
        groupEndDate,
      ].every(Boolean) && addRequestStatus === "idle";
    const newGroup = {
      userid: curUser._id,
      name: groupName,
      description: groupDescription,
      origin: groupOrigin,
      destination: groupDestination,
      startDate: groupStartDate.toISOString().slice(0, 10),
      endDate: groupEndDate.toISOString().slice(0, 10),
      imgUrl: imageAsUrl.imgUrl,
    };
    if (canSave) {
      if (groupStartDate > groupEndDate) {
        setIsError(1);
      } else {
        try {
          setAddRequestStatus("pending");
          await dispatch(addNewGroup(newGroup)).unwrap();
          setgroupStartDate("");
          setgroupEndDate("");
          setGroupDestination("");
          setGroupDescription("");
          setGroupName("");
          setGroupOrigin("");
          setImageAsUrl(allInputs);
          setImageAsFile("");
        } catch (err) {
          console.error("Failed to update card: ", err);
        } finally {
          setAddRequestStatus("idle");
        }
        setOpen(false);
      }
    }
  };

  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile((imageFile) => image);
  };

  const handleFireBaseUpload = (e) => {
    e.preventDefault();
    // async magic goes here...
    if (imageAsFile === "") {
      console.error(`not an image, the image file is a ${typeof imageAsFile}`);
    }
    const uploadTask = ref(storage, `/images/${imageAsFile.name}`);
    uploadBytes(uploadTask, imageAsFile)
      .then((snapshot) => {
        // Get the image download URL
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          setImageAsUrl({ imgUrl: downloadURL });
          // You can now use the downloadURL to display the uploaded image
          // or store it in a database for later retrieval.
        });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  return (
    <Box display="flex" justifyContent="flex-end" sx={{ height: "30px" }}>
      <AnimateButton>
        <Button
          variant="contained"
          color="warning"
          sx={{ boxShadow: "none", height: 30 }}
          onClick={handleOpen}
        >
          Create New Group
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Input Group Information</DialogTitle>
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
              margin="dense"
              label="Group Description"
              defaultValue={groupDescription}
              fullWidth
              variant="outlined"
              onChange={(e) => setGroupDescription(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Where are you going?"
              defaultValue={groupDestination}
              fullWidth
              variant="outlined"
              onChange={(e) => setGroupDestination(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Where are you leaving from?"
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
                value={groupStartDate}
                onSave={setgroupStartDate}
                title="Start Date"
              />
              <DatePickerValue
                value={groupEndDate}
                onSave={setgroupEndDate}
                title="End Date"
              />
            </Box>

            <form onSubmit={handleFireBaseUpload}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center">
                    <Box mr={1}>
                      <TextField
                        type="file"
                        onChange={handleImageAsFile}
                        variant="outlined"
                        fullWidth
                      />
                    </Box>
                    <Box>
                      <Button type="submit" variant="contained" color="primary">
                        Upload
                      </Button>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex">
                    <img
                      src={imageAsUrl.imgUrl}
                      alt="Uploaded image preview"
                      style={{ width: "80%", height: "80%" }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </form>

            {isError === 1 && (
              <Alert
                sx={{
                  mt: "10px",
                }}
                onClose={() => {
                  setIsError(0);
                }}
                severity="error"
              >
                This is an error alert — Start Date cannot be later than End
                Date!
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSaveClose}>Save</Button>
          </DialogActions>
        </Dialog>
      </AnimateButton>
    </Box>
  );
};

export default NewGroupButton;
