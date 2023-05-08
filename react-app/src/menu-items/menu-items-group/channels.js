// assets
import { IconMessageChatbot, IconBrandHipchat, IconUsers, IconFriends } from '@tabler/icons';
import { useEffect } from 'react';
import { fetchJoinedChannels, selectAllChannels } from 'store/channelSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
// constant
const icons = {

    IconBrandHipchat,
    IconFriends,
    IconUsers,
    IconMessageChatbot
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const Channels = () => {
    const curGroupParams = useParams();
    const curGroup = curGroupParams.groupid;
    const dispatch = useDispatch();
    // console.log('groupcard/curUser:', curUser);
    const channelStatus = useSelector(state => state.channels.status)

    // console.log('curGroup', curGroup);

    useEffect(() => {
        // console.log('pass');
        const getJoinedChannel =  dispatch(fetchJoinedChannels(curGroup))
        if (getJoinedChannel.error) {
            console.log('error');
            console.log(getJoinedChannel.error)
        }
    }, [curGroup, dispatch])


    const channels = useSelector(selectAllChannels);

    // useEffect(() => {
    //    console.log('re-rendering...')
    // }, [channels, dispatch])

    // console.log('This is Channels', channels);
    const res = {
        id: 'Channels',
        title: 'Channels',
        // caption: 'Travel Channels',
        type: 'group',
        children: []
    }
    channels.map(item => {
        res.children.push({
            id: item._id,
            title: item.name,
            type: 'channel',
            url: `/${curGroup}/channels/${item._id}`,
            icon: icons.IconBrandHipchat
        })
    });
    return res;
}



export default Channels;
