// material-ui
import { Grid } from "@mui/material";
import { gridSpacing } from "store/constant";
import BlogCard from "./BlogCard";

const Blog = () => {
  return (
    <Grid data-testid="dashboard-grid" container spacing={gridSpacing}>
      <Grid item xs={12}>
        <BlogCard />
      </Grid>
    </Grid>
  );
};

export default Blog;
