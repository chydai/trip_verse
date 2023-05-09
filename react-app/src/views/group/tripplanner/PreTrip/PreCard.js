import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { Select, MenuItem, Card, Box, Grid, CardContent } from "@mui/material";
import { useState, useEffect } from "react";
import CardActions from "@mui/material/CardActions";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Alert from "@mui/material/Alert";
import { IconButton } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";

import EditableCard from "./EditableCard";
import AddNewCard from "./AddNewCard";
import { gridSpacing } from "store/constant";
import { addNewPlan, deletePlan, selectAllPlans } from "store/preTripPlanSlice";
import { useParams } from "react-router";
import { fetchAllPlan } from "store/preTripPlanSlice";
import {
  fetchAllPlace,
  selectAllPlaces,
  planCleared,
} from "store/preTripPlaceSlice";
import dayjs from "dayjs";

function DatePickerValue(props) {
  const handleChange = (e) => {
    props.onSave(e);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={props.value}
        onChange={handleChange}
        label="Add Itinerary"
      />
    </LocalizationProvider>
  );
}

const PreCard = () => {
  const theme = useTheme();

  const dispatch = useDispatch();

  const [isError, setIsError] = useState(0);
  const [value, setValue] = useState(dayjs());
  const [selectedIndex, setSelectedIndex] = useState(1);

  const allPlans = useSelector(selectAllPlans);
  const allPlaces = useSelector(selectAllPlaces);

  const [curPlan, setCurPlan] = useState("");

  const curRoute = useParams();
  const channelId = curRoute.channelid;

  const handleChange = (event) => {
    setCurPlan(event.target.value);
  };

  const handleClose = () => {
    setIsError(0);
  };

  useEffect(() => {
    if (channelId) {
      setCurPlan("");
      dispatch(planCleared()); // clear all places list in cur plan
      dispatch(fetchAllPlan(channelId)).then((newPlan) => {
        if (newPlan.payload.length) setCurPlan(newPlan.payload[0]._id);
      });
    }
  }, [channelId, dispatch]);

  useEffect(() => {
    if (allPlans.length) {
      setCurPlan(allPlans[0]._id);
    }
  }, [allPlans.length, dispatch]);

  useEffect(() => {
    if (curPlan) {
      dispatch(fetchAllPlace(curPlan));
    }
  }, [curPlan, dispatch]);

  const handleClickItem = (event, planId = "", index) => {
    handleClose();
    setSelectedIndex(index);
    if (planId) {
      setCurPlan(planId);
    }
  };

  const parsed_date = allPlans.map((plan) => ({
    _id: plan._id,
    display: plan.date,
  }));
  parsed_date.sort((a, b) => {
    if (a.display < b.display) {
      return -1;
    } else if (a.display > b.display) {
      return 1;
    } else {
      return 0;
    }
  });

  const handleAddDate = () => {
    if (!value) {
      setIsError(2);
      console.error("Date not selected");
    } else {
      const isDuplicate = allPlans.find(
        (plan) => plan.date === value.toISOString().slice(0, 10)
      );
      if (isDuplicate) {
        setIsError(1);
        console.error("Plan with same date already exists");
      } else {
        setIsError(0);
        const formattedDate = value.toISOString().slice(0, 10);
        dispatch(
          addNewPlan({ date: formattedDate, channelId: channelId })
        ).then((newPlan) => {
          setCurPlan(newPlan.payload._id);
        });
      }
    }
  };

  const handleDeleteDate = () => {
    dispatch(deletePlan(curPlan));
    setCurPlan("");
    dispatch(planCleared());
  };

  return (
    <Box>
      <Card
        sx={{
          border: "1px solid",
          borderColor: theme.palette.primary.light,
          ":hover": {
            boxShadow: "0 2px 14px 0 rgb(32 40 45 / 8%)",
          },
        }}
      >
        <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel>Itinerary</InputLabel>
              <Select value={curPlan} label="Itinerary" onChange={handleChange}>
                {parsed_date.map((temp, index) => {
                  return (
                    <MenuItem
                      key={temp._id}
                      selected={index === selectedIndex}
                      onClick={(event) =>
                        handleClickItem(event, temp._id, index)
                      }
                      value={temp._id}
                    >
                      {temp.display}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <DatePickerValue value={value} onSave={setValue} />

            <IconButton
              sx={{
                marginLeft: "5px",
                "&:hover": {
                  background: theme.palette.secondary.light,
                  color: theme.palette.secondary.dark,
                },
              }}
              onClick={handleAddDate}
            >
              <AddBoxIcon />
            </IconButton>

            <IconButton
              sx={{
                marginLeft: "5px",
                "&:hover": {
                  background: theme.palette.secondary.light,
                  color: theme.palette.secondary.dark,
                },
              }}
              onClick={handleDeleteDate}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </CardActions>

        <CardContent>
          <Grid container spacing={gridSpacing}>
            {isError === 1 && (
              <Grid item xs={12}>
                <Alert
                  onClose={() => {
                    setIsError(0);
                  }}
                  severity="error"
                >
                  This is an error alert — Duplicated Itinerary Date!
                </Alert>
              </Grid>
            )}
            {isError === 2 && (
              <Grid item xs={12}>
                <Alert
                  onClose={() => {
                    setIsError(0);
                  }}
                  severity="error"
                >
                  This is an error alert — Itinerary Date Not Selected!
                </Alert>
              </Grid>
            )}

            {allPlaces.map((plan) => {
              return (
                <Grid key={plan._id} item xs={12}>
                  <EditableCard
                    key={plan._id}
                    title={plan.name}
                    content={plan.note}
                    placeId={plan._id}
                    imgUrl={plan.imgUrl}
                  />
                </Grid>
              );
            })}

            <Grid item xs={12}>
              <AddNewCard
                title="Add New Place.."
                content="Add Notes.."
                planId={curPlan}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PreCard;
