import React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Card, Box, Grid, Typography, CardContent } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PerfectScrollbar from "react-perfect-scrollbar";
import { gridSpacing } from "store/constant";
import { useParams } from "react-router";
import TripCard from "./TripCard";
import { fetchAllPlan } from "store/preTripPlanSlice";
import { planCleared } from "store/preTripPlaceSlice";
import axios from "axios";

axios.defaults.withCredentials = true;

const SummaryCard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const curRoute = useParams();
  const channelId = curRoute.channelid;
  const [combinedPlaces, setCombinedPlaces] = useState([]);

  const url = process.env.REACT_APP_BASE_URL + "/place";

  useEffect(() => {
    const fetchPlaces = async (planId) => {
      const response = await axios.get(`${url}/all/${planId}`);
      return response.data;
    };

    const getCombinedPlaces = async (planIds) => {
      const promises = planIds.map((planId) => fetchPlaces(planId));
      const places = await Promise.all(promises);
      setCombinedPlaces(places.flat());
    };

    if (channelId) {
      dispatch(fetchAllPlan(channelId))
        .then((newPlan) => {
          const planIds = newPlan.payload.map((plan) => plan._id);
          return planIds;
        })
        .then((planIds) => {
          getCombinedPlaces(planIds);
        });
    }
  }, [channelId, dispatch]);

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
