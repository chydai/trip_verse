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
import { useDispatch } from "react-redux";

function TripCard(props) {
  const theme = useTheme();
  const [name, setName] = useState(props.name);
  const [note, setNote] = useState(props.note);
  const [startTime, setStartTime] = useState(props.startTime);
  const [endTime, setEndTime] = useState(props.endTime);
  const [imgUrl, setImgUrl] = useState(props.imgUrl);
  const dispatch = useDispatch();

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
      <>
        <Box sx={{ flexGrow: "1.5" }}>
          <CardContent sx={{}}>
            <Typography component="div" variant="h5">
              {name}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              {note}
            </Typography>
          </CardContent>
          <Box
            sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}
          ></Box>
        </Box>
        <CardMedia
          component="img"
          sx={{ width: 151 }}
          // image={imgUrl}
          image="https://firebasestorage.googleapis.com/v0/b/tpchatchat.appspot.com/o/IMG_5485.jpeg?alt=media&token=90247e73-63d6-4475-acb3-bd52f5ca2ead"
          alt="image"
        />
      </>
    </Card>
  );
}

export default TripCard;
