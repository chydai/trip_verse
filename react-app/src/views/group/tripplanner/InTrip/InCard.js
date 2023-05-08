// similar to precard

import { useDispatch, useSelector } from 'react-redux';
import { styled, useTheme } from '@mui/material/styles';
import { List, Select, MenuItem, Button, Card, Box, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Typography, CardContent } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PerfectScrollbar from 'react-perfect-scrollbar';
import SubCard from 'ui-component/cards/SubCard';
import { useState, useEffect } from 'react';
import CardActions from '@mui/material/CardActions';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { gridSpacing } from 'store/constant';

import { addNewPlan, deletePlan, selectAllPlans } from 'store/preTripPlanSlice';
import { useParams } from 'react-router';
import { fetchAllPlan } from 'store/preTripPlanSlice';
import { fetchAllPlace, selectAllPlaces, planCleared } from 'store/preTripPlaceSlice';

import InCardList from './InCardList';
import BillCard from './BillCard';
import BillForm from './BillForm';

const InCard = () => {
    const theme = useTheme()

    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState(null);
    const [isError, setIsError] = useState(0);
    const [value, setValue] = useState("");
    const [openBill, setOpenBill] = useState(false);

    const [selectedIndex, setSelectedIndex] = useState(1);

    const allPlans = useSelector(selectAllPlans);
    const allPlaces = useSelector(selectAllPlaces);

    const [curPlan, setCurPlan] = useState("");

    const curRoute = useParams();
    const channelId = curRoute.channelid;

    const handleClickBill = () => {
        setOpenBill(true);
    };

    const handleCloseBill = () => {
        setOpenBill(false);
    };

    const handleChange = (event) => {
        setCurPlan(event.target.value)
    }

    const handleClose = () => {
        setIsError(0)
        setAnchorEl(null);
    };

    useEffect(() => {
        if (channelId) {
            setCurPlan("")
            dispatch(planCleared()) // clear all places list in cur plan
            dispatch(fetchAllPlan(channelId))
                .then((newPlan) => {
                    if (newPlan.payload.length) setCurPlan(newPlan.payload[0]._id)
                });
        }
    }, [channelId, dispatch])

    useEffect(() => {
        if (allPlans.length) {
            setCurPlan(allPlans[0]._id)
        }
    }, [allPlans, dispatch])

    useEffect(() => {
        if (curPlan) { dispatch(fetchAllPlace(curPlan)) }
    }, [curPlan, dispatch])

    const handleClickItem = (event, planId = "", index) => {
        handleClose();
        setSelectedIndex(index);
        if (planId) {
            setCurPlan(planId)
        }
    };

    // console.log(curPlan)
    const parsed_date = allPlans.map((plan) => ({ _id: plan._id, display: plan.date }))
    parsed_date.sort((a, b) => {
        if (a.display < b.display) {
            return -1;
        } else if (a.display > b.display) {
            return 1;
        } else {
            return 0;
        }
    });



    return (
        <Box>
            <Card
                sx={{
                    border: '1px solid',
                    borderColor: theme.palette.primary.light,
                    ':hover': {
                        boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                    },
                }}>
                <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ minWidth: 200 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Itinerary</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={curPlan}
                                label="Itinerary"
                                onChange={handleChange}
                            >
                                {parsed_date.map((temp, index) => {
                                    return (
                                        <MenuItem
                                            key={temp._id}
                                            selected={index === selectedIndex}
                                            onClick={(event) => handleClickItem(event, temp._id, index)}
                                            value={temp._id}
                                        >
                                            {temp.display}
                                        </MenuItem>
                                    )
                                }
                                )}

                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            variant="outlined"
                            sx={{
                                background: theme.palette.secondary.light,
                                color: theme.palette.secondary.dark,
                                borderColor: "white",
                                marginLeft: '5px',
                                '&:hover': {
                                    borderColor: "white",
                                    background: theme.palette.secondary.dark,
                                    color: theme.palette.secondary.light
                                }

                            }}
                            onClick={handleClickBill}
                            startIcon={<AttachMoneyIcon />}>
                            Add an Expense
                        </Button>
                    </Box>
                    <Dialog open={openBill} onClose={handleCloseBill}>

                        <DialogContent>

                            <BillForm onClick={handleCloseBill} datePlanID={curPlan} description="" />

                        </DialogContent>

                    </Dialog>

                </CardActions>

                <CardContent  >
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    border: '1px solid',
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
                                    Travel Plan Checklist
                                </Typography>
                                <List >
                                    {allPlaces.map(
                                        (temp, index) => <InCardList key={index} temp={temp} datePlanID={curPlan} />
                                    )}
                                </List>

                            </Box>

                        </Grid>
                        <Grid item xs={12}>
                            {curPlan && <BillCard datePlanID={curPlan} />}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    )
}

export default InCard;