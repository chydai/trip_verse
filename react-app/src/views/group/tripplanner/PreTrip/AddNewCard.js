import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Grid,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  TextField,
  CardHeader,
  CardMedia,
  Input,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Delete,
} from '@mui/icons-material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useTheme } from '@emotion/react';
import { addNewPlace } from 'store/preTripPlaceSlice';
import { storage } from '../../../../firebase_setup/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

function AddNewCard(props) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();

  const allInputs = { imgUrl: '' };
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageAsFile, setImageAsFile] = useState('');
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);

  useEffect(() => localStorage.setItem('planId', props.planId), [props.planId]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveClick = () => {
    dispatch(
      addNewPlace({
        name: title,
        note: content,
        planId: props.planId,
        imgUrl: imageAsUrl.imgUrl,
      })
    );
    setTitle('');
    setContent('');
    setImageAsUrl(allInputs);
    setImageAsFile('');
  };

  // const handleSaveClose = async () => {
  //   try {
  //       setAddRequestStatus("pending");
  //       await dispatch(addNewPost(newPost)).unwrap();
  //       setPostTitle("");
  //       setPostText("");
  //       setImageAsUrl(allInputs);
  //       setImageAsFile("");
  //     } catch (err) {
  //       console.error("Failed to add img: ", err);
  //     }
  //   }
  //   setOpen(false);
  // };

  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile((imageFile) => image);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleFireBaseUpload = (e) => {
    e.preventDefault();
    console.log('start of upload', imageAsFile);
    // async magic goes here...
    if (imageAsFile === '') {
      console.error(`not an image, the image file is a ${typeof imageAsFile}`);
    }
    const uploadTask = ref(storage, `/images/${imageAsFile.name}`);
    uploadBytes(uploadTask, imageAsFile)
      .then((snapshot) => {
        console.log('Uploaded a blob or file!');
        // Get the image download URL
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          setImageAsUrl({ imgUrl: downloadURL });
          // You can now use the downloadURL to display the uploaded image
          // or store it in a database for later retrieval.
        });
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  };

  return (
    <Card
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        border: '1px solid',
        borderColor: theme.palette.primary.light,
        ':hover': {
          boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)',
        },
      }}
    >
      <Box sx={{ flexGrow: '1.5' }}>
        <CardContent>
          <Grid container>
            <Grid item xs={12}>
              <Input
                placeholder="Add New Places.."
                value={title}
                disableUnderline
                onChange={handleTitleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                placeholder="Add Notes.."
                value={content}
                disableUnderline
                onChange={handleContentChange}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          <IconButton
            sx={{
              marginLeft: '10px',
              '&:hover': {
                background: theme.palette.secondary.light,
                color: theme.palette.secondary.dark,
              },
            }}
            onClick={handleSaveClick}
          >
            <AddBoxIcon />
          </IconButton>
          <IconButton
            sx={{
              marginLeft: '10px',
              '&:hover': {
                background: theme.palette.secondary.light,
                color: theme.palette.secondary.dark,
              },
            }}
            onClick={handleOpen}
          >
            <AddPhotoAlternateIcon />
          </IconButton>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add an image</DialogTitle>
            <DialogContent>
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
                        src={imageAsUrl.imgUrl}
                        alt="Uploaded image preview"
                        style={{ width: '80%', height: '80%' }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Card>
  );
}

export default AddNewCard;
