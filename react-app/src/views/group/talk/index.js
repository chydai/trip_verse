import Talk from "talkjs";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

import { selectUserProfile } from "store/userSlice";
import { selectAllChannels } from "store/channelSlice";
import { selectAllGroups } from "store/groupSlice";
import { getUser } from "api/user";

export default function MyChatComponent() {
  const chatboxEl = useRef();
  const params = useParams();

  // wait for TalkJS to load
  const [talkLoaded, markTalkLoaded] = useState(false);
  const [people, setPeople] = useState([]);

  const groupList = useSelector(selectAllGroups);
  const channelList = useSelector(selectAllChannels);
  const curUser = useSelector(selectUserProfile); // object

  const curChannel =
    params.channelid && channelList.find((cur) => cur._id === params.channelid); // object
  const curGroup = groupList.find((cur) => cur._id === params.groupid);

  useEffect(() => {
    async function getPeople(peopleId) {
      Promise.all(
        peopleId.map((userId) =>
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
          setPeople(people); // objects
        })
        .catch((error) => {
          console.error(`Error retrieving users: ${error}`);
        });
    }

    getPeople(params.channelid ? curChannel.members : curGroup.members);

    Talk.ready.then(() => markTalkLoaded(true));

    if (talkLoaded) {
      const me = new Talk.User({
        id: curUser._id,
        name: curUser.name,
        photoUrl: curUser.avatarUrl ? curUser.avatarUrl : "0",
        role: "default",
      });

      const others = people.filter((cur) => cur.id !== curUser._id);
      const otherTalkUsers = others.map(
        (user) =>
          new Talk.User({
            id: user.id,
            name: user.name,
            photoUrl: user.avatarUrl ? user.avatarUrl : "0",
            role: "default",
          })
      );

      const session = new Talk.Session({
        appId: "tkfCSC7b",
        me: me,
      });

      const conversation = session.getOrCreateConversation(params.channelid ? params.channelid : params.groupid);
      conversation.setParticipant(me);
      for(let i = 0; i < otherTalkUsers.length; i++)
        conversation.setParticipant(otherTalkUsers[i]);

      const chatbox = session.createChatbox();
      chatbox.select(conversation);
      chatbox.mount(chatboxEl.current);

      return () => session.destroy();
    }
  }, [talkLoaded, curChannel, curGroup, params]);

  return <div style={{ height: "100%" }} ref={chatboxEl} />;
}
