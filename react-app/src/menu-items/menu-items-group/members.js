// assets
import {
  IconMessageChatbot,
  IconBrandHipchat,
  IconUsers,
  IconFriends,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { selectAllGroups } from "store/groupSlice";
import { getUser } from "api/user";
import { fetchCurGroup } from "api/group";
import SettingsIcon from "@mui/icons-material/Settings";

// constant
const icons = {
  SettingsIcon,
  IconBrandHipchat,
  IconFriends,
  IconUsers,
  IconMessageChatbot,
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const Members = () => {
  const curPageParams = useParams();
  const groupList = useSelector(selectAllGroups);
  const [people, setPeople] = useState([]);
  const [curGroup, setCurGroup] = useState(null);

  useEffect(() => {
    fetchCurGroup(curPageParams.groupid)
      .then((response) => setCurGroup(response.data))
      .catch((error) => {
        console.error(
          `Error retrieving curGroup ${curPageParams.groupid}: ${error}`
        );
      });
  }, [groupList]);

  useEffect(() => {
    if (curGroup) {
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
          const people = userObjects
            .map(
              (user) =>
                user && {
                  name: user.name,
                  id: user._id,
                  avatarUrl: user.avatarUrl,
                }
            )
            .filter(Boolean);
          setPeople(people);
        })
        .catch((error) => {
          console.error(`Error retrieving users: ${error}`);
        });
    }
  }, [curGroup]);

  const res = {
    id: "Members",

    type: "group",
    children: [
      {
        id: "groupmember",
        title: "Group Members",
        type: "collapse",
        icon: icons.IconUsers,
        children: [],
      },
      {
        id: "groupmanagement",
        title: "Manage Group",
        type: "manage",
        icon: icons.SettingsIcon,
        groupObj: curGroup,
        children: [],
      },
    ],
  };
  people.map((item) => {
    res.children[0].children.push({
      id: item.name,
      title: item.name,
      type: "item",
      url: `/profile/${item.id}`,
      user: true,
      icon: item.avatarUrl,
    });
  });

  return res;
};

export default Members;
