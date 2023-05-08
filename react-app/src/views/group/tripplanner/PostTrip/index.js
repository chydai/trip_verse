import { Box } from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import ExpenseCard from "./ExpenseCard";
import SummaryCard from "./SummaryCard";

const PostTrip = () => {
  return (
    <Box>
      <PerfectScrollbar component="div">
        <SummaryCard />
        <br></br>
        <ExpenseCard />
      </PerfectScrollbar>
    </Box>
  );
};

export default PostTrip;
