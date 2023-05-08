import { Grid } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { fetchMyOwnedGroups } from "api/group";

import { useParams } from "react-router";
import VisitSingleGroup from "./VisitSingleGroup";

const VisitOwnedGroup = () => {
  const curParams = useParams();
  const visitUserId = curParams.userid;
  const dispatch = useDispatch();
  const [myOwned, setMyOwned] = useState([]);

  useEffect(() => {
    fetchMyOwnedGroups(visitUserId).then((response) => {
      setMyOwned(response.data);
    });
  }, [visitUserId, dispatch]);

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={3}>
      {myOwned.map((group) => (
        <VisitSingleGroup key={group._id} group={group} />
      ))}
    </Grid>
  );
};

export default VisitOwnedGroup;
