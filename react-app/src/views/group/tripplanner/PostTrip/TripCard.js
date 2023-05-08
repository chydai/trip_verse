import { Box, Card, CardContent, Typography, CardMedia } from "@mui/material";
import { useTheme } from "@emotion/react";

function TripCard(props) {
  const theme = useTheme();

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
              {props.name}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              {props.note}
            </Typography>
          </CardContent>
          <Box
            sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}
          ></Box>
        </Box>
        <CardMedia
          component="img"
          sx={{ width: 151 }}
          image={
            props.imgUrl !== ""
              ? props.imgUrl
              : "https://firebasestorage.googleapis.com/v0/b/tpchatchat.appspot.com/o/IMG_5485.jpeg?alt=media&token=90247e73-63d6-4475-acb3-bd52f5ca2ead"
          }
          alt="image"
        />
      </>
    </Card>
  );
}

export default TripCard;
