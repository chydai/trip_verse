// material-ui
import { Grid } from "@mui/material";

import { gridSpacing } from "store/constant";

import GroupCard from "./GroupCard";

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  return (
    <Grid data-testid="dashboard-grid" container spacing={gridSpacing}>
      <Grid item xs={12}>
        <GroupCard />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
