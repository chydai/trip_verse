import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// material-ui
import { List, ListItemButton, ListItemIcon, ListItemText, Typography, Avatar, Collapse, ListItemAvatar } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { IconChevronDown, IconChevronUp } from '@tabler/icons';

import CloseIcon from '@mui/icons-material/Close';
import { menuOpen } from 'store/customizationSlice';

import { selectAllChannels } from "store/channelSlice";
import { getUser } from "api/user";

import { useTheme } from '@mui/material/styles';


const Members = (props) => {
    const item = props.item

    const dispatch = useDispatch();
    const theme = useTheme();
    const navigate = useNavigate();

    const curPageParams = useParams();
    const customization = useSelector((state) => state.customization);

    const [open, setOpen] = useState(false);

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
                    avatarUrl: user.avatarUrl
                }));
                setPeople(people);
            })
            .catch((error) => {
                console.error(`Error retrieving users: ${error}`);
            });
    }, [curChannel]);

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
                onClick={() => setOpen(!open)}
            // selected={customization.isOpen.findIndex((id) => id === item.id) > -1}
            >
                <ListItemIcon sx={{ my: 'auto', minWidth: !item?.icon ? 18 : 36 }}>{itemIcon}</ListItemIcon>
                <ListItemText
                    primary={
                        <Typography variant={customization.isOpen.findIndex((id) => id === item.id) > -1 ? 'h5' : 'body1'} color="inherit">
                            Members
                        </Typography>
                    }
                />
                {open ? (
                    <IconChevronUp stroke={1.5} size="1rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                ) : (
                    <IconChevronDown stroke={1.5} size="1rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                )}
            </ListItemButton>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <List
                    component="div"
                    disablePadding
                    sx={{
                        position: 'relative',
                        '&:after': {
                            content: "''",
                            position: 'absolute',
                            left: '32px',
                            top: 0,
                            height: '100%',
                            width: '1px',
                            opacity: 1,
                            background: theme.palette.primary.light
                        }
                    }}
                >

                    {people.map((member, index) => (
                        <ListItemButton
                            key={index}
                            sx={{
                                borderRadius: `${customization.borderRadius}px`,
                                mb: 0.5,
                                alignItems: 'flex-start',
                                backgroundColor: 'inherit',
                                py: 1.25,
                                pl: `${3 * 24}px`
                            }}
                            onClick={() => { navigate(`/profile/${member.id}`) }}
                        // selected={customization.isOpen.findIndex((id) => id === item.id) > -1}
                        >
                            <ListItemAvatar sx={{
                                my: 'auto',

                            }}>
                                {
                                    member.avatarUrl ?
                                        <Avatar sx={{ maxWidth: 36, maxHeight: 36 }}
                                            alt={member.name}
                                            src={member.avatarUrl}
                                        /> :
                                        <Avatar sx={{ maxWidth: 36, maxHeight: 36 }}
                                        >{member.name[0]}</Avatar>
                                }
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant='h5' color="inherit">
                                        {member.name}
                                    </Typography>

                                }
                            // onClick={handleOpen}
                            >
                            </ListItemText>
                        </ListItemButton>
                    )
                    )}

                </List>
            </Collapse>

        </>
    )

}

export default Members


