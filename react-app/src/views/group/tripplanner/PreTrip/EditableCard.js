import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  TextField,
  CardHeader,
  CardMedia,
} from "@mui/material";
import { Edit as EditIcon, Cancel as CancelIcon } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@emotion/react";
// import { planDeleted, planUpdated } from 'store/preTripPlanSlice';
import { updatePlace, deletePlace } from "store/preTripPlaceSlice";
import { useDispatch } from "react-redux";

function EditableCard(props) {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(props.title);
  const [content, setContent] = useState(props.content);
  const dispatch = useDispatch();
  console.log("in editable title:",title)
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setTitle(props.title);
    setContent(props.content);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // props.onSave({title, content});
    dispatch(updatePlace({ name: title, note: content, _id: props.placeId }));
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleDelete = () => {
    dispatch(deletePlace(props.placeId));
  };

  return (

    <Card
      sx={{
        display: "flex",
        justifyContent: "space-between",
        border: "1px solid",
        borderColor: theme.palette.primary.light,
        ":hover": {
          boxShadow: "0 2px 14px 0 rgb(32 40 45 / 8%)",
        },
      }}
    >
      {isEditing ? (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent>
              <TextField
                fullWidth
                margin="normal"
                label="Title"
                value={title}
               
                onChange={handleTitleChange}
                multiline
              />
              
              <TextField
                fullWidth
                margin="normal"
                label="Content"
                value={content}
                onChange={handleContentChange}
                multiline
              />
            </CardContent>

            <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
              <IconButton
                sx={{
                  marginLeft: "10px",
                  "&:hover": {
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                  },
                }}
                onClick={handleSaveClick}
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
                onClick={handleCancelClick}
              >
                <CancelIcon />
              </IconButton>
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ flexGrow: "1.5" }}>
            <CardContent sx={{}}>
              <Typography component="div" variant="h5">
                {title}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                {content}
              </Typography>
            </CardContent>
            <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
              <IconButton
                sx={{
                  marginLeft: "10px",
                  "&:hover": {
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                  },
                }}
                onClick={handleEditClick}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                sx={{
                  marginLeft: "10px",
                  "&:hover": {
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                  },
                }}
                onClick={handleDelete}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
          <CardMedia
            component="img"
            sx={{ width: 151 }}
            image={props.imgUrl? props.imgUrl: "https://picsum.photos/400/300"}
            alt="places"
          />
        </>
      )}
    </Card>
  );
}

export default EditableCard;
