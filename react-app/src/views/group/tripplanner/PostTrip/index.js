import { useDispatch, useSelector } from "react-redux";
import { styled, useTheme } from "@mui/material/styles";
import {
  Button,
  ButtonGroup,
  Card,
  AppBar,
  Box,
  CssBaseline,
  Grid,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import SubCard from "ui-component/cards/SubCard";
import { useState } from "react";
import { setMode } from "store/customizationSlice";
import ExpenseCard from "./ExpenseCard";
import SummaryCard from "./SummaryCard";

const PostTrip = () => {
  return (
    <Box>
      <PerfectScrollbar
        component="div"
        // style={{
        // height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 88px)',
        //     paddingLeft: '16px',
        //     paddingRight: '16px'
        // }}
      >
        <SummaryCard />
        <br></br>
        <ExpenseCard />
      </PerfectScrollbar>
    </Box>
  );
};

export default PostTrip;
