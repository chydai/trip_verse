import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
// material-ui
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { editChannel, selectAllChannels } from 'store/channelSlice';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';



const EditChannel = (props) => {
    const item = props.item
    const [open, setOpen] = useState(false);
    const [channelName, setChannelName] = useState(props.item.title);

    const curPageParams = useParams();
    const customization = useSelector((state) => state.customization);
    const dispatch = useDispatch();

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSaveClose = async () => {
        // console.log(curPageParams)
        const updatedChannel = { _id: curPageParams.channelid, name:channelName};

        try {
            await dispatch(editChannel(updatedChannel)).unwrap()
        } catch (err) {
            console.error('Failed to update Channel Name: ', err);
        } 
        setOpen(false);
    };

    const level = 2;
    const itemIcon =( 
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
                        Edit Channel
                    </Typography>
                }
                onClick={handleOpen}
            >
            </ListItemText>
            </ListItemButton>

            <Dialog open={open} onClose={handleClose}>
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
            </Dialog>

        </>
    )

}

export default EditChannel