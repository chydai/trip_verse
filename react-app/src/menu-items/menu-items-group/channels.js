// assets
import {
  IconMessageChatbot,
  IconBrandHipchat,
  IconUsers,
  IconFriends,
} from "@tabler/icons";
import { useEffect } from "react";
import { fetchJoinedChannels, selectAllChannels } from "store/channelSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
// constant
const icons = {
  IconBrandHipchat,
  IconFriends,
  IconUsers,
  IconMessageChatbot,
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const Channels = () => {
  const curGroupParams = useParams();
  const curGroup = curGroupParams.groupid;
  const dispatch = useDispatch();

  useEffect(() => {
    const getJoinedChannel = dispatch(fetchJoinedChannels(curGroup));
    if (getJoinedChannel.error) {
      console.error(getJoinedChannel.error);
    }
  }, [curGroup, dispatch]);

  const channels = useSelector(selectAllChannels);

  const res = {
    id: "Channels",
    title: "Channels",
    type: "group",
    children: [],
  };
  channels.map((item) => {
    res.children.push({
      id: item._id,
      title: item.name,
      type: "channel",
      url: `/${curGroup}/channels/${item._id}`,
      icon: icons.IconBrandHipchat,
    });
  });
  return res;
};

export default Channels;
