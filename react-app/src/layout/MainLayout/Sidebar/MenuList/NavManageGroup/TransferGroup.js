import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import MenuItem from '@mui/material/MenuItem';

import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import Typography from '@mui/material/Typography';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import {
    Dialog, DialogTitle, DialogContent,
    DialogActions, Button, DialogContentText,
    FormControl, InputLabel, Select, FormHelperText
} from '@mui/material';

import { transferGroup } from 'store/groupSlice';
import { getUser } from 'api/user';
import { selectUserProfile } from 'store/userSlice';
import { fetchCurGroup } from 'api/group';

const TransferGroup = ({item}) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const curPageParams = useParams();
    const customization = useSelector((state) => state.customization);
    const [openTransfer, setOpenTransfer] = useState(false);
    const [curGroup, setCurGroup] = useState(null);
    const [selectUser, setSelectUser] = useState("");
    const [people, setPeople] = useState([]);
    const curUser = useSelector(selectUserProfile);

    useEffect(() => {
        fetchCurGroup(curPageParams.groupid)
            .then((response) => {
                setCurGroup(response.data)
            }
            ).catch((error) => {
                console.error(`Error retrieving curGroup ${curPageParams.groupid}: ${error}`);
            })
    }, [])

    useEffect(() => {
        curGroup &&
        Promise.all(
            curGroup.members.map((userId) =>
                getUser(userId)
                    .then((response) => response.data)
                    .catch((error) => {
                        console.error(`Error retrieving user ${userId}: ${error}`);
                    })
            )
        )
            .then((userObjects) => {
                const people = userObjects.map((user) => user && { name: user.name, id: user._id }).filter(Boolean);
                setPeople(people)
                // console.log('p', people)
            })
            .catch((error) => {
                console.error(`Error retrieving users: ${error}`);
            });
    }, [curGroup])


    const handleTransferOpen = () => {
        setOpenTransfer(true);
    };

    const handleTransferClose = () => {
        setOpenTransfer(false);
    };

    const handleTransfer = () => {
        dispatch(transferGroup({ groupId: curGroup._id, userId: selectUser }))
        handleTransferClose();
    }

    const level = 2;

    return (
        <>
            <ListItemButton
                sx={{
                    borderRadius: `${customization.borderRadius}px`,
                    mb: 0.5,
                    alignItems: 'flex-start',
                    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
                    py: level > 1 ? 1 : 1.25,
                    pl: `${level * 24}px`
                }}
            // selected={customization.isOpen.findIndex((id) => id === item.id) > -1}
            >
                <ListItemIcon sx={{ my: 'auto', minWidth: !item?.icon ? 18 : 36 }}>
                    <FiberManualRecordIcon
                        sx={{
                            width: customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
                            height: customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6
                        }}
                        fontSize={level > 0 ? 'inherit' : 'medium'}
                    />
                </ListItemIcon>
                <ListItemText
                    primary={
                        <Typography variant='h5' color="inherit">
                            Transfer Group
                        </Typography>
                    }
                    onClick={handleTransferOpen}
                >
                </ListItemText>
            </ListItemButton>

            <Dialog open={openTransfer} onClose={handleTransferClose}>
                <DialogTitle>Confirm Transfer</DialogTitle>
                <DialogContent>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel >User Name</InputLabel>
                        <Select
                            value={selectUser}
                            label="selectUser"
                            onChange={(event) => setSelectUser(event.target.value)}
                        >
                            {people.map((temp, index) => {
                                if (!(temp.name === curUser.name)) {
                                    return (<MenuItem key={index} value={temp.id}>{temp.name}</MenuItem>)
                                }
                            })}
                        </Select>
                        <FormHelperText>Please select one user you want to transfer the group to.</FormHelperText>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleTransferClose}>Cancel</Button>
                    <Button onClick={handleTransfer}>Confirm</Button>
                </DialogActions>
            </Dialog>


        </>
    )
}

export default TransferGroup;