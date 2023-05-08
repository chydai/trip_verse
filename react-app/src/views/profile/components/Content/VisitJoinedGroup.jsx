import { Grid } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { fetchMyOwnedGroups } from 'api/group'
import { fetchUserGroups } from 'store/groupSlice';

import { useParams } from 'react-router';
import VisitSingleGroup from './VisitSingleGroup';

const VisitJoinedGroup = () => {
    const curParams = useParams();
    const visitUserId = curParams.userid;
    const dispatch = useDispatch();
    const [myOwned, setMyOwned] = useState([])
    const [onlyJoined, setOnlyJoined] = useState([])

    useEffect(() => {
        fetchMyOwnedGroups(visitUserId)
        .then((response) => {
          setMyOwned(response.data);
          return response.data; // Return myOwned to use it in the next `then` block
        })
        .then((myOwned) => {
          return dispatch(fetchUserGroups(visitUserId))
            .then((response) => {
              const onlyJoined = response.payload.filter((e1) => !myOwned.some((group) => group._id === e1._id));
              setOnlyJoined(onlyJoined);
            });
        })
        .catch((error) => {
          console.error(`Error retrieving groups: ${error}`);
        });
    }, [visitUserId, dispatch])



    return (
            <Grid templateColumns='repeat(3, 1fr)' gap={3}>
                {onlyJoined.map((group) => (<VisitSingleGroup key={group._id} group={group} />))}
            </Grid>
    );
};

export default VisitJoinedGroup;
