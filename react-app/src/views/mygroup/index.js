import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// project imports
import MainCard from "ui-component/cards/MainCard";
import SubCard from "ui-component/cards/SubCard";
import { gridSpacing } from "store/constant";

import { selectUserGroups } from "store/groupSlice";
import { fetchMyOwnedGroups } from "api/group";
import { fetchUserGroups } from "store/groupSlice";

import MySingleGroup from "./MySingleGroup";

const MyGroup = () => {
  const curUser = useSelector((state) => state.users.currentUser);
  const dispatch = useDispatch();
  const [myOwned, setMyOwned] = useState([]);
  const [onlyJoined, setOnlyJoined] = useState([]);
  const groups = useSelector(selectUserGroups);
  const isUpdate = groups.length;

  useEffect(() => {
    if (curUser) {
      fetchMyOwnedGroups(curUser._id)
        .then((response) => {
          setMyOwned(response.data);
          return response.data; // Return myOwned to use it in the next `then` block
        })
        .then((myOwned) => {
          return dispatch(fetchUserGroups(curUser._id)).then((response) => {
            const onlyJoined = response.payload.filter(
              (e1) => !myOwned.some((group) => group._id === e1._id)
            );
            setOnlyJoined(onlyJoined);
          });
        })
        .catch((error) => {
          console.error(`Error retrieving groups: ${error}`);
        });
    }
  }, [isUpdate, dispatch]);

  return (
    <MainCard title="My Groups">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <SubCard title="My Joined Group">
            <Grid container spacing={gridSpacing}>
              {onlyJoined.map((group) => (
                <MySingleGroup key={group._id} group={group} join={true} />
              ))}
            </Grid>
          </SubCard>
        </Grid>
        <Grid item xs={12}>
          <SubCard title="My Owned Group">
            <Grid container spacing={gridSpacing}>
              {myOwned.map((group) => (
                <MySingleGroup key={group._id} group={group} join={false} />
              ))}
            </Grid>
          </SubCard>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default MyGroup;
