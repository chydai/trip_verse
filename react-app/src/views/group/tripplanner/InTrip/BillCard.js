// add bill and show bill
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemAvatar,
} from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  fetchBillsByDatePlan,
  selectAllBillsByDatePlan,
} from "store/billSlice";
import { useEffect, useState } from "react";
import { selectUserProfile } from "store/userSlice";
import { getUser } from "api/user";
import { selectAllChannels } from "store/channelSlice";

import BillUpdate from "./BillUpdate";

function OneBill(props) {
  const item = props.item;
  const theme = props.theme;
  const [openEdit, setOpenEdit] = useState(false);

  const handleClickEdit = () => {
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  return (
    <>
      <ListItem
        button
        onClick={handleClickEdit}
        secondaryAction={
          <>
            {item.borrowed ? (
              <>
                <Typography color={theme.palette.error.dark}>
                  You Borrowed
                </Typography>
                <Typography
                  color={theme.palette.error.dark}
                  variant="h4"
                  sx={{ textAlign: "right" }}
                >
                  {"$ " + item.number}
                </Typography>
              </>
            ) : (
              <Box>
                <Typography color={theme.palette.success.dark}>
                  You Lent
                </Typography>
                <Typography
                  color={theme.palette.success.dark}
                  variant="h4"
                  sx={{ textAlign: "right" }}
                >
                  {"$ " + item.number}
                </Typography>
              </Box>
            )}
          </>
        }
      >
        <ListItemAvatar>
          <Avatar>
            <PaymentsIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={item.activity} secondary={item.owner} />
      </ListItem>
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogContent>
          <BillUpdate
            onClick={handleCloseEdit}
            description={item.activity}
            amount={parseFloat(item.amount)}
            datePlanID={props.datePlanID}
            bill={props.bill}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

const BillCard = (props) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const params = useParams();

  const channelList = useSelector(selectAllChannels);
  const curChannel = channelList.find((cur) => cur._id === params.channelid);

  const [people, setPeople] = useState([]);
  const [allBills, setAllBills] = useState([]);

  const curUser = useSelector(selectUserProfile);
  const billByDate = useSelector(selectAllBillsByDatePlan);
  const billStatus = useSelector((state) => state.bill.status);

  useEffect(() => {
    if (props.datePlanID && people.length > 0) {
      dispatch(fetchBillsByDatePlan(props.datePlanID)).then((newPlan) => {
        setAllBills(
          newPlan.payload.map((bill, index) => {
            const billObj = { activity: bill.description };
            if (bill.payer === curUser._id) {
              billObj.borrowed = false;
              billObj.number = String(
                bill.debt.reduce(
                  (accumulator, current) => accumulator + current.balance,
                  0
                )
              );
              billObj.amount = bill.amount;
              billObj.owner = curUser.name + " paid $" + String(bill.amount);
            } else {
              billObj.borrowed = true;
              billObj.number = String(
                bill.debt.find((u) => u.user === curUser._id).balance
              );
              billObj.owner =
                people.find((u) => u.id === bill.payer).name +
                " paid $" +
                String(bill.amount);
            }
            return billObj;
          })
        );
      });
    }
  }, [billStatus, props.datePlanID, people, dispatch]);

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
        Expense Track
      </Typography>

      <List>
        {allBills.map((item, index) => {
          if (billByDate[index]) {
            return (
              <OneBill
                key={index}
                item={item}
                theme={theme}
                datePlanID={props.datePlanID}
                bill={billByDate[index]}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};

export default BillCard;
