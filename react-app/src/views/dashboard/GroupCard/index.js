import { Grid } from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

// project imports
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import NewGroupButton from "./NewGroupButton";
import {
  fetchAllGroups,
  selectAllGroups,
  selectSearchGroups,
} from "store/groupSlice";
import SingleGroup from "./SingleGroup";
import Pagination from "@mui/material/Pagination";

// ==============================|| TYPOGRAPHY ||============================== //
const OnePage = (props) => {
  const disPlayGroups = props.groups.slice(
    (props.page - 1) * 9,
    props.page * 9
  );

  return (
    <>
      {disPlayGroups.map((group) => (
        <SingleGroup key={group._id} group={group} />
      ))}
    </>
  );
};

const GroupCard = () => {
  const curUser = useSelector((state) => state.users.currentUser);
  const dispatch = useDispatch();
  const groupStatus = useSelector((state) => state.groups.status);
  const groupSearched = useSelector(selectSearchGroups);
  const groups = useSelector(selectAllGroups);
  const [page, setPage] = useState(1);

  const pageCount = useMemo(() => Math.ceil(groups.length / 9), [groups]);

  useEffect(() => {
    if (groupStatus === "idle") {
      dispatch(fetchAllGroups());
    }
  }, [groupStatus, dispatch]);

  useEffect(() => {
    setPage(1);
  }, [groupSearched]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <MainCard title="Travel Groups" secondary={curUser && <NewGroupButton />}>
      <Grid container spacing={gridSpacing}>
        <OnePage
          page={page}
          groups={groupSearched.length !== 0 ? groupSearched : groups}
        />
        <Grid
          item
          xs={12}
          sx={{
            mt: "10px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            count={
              groupSearched.length !== 0
                ? Math.ceil(groupSearched.length / 9)
                : pageCount
            }
            page={page}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default GroupCard;
