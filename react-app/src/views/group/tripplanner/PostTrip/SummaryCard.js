import React from "react";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Dialog,
  Select,
  MenuItem,
  Button,
  ButtonGroup,
  Card,
  AppBar,
  Box,
  CssBaseline,
  Grid,
  Toolbar,
  Typography,
  Icon,
  IconButton,
  CardContent,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import PerfectScrollbar from "react-perfect-scrollbar";
import { gridSpacing } from "store/constant";
import { useParams } from "react-router";
import TripCard from "./TripCard";
import { fetchAllPlan, selectAllPlans } from "store/preTripPlanSlice";
import { fetchAllPlace, selectAllPlaces } from "store/preTripPlaceSlice";
import axios from "axios";
axios.defaults.withCredentials = true;

const SummaryCard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const curRoute = useParams();
  const channelId = curRoute.channelid;
  const [combinedPlaces, setCombinedPlaces] = useState([]);

  const plans = useSelector(selectAllPlans);
  const planIds = plans.map((plan) => plan._id);

  const url = process.env.REACT_APP_BASE_URL + "/place";

  useEffect(() => {
    const fetchPlaces = async (planId) => {
      const response = await axios.get(`${url}/all/${planId}`);
      // console.log("fetchPlaces", response.data);
      return response.data;
    };

    const getCombinedPlaces = async () => {
      const promises = planIds.map((planId) => fetchPlaces(planId));
      const places = await Promise.all(promises);
      setCombinedPlaces(places.flat());
      console.log("combinedPlaces", combinedPlaces);
    };

    getCombinedPlaces();
  }, []);

  return (
    <Box>
      <PerfectScrollbar component="div">
        <Card
          sx={{
            border: "0px solid",
            borderColor: theme.palette.primary.light,
            borderRadius: 2,
            p: 2,
            position: "relative",
          }}
        >
          <Box
            sx={{
              border: "1px solid",
              borderColor: theme.palette.primary.light,

              borderRadius: 2,
              p: 2,
              position: "relative",
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                position: "absolute",
                top: -10,
                left: 8,
                bgcolor: "white",
                color: "text.secondary",
                px: 1,
              }}
            >
              You Trip Summary
            </Typography>
            <CardContent>
              <Grid container spacing={gridSpacing}>
                {combinedPlaces.map((places, index) => (
                  <Grid item xs={12} key={index}>
                    <TripCard
                      name={places.name}
                      note={places.note}
                      startTime={places.startTime}
                      endTime={places.endTime}
                      imgUrl={places.imgUrl}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Box>
        </Card>
      </PerfectScrollbar>
    </Box>
  );
};

export default SummaryCard;
