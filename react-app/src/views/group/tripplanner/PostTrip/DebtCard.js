import { Box, Card, CardContent, Typography, CardMedia } from "@mui/material";
import { useTheme } from "@emotion/react";

function DebtCard(props) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "space-between",
        border: "2px solid",
        borderColor: theme.palette.success.light,
        ":hover": {
          boxShadow: "0 2px 14px 0 rgb(32 40 45 / 8%)",
        },
      }}
    >
      <>
        <Box sx={{ flexGrow: "1.5" }}>
          <CardContent
            sx={{
              bgcolor: theme.palette.success.light,
              alignItems: "center",
              pl: 1,
              pb: 1,
            }}
          >
            {props.content < 0 ? (
              <Typography
                fontWeight="bold"
                fontSize={15}
                align="center"
                component="div"
                color="green"
              >
                You lent group member - {props.title}: ${-1 * props.content}
              </Typography>
            ) : (
              <Typography
                fontWeight="bold"
                fontSize={15}
                align="center"
                component="div"
                color="green"
              >
                You owe group member - {props.title}: ${props.content}
              </Typography>
            )}
          </CardContent>
        </Box>
        <CardMedia
          component="img"
          sx={{ width: 80 }}
          image="https://firebasestorage.googleapis.com/v0/b/tpchatchat.appspot.com/o/dollar.png?alt=media&token=7fa721e4-bebb-4fe6-a8d9-50ccd978e899"
          alt="debts"
        />
      </>
    </Card>
  );
}

export default DebtCard;
