import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// material-ui
import { ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {
    Dialog, DialogTitle, DialogContent,
    DialogActions, Button, DialogContentText,
    FormControl, InputLabel, Select, FormHelperText,
    MenuItem
} from '@mui/material';

import { getUser } from "api/user";

import { selectUserProfile } from 'store/userSlice';
import { removeChannelMember, selectAllChannels } from 'store/channelSlice';


const RemoveChannelMember = (props) => {
    const item = props.item

    const dispatch = useDispatch();
    const curPageParams = useParams();
    const customization = useSelector((state) => state.customization);
    const [openRemove, setOpenRemove] = useState(false);
    const [selectUser, setSelectUser] = useState("");
    const curUser = useSelector(selectUserProfile);

    const channelList = useSelector(selectAllChannels);
    const curChannel = channelList.find((cur) => cur._id === curPageParams.channelid);
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
                // console.log("p", people); // array of user objects
            })
            .catch((error) => {
                console.error(`Error retrieving users: ${error}`);
            });
    }, []);


    const handleRemoveOpen = () => {
        setOpenRemove(true);
    };

    const handleRemoveClose = () => {
        setOpenRemove(false);
    };

    const handleRemove = () => {
        dispatch(removeChannelMember({ channelId: curPageParams.channelid, userId: selectUser }))
        handleRemoveClose();
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
                            Remove Member
                        </Typography>
                    }
                    onClick={handleRemoveOpen}
                >
                </ListItemText>
            </ListItemButton>

            <Dialog open={openRemove} onClose={handleRemoveClose}>
                <DialogTitle>Select Member to Remove</DialogTitle>
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
                        <FormHelperText>Please select one user you want to remove from the current channel.</FormHelperText>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRemoveClose}>Cancel</Button>
                    <Button onClick={handleRemove}>Confirm</Button>
                </DialogActions>
            </Dialog>

        </>
    )

}

export default RemoveChannelMember;


