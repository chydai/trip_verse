import { Box, Card, CardContent, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";

function ExpenseTotalCard(props) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "space-between",
        border: "4px solid",
        borderColor: theme.palette.secondary.light,
        ":hover": {
          boxShadow: "0 4px 28px 0 rgb(32 40 45 / 8%)",
        },
      }}
    >
      <>
        <Box sx={{ flexGrow: "1.5" }}>
          <CardContent
            sx={{
              bgcolor: theme.palette.secondary.light,
              alignItems: "center",
              pl: 1,
              pb: 1,
            }}
          >
            <Typography
              fontWeight="bold"
              fontSize={25}
              align="center"
              component="div"
              variant="button"
              color="purple"
            >
              {props.title}
            </Typography>
            <Typography></Typography>
            <Typography
              fontWeight="bold"
              fontSize={20}
              align="center"
              variant="subtitle1"
              component="div"
              color="purple"
            >
              ${props.content}
            </Typography>
          </CardContent>
        </Box>
      </>
    </Card>
  );
}

export default ExpenseTotalCard;
