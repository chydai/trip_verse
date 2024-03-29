import PerfectScrollbar from "react-perfect-scrollbar";
import InCard from "./InCard";
import { Grid, Box } from "@mui/material";
import { gridSpacing } from "store/constant";

const InTrip = () => {
  return (
    <Box>
      <PerfectScrollbar component="div">
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <InCard />
          </Grid>
        </Grid>
      </PerfectScrollbar>
    </Box>
  );
};

export default InTrip;
