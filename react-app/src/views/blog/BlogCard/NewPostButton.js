/* eslint-disable jsx-a11y/img-redundant-alt */
import { Grid, Button, Box } from "@mui/material";
import AnimateButton from "ui-component/extended/AnimateButton";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { storage } from "../../../firebase_setup/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

//import { addNewGroup } from 'store/groupSlice';
import { addNewPost } from "store/postSlice";

const NewPostButton = () => {
  const [open, setOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const allInputs = { imgUrl: [] };
  const [imageAsFile, setImageAsFile] = useState([]);
  const [imageAsUrl, setImageAsUrl] = useState([]);
  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const curUser = useSelector((state) => state.users.currentUser);
  const dispatch = useDispatch();
  const canSave =
    [postTitle, postText, imageAsUrl].every(Boolean) &&
    addRequestStatus === "idle";
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  {
    const handleSaveClose = async () => {
      const newPost = {
        title: postTitle,
        content: postText,
        imgUrls: imageAsUrl,
      };
      
      if (canSave) {
        try {
          setAddRequestStatus("pending");
          console.log("this is body", newPost);
          await dispatch(addNewPost(newPost)).unwrap();

          setPostTitle("");
          setPostText("");
          setImageAsUrl([]);
          setImageAsFile("");
        } catch (err) {
          console.error("Failed to update card: ", err);
        } finally {
          setAddRequestStatus("idle");
        }
      }
      setOpen(false);
    };

    const handleImageAsFile = (e) => {
      const files = e.target.files;
      // setImageAsFile((imageFile) => image);
      setImageAsFile([...imageAsFile, ...files]);
    };

    const handleFireBaseUpload = (e) => {
      e.preventDefault();
      console.log("start of upload", imageAsFile);

      if (imageAsFile.length === 0) {
        console.error("No images selected");
        return;
      }

      // async magic goes here...
      if (imageAsFile === "") {
        console.error(
          `not an image, the image file is a ${typeof imageAsFile}`
        );
      }

      // const uploadTask = ref(storage, `/images/${imageAsFile.name}`);
      // uploadBytes(uploadTask, imageAsFile)
      //   .then((snapshot) => {
      //     console.log("Uploaded a blob or file!");
      //     // Get the image download URL
      //     getDownloadURL(snapshot.ref).then((downloadURL) => {
      //       console.log("File available at", downloadURL);
      //       setImageAsUrl({ imgUrl: downloadURL });
      //       // You can now use the downloadURL to display the uploaded image
      //       // or store it in a database for later retrieval.
      //     });
      //   })
      //   .catch((error) => {
      //     console.error("Error uploading image:", error);
      //   });
      // Loop through image files and upload each one
      const updatedUrls = [];
      imageAsFile.forEach((imageAsFile) => {
        if (imageAsFile === "") {
          console.error(
            `not an image, the image file is a ${typeof imageAsFile}`
          );
          return;
        }
        const uploadTask = ref(storage, `/images/${imageAsFile.name}`);
        uploadBytes(uploadTask, imageAsFile)
          .then((snapshot) => {
            console.log("Uploaded a blob or file!");
            // Get the image download URL
            getDownloadURL(snapshot.ref).then((downloadURL) => {
              // console.log("File available at", downloadURL);
              updatedUrls.push(downloadURL);
              setImageAsUrl(updatedUrls);
              // console.log("this is imageAsUrl", imageAsUrl);
              // You can now use the downloadURL to display the uploaded image
              // or store it in a database for later retrieval.
            });
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });
      });
    };

    // const handleDelete = async () => {
    //     try {
    //         await dispatch(deleteCard({ deckid, cardid }))
    //     } catch (err) {
    //         console.error('Failed to delete card: ', err)
    //     }
    // }

    return (
      <Box display="flex" justifyContent="flex-end">
        <AnimateButton>
          <Button
            variant="contained"
            color="warning"
            sx={{ boxShadow: "none", height: 30 }}
            onClick={handleOpen}
          >
            Create New Post
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Input Post Content</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="What is this post about"
                defaultValue={postTitle}
                fullWidth
                variant="outlined"
                onChange={(e) => setPostTitle(e.target.value)}
              />
              <TextField
                autoFocus
                margin="dense"
                label="Post Text Content"
                defaultValue={postText}
                fullWidth
                variant="outlined"
                onChange={(e) => setPostText(e.target.value)}
              />
              <form onSubmit={handleFireBaseUpload}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center">
                      <Box mr={1}>
                        {/* <TextField
                          type="file"
                          onChange={handleImageAsFile}
                          variant="outlined"
                          fullWidth
                          multiple
                        /> */}
                        <input
                          type="file"
                          onChange={handleImageAsFile}
                          multiple
                        />
                      </Box>
                      <Box>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
                          Upload
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex">
                      <img
                        src={imageAsUrl}
                        alt="Uploaded image preview"
                        style={{ width: "80%", height: "80%" }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSaveClose}>Save</Button>
            </DialogActions>
          </Dialog>
        </AnimateButton>
      </Box>
    );
  }
};

export default NewPostButton;
