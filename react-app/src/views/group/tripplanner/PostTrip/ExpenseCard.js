import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { gridSpacing } from "store/constant";
import "axios";
import axios from "axios";

import { useParams } from "react-router";
import PerfectScrollbar from "react-perfect-scrollbar";

import DebtCard from "./DebtCard";
import ExpenseTotalCard from "./ExpenseTotalCard";

import { Card, Box, Grid, Typography, CardContent } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { selectAllChannels } from "store/channelSlice";
import { getUser } from "api/user";

axios.defaults.withCredentials = true;

const ExpenseCard = () => {
  const theme = useTheme();
  const curRoute = useParams();
  const channelId = curRoute.channelid;
  const curUser = useSelector((state) => state.users.currentUser);
  const userId = curUser._id;
  const url = process.env.REACT_APP_BASE_URL + "/debt/user";

  const [allDebts, setAllDebts] = useState([]);
  const [parsedDebts, setParsedDebts] = useState([]);
  const [totalDebt, setTotalDebt] = useState(0.0);

  const calculateTotalDebt = (debts) => {
    let len_debts = debts.length;
    let temp = 0;
    for (let i = 0; i < len_debts; i++) {
      temp += debts[i].balance;
    }
    return temp;
  };

  const parseDebts = (debts) => {
    return debts.map((debt) => ({
      _id: debt._id,
      channelId: debt.channelId,
      userId: debt.userId,
      targetId: debt.targetId,
      balance: debt.balance,
    }));
  };

  useEffect(() => {
    const fetchDebts = async (channelId, userId) => {
      await axios
        .get(`${url}/${userId}?channelId=${channelId}`)
        .then((response) => {
          setAllDebts(response.data);
          setTotalDebt(calculateTotalDebt(response.data));
        })
        .catch((err) => console.log(err));
    };
    fetchDebts(channelId, userId);
  }, [channelId, userId]);

  useEffect(() => {
    setParsedDebts(parseDebts(allDebts));
  }, [allDebts]);

  const channelList = useSelector(selectAllChannels);
  const curChannel = channelList.find((cur) => cur._id === channelId);
  const [people, setPeople] = useState([]);
  useEffect(() => {
    Promise.all(
      curChannel.members.map((userId) =>
        getUser(userId)
          .then((response) => response.data)
          .catch((error) => {
            console.error(`Error retrieving user ${userId}: ${error}`);
          })
      )
    )
      .then((userObjects) => {
        const people = userObjects.map((user) => ({
          name: user.name,
          id: user._id,
        }));
        setPeople(people);
      })
      .catch((error) => {
        console.error(`Error retrieving users: ${error}`);
      });
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
              Your Debts
            </Typography>
            <CardContent>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                  {totalDebt.toFixed(2) < -1e-5 ? (
                    <ExpenseTotalCard
                      title="Total Amount You Lent:"
                      content={-1 * totalDebt.toFixed(2)}
                    />
                  ) : (
                    <ExpenseTotalCard
                      title="Total Amount You Owe:"
                      content={totalDebt.toFixed(2)}
                    />
                  )}
                </Grid>
                {parsedDebts.map((debt, index) => (
                  <Grid item xs={12} key={index}>
                    {Math.abs(debt.balance) > 1e-5 && (
                      <DebtCard
                        title={
                          people.length > 0 &&
                          people.find((p) => p.id === debt.targetId) &&
                          people.find((p) => p.id === debt.targetId).name
                        }
                        content={debt.balance}
                      />
                    )}
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

export default ExpenseCard;
