import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// material-ui
import { Snackbar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { deleteChannel, editChannel, fetchJoinedChannels, selectAllChannels } from 'store/channelSlice';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CloseIcon from '@mui/icons-material/Close';
import { menuOpen } from 'store/customizationSlice';


const GetChannelId = (props) => {
    const item = props.item
    const [open, setOpen] = useState(false);

    const curPageParams = useParams();
    const customization = useSelector((state) => state.customization);

    const handleOpen = () => {
        navigator.clipboard.writeText(curPageParams.channelid);
        setOpen(true);
    };

    const handleClose = () => {
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
                            Get Channel ID
                        </Typography>

                    }
                    onClick={handleOpen}
                >
                </ListItemText>
            </ListItemButton>

            <Snackbar
                open={open}
                onClose={handleClose}
                message="Channel ID copied to clipboard"
                action={
                    <IconButton size="small" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />

        </>
    )

}

export default GetChannelId