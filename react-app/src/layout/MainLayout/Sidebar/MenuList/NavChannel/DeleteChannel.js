import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// material-ui
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { deleteChannel, editChannel, fetchJoinedChannels, selectAllChannels } from 'store/channelSlice';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import { menuOpen } from 'store/customizationSlice';


const DeleteChannel = (props) => {
    const item = props.item
    const [open, setOpen] = useState(false);

    const curPageParams = useParams();
    const customization = useSelector((state) => state.customization);
    const allChannels = useSelector((state) => state.channels.channelList);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // useEffect(() => {
    //     console.log('hello?');
    //     console.log(allChannels);
    //     if (deleted) {
    //       console.log('yocuandelete');
    //       if (allChannels.length) {
    //         dispatch(menuOpen(allChannels[0]._id));
    //         navigate(`/${curPageParams.groupid}/channels/${allChannels[0]._id}`);
    //       } else {
    //         navigate(`/group-page/${curPageParams.groupid}`);
    //       }
    //       setDeleted(false);
    //     }
    //   }, [deleted]);

    const handleSaveClose = () => {
        console.log(curPageParams);
        console.log(allChannels);
        dispatch(deleteChannel(curPageParams.channelid))
        dispatch(menuOpen('default'));
        navigate(`/group-page/${curPageParams.groupid}`);
        // console.log(allChannels)
        setOpen(false);
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
                            Delete Channel
                        </Typography>
                    }
                    onClick={handleOpen}
                >
                </ListItemText>
            </ListItemButton>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this channel?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSaveClose}>Delete</Button>
                </DialogActions>
            </Dialog>

        </>
    )

}

export default DeleteChannel