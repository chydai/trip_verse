import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
// material-ui
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { updateGroup } from 'store/groupSlice';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { fetchCurGroup } from 'api/group';


const EditGroup = (props) => {
    const item = props.item
    const [open, setOpen] = useState(false);

    const curPageParams = useParams();
    const customization = useSelector((state) => state.customization);
    const dispatch = useDispatch();
    const [curGroup, setCurGroup] = useState(null)
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [groupOrigin, setGroupOrigin] = useState("");
    const [groupDestination, setGroupDestination] = useState("");
    const [groupStartDate, setgroupStartDate] = useState('');
    const [groupEndDate, setgroupEndDate] = useState('');
    const [addRequestStatus, setAddRequestStatus] = useState('idle')
    const curUser = useSelector((state) => state.users.currentUser);

    useEffect(() => {
        fetchCurGroup(curPageParams.groupid)
            .then((response) => {
                setCurGroup(response.data)
                setgroupStartDate(response.data.startDate)
                setgroupEndDate(response.data.endDate)
                setGroupDestination(response.data.destination)
                setGroupDescription(response.data.description)
                setGroupName(response.data.name)
                setGroupOrigin(response.data.origin)
            }
            ).catch((error) => {
                console.error(`Error retrieving curGroup ${curPageParams.groupid}: ${error}`);
            })
    }, [])



    const canSave =
        [groupName, groupOrigin, groupDestination, groupStartDate, groupEndDate].every(Boolean) && addRequestStatus === 'idle'

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleSaveClose = async () => {
        const newGroup = {
            _id:curPageParams.groupid,
            userid: curUser._id,
            name: groupName,
            description: groupDescription,
            origin: groupOrigin,
            destination: groupDestination,
            startDate: groupStartDate,
            endDate: groupEndDate
        }
        console.log('this is body', newGroup);
        if (canSave) {
            try {
                setAddRequestStatus('pending')
                await dispatch(updateGroup(newGroup)).unwrap()
            } catch (err) {
                console.error('Failed to update card: ', err)
            } finally {
                setAddRequestStatus('idle')
            }
        }
        setOpen(false)
    };


    const level = 2;
    const itemIcon = (
        <FiberManualRecordIcon
            sx={{
                width: customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
                height: customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6
            }}
            fontSize={level > 0 ? 'inherit' : 'medium'}
        />
    );

    return (
        <>
            <ListItemButton
                disabled={item.disabled}
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
                <ListItemIcon sx={{ my: 'auto', minWidth: !item?.icon ? 18 : 36 }}>{itemIcon}</ListItemIcon>
                <ListItemText
                    primary={
                        <Typography variant='h5' color="inherit">
                            Edit Group
                        </Typography>
                    }
                    onClick={handleOpen}
                >
                </ListItemText>
            </ListItemButton>

            {/* <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Change Channel Name</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Channel  Name"
                        defaultValue={channelName}
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setChannelName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSaveClose}>Save</Button>
                </DialogActions>
            </Dialog> */}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Group Information</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Group Name"
                        defaultValue={groupName}
                        fullWidth
                        variant="outlined"
                        onChange={e => setGroupName(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Group Description"
                        defaultValue={groupDescription}
                        fullWidth
                        variant="outlined"
                        onChange={e => setGroupDescription(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Where to GO?"
                        defaultValue={groupDestination}
                        fullWidth
                        variant="outlined"
                        onChange={e => setGroupDestination(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Where to Departure?"
                        defaultValue={groupOrigin}
                        fullWidth
                        variant="outlined"
                        onChange={e => setGroupOrigin(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Start Date e.g. 2023-01-01"
                        defaultValue={groupStartDate}
                        fullWidth
                        variant="outlined"
                        placeholder='Ex:2023-01-01"'
                        onChange={(e) => setgroupStartDate(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="End Date"
                        defaultValue={groupEndDate}
                        fullWidth
                        variant="outlined"
                        placeholder='Ex:2023-01-01"'
                        onChange={(e) => setgroupEndDate(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSaveClose}>Save</Button>
                </DialogActions>
            </Dialog>

        </>
    )

}

export default EditGroup