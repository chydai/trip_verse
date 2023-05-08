import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import {
    Avatar,
    Card,
    CardContent,
    Grid,
    LinearProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
    linearProgressClasses
} from '@mui/material';
import { Button, Box } from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import { purple } from '@mui/material/colors';

// import { addNewGroup } from 'store/groupSlice.js';
// assets
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import { joinNewChannel } from 'store/channelSlice';
import { useParams } from 'react-router';

const CardStyle = styled(Card)(({ theme }) => ({
    // background: theme.palette.orange.light,
    background:'#f0ecfc',
    marginBottom: '22px',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: '137px',
        height: '137px',
        background: '#834bff',
        borderRadius: '50%',
        top: '-105px',
        right: '-96px'
    }
}));

// ==============================|| PROGRESS BAR WITH LABEL ||============================== //

// ==============================|| SIDEBAR MENU Card ||============================== //

const SearchChannel = () => {
    const theme = useTheme();
    const [channelName, setChannelName] = useState('');
    const [addRequestStatus, setAddRequestStatus] = useState('idle');
    const curGroup = useParams();
    // const curGroup = useSelector((state) => state.groups.groupslist[0]);
    // console.log('current Group: ', curGroup._id);
    const dispatch = useDispatch();

    const handleSaveClose = async () => {
        try {
            setAddRequestStatus('pending');
            await dispatch(joinNewChannel(channelName)).unwrap()
            setChannelName('');
        } catch (err) {
            console.error('Failed to find channel ', err);
        } finally {
            setAddRequestStatus('idle');
        }
    };
    return (
        <CardStyle>
            <CardContent sx={{ p: 2 }}>
                <List sx={{ p: 0, m: 0 }}>
                    <ListItem alignItems="flex-start" disableGutters sx={{ p: 0 }}>
                        <ListItemAvatar sx={{ mt: 0 }} >
                            <Avatar
                                variant="rounded"
                                sx={{
                                    ...theme.typography.commonAvatar,
                                    ...theme.typography.largeAvatar,
                                    // color: theme.palette.orange.main,
                                    color: '#834bff',

                                    border: 'none',
                                    // borderColor: theme.palette.orange.main,
                                    borderColor: '#c29fff',
                                    background: '#fff',
                                    marginRight: '12px'
                                }}
                            >
                                <CoPresentIcon onClick={handleSaveClose} fontSize="inherit" />
                            </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                            sx={{ mt: 0 }}
                            primary={
                                <TextField
        
                                label="Join New Channel" variant='outlined' 
                                placeholder="Channel ID"
                                onChange={(e) => setChannelName(e.target.value)}
                                >

                                </TextField>}

                            // secondary={
                                

                            // }
                            
                        />
                    </ListItem>
                </List>
            </CardContent>
        </CardStyle>
    );
};

export default SearchChannel;
