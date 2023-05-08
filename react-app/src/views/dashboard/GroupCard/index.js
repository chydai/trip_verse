import { Grid, Link, Typography } from '@mui/material';
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import NewGroupButton from './NewGroupButton';
import { fetchAllGroups, selectAllGroups, selectSearchGroups, fetchRandomGroups } from 'store/groupSlice';
import SingleGroup from './SingleGroup';
import Pagination from '@mui/material/Pagination';

// ==============================|| TYPOGRAPHY ||============================== //
const OnePage = (props) => {

    const disPlayGroups = props.groups.slice((props.page-1)*9, props.page*9)

    return (
        <>
        {disPlayGroups.map((group) => (<SingleGroup key={group._id} group={group}/>))}
        </>
         
    )
}

const GroupCard = () => {
    // const longword = 'Lorem ipsum dolor sit amet, cua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    const curUser = useSelector((state) => state.users.currentUser);
    const dispatch = useDispatch();
    // console.log('groupcard/curUser:', curUser);
    const groupStatus = useSelector(state => state.groups.status)
    const groupSearched = useSelector(selectSearchGroups)
    const groups = useSelector(selectAllGroups);
    const [page, setPage] = useState(1);
    // const [pageCount, setPageCount] = useState(1)

    const pageCount = useMemo(() => Math.ceil(groups.length / 9), [groups]);

    useEffect(() => {
        // console.log('groupstat',groupStatus)
        if (groupStatus === 'idle') {
            dispatch(fetchAllGroups())
                // .then((response) => {
                //     setPageCount(Math.ceil((response.payload.length) / 9))
                // })
            // dispatch(fetchRandomGroups())
        }
    }, [groupStatus, dispatch])

    useEffect(() => {
       setPage(1);
    }, [groupSearched])

    // console.log(pageCount)
    // console.log(groups.length)
    // console.log( Math.ceil((groups.length)/9))
    const handleChange = (event, value) => {
        setPage(value);
    };

    return (
        <MainCard title="Travel Groups" secondary={curUser && <NewGroupButton />} >
            <Grid container spacing={gridSpacing}
            >
                {/* {groupSearched.length === 0 ? groups.map((group) => (<SingleGroup key={group._id} group={group} />)) :
                    groupSearched.map((group) => (<SingleGroup key={group._id} group={group} />))} */}
                {/* {groups.map((group) => (<SingleGroup key={group._id} group={group}/>))} */}

                <OnePage page={page} groups={groupSearched.length !== 0 ? groupSearched : groups} />
                <Grid item xs={12} sx={{
                    mt: '10px', display: 'flex', justifyContent: 'center'
                }}>
                    <Pagination
                        count={groupSearched.length !== 0 ? Math.ceil(groupSearched.length / 9) : pageCount}
                        page={page}
                        onChange={handleChange} />
                </Grid>
            </Grid>
        </MainCard>
    );
}

export default GroupCard;
