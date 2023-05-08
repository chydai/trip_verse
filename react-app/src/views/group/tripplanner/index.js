import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { Button, ButtonGroup } from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";

import MainCard from "ui-component/cards/MainCard";
import { useState } from "react";
import { setMode } from "store/customizationSlice";
import PreTrip from "./PreTrip";
import InTrip from "./InTrip";
import PostTrip from "./PostTrip";

const ModeSelect = (props) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [selectedInd, setSelectedInd] = useState(
    props.customization.travelMode
  );
  const handleClick = (curInd) => {
    setSelectedInd(curInd);
    dispatch(setMode(curInd));
  };

  return (
    <ButtonGroup
      disableElevation
      variant="contained"
      sx={{
        "& .MuiButtonGroup-grouped:not(:last-child)": {
          borderRight: "0px",
        },
        height: "30px",
      }}
    >
      <Button
        sx={{
          color: selectedInd === 0 ? theme.palette.secondary.dark : "inherit",
          background:
            selectedInd === 0 ? theme.palette.secondary.light : "inherit",
          "&:hover": {
            background: theme.palette.secondary.dark,
            color: theme.palette.secondary.light,
          },
        }}
        onClick={() => handleClick(0)}
      >
        Pre
      </Button>
      <Button
        sx={{
          color: selectedInd === 1 ? theme.palette.secondary.dark : "inherit",
          background:
            selectedInd === 1 ? theme.palette.secondary.light : "inherit",
          "&:hover": {
            background: theme.palette.secondary.dark,
            color: theme.palette.secondary.light,
          },
        }}
        onClick={() => handleClick(1)}
      >
        In
      </Button>
      <Button
        sx={{
          color: selectedInd === 2 ? theme.palette.secondary.dark : "inherit",
          background:
            selectedInd === 2 ? theme.palette.secondary.light : "inherit",
          "&:hover": {
            background: theme.palette.secondary.dark,
            color: theme.palette.secondary.light,
          },
        }}
        onClick={() => handleClick(2)}
      >
        Post
      </Button>
    </ButtonGroup>
  );
};

const TripPlan = () => {
  const customization = useSelector((state) => state.customization);
  const selectedInd = customization.travelMode;
  return (
    <MainCard
      style={{ height: "600px", overflow: "hidden" }}
      title="Trip Planner"
      secondary={<ModeSelect customization={customization} />}
    >
      <PerfectScrollbar
        component="div"
        style={{
          height: "480px",
        }}
      >
        {selectedInd === 0 ? <PreTrip /> : null}
        {selectedInd === 1 ? <InTrip /> : null}
        {selectedInd === 2 ? <PostTrip /> : null}
      </PerfectScrollbar>
    </MainCard>
  );
};

export default TripPlan;
