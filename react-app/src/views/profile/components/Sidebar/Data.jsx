import { Box, Text, VStack } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getUser } from "api/user";
import { useState, useEffect } from "react";
import Actions from "./Actions";
import { refreshCurUser, selectUserProfile } from "store/userSlice";

function Item(props) {
  const item = props.item;
  return (
    <Box
      key={item.id}
      as="li"
      w="full"
      py={3}
      px={5}
      d="flex"
      alignItems="center"
      justifyContent="space-between"
      borderBottomWidth={1}
      borderColor="brand.light"
    >
      <Text color="brand.dark">{item.name}</Text>
      <Text color={`brand.${item.color}`} fontWeight="bold">
        {item.value}
      </Text>
    </Box>
  );
}

function Data() {
  const curUser = useSelector(selectUserProfile);
  const curParams = useParams();
  const dispatch = useDispatch();
  const visitUserId = curParams.userid;
  const [visitUser, setVisitUser] = useState(null);
  const [updateState, setUpdateState] = useState(true);

  useEffect(() => {
    if (visitUserId !== curUser._id) {
      getUser(visitUserId)
        .then((response) => {
          setVisitUser(response.data);
        })
        .catch((error) => {
          console.error(`Error retrieving user ${error}`);
        });
    } else {
      setVisitUser(curUser);
    }
  }, [updateState, curParams, curUser]);

  const handleUpdate = () => {
    setUpdateState(!updateState);
    getUser(curUser._id)
      .then((response) => {
        dispatch(refreshCurUser(response.data));
        return response.data;
      })
      .then((user) => {
        setVisitUser(user);
      });
  };

  return (
    <>
      <VStack as="ul" spacing={0} listStyleType="none">
        {visitUser && visitUserId !== curUser._id && (
          <>
            <Item
              item={{
                id: 1,
                name: "User Name",
                value: visitUser.name,
                color: "yellow",
              }}
            />
            <Item
              item={{
                id: 2,
                name: "Follower",
                value: visitUser.followers.length,
                color: "green",
              }}
            />
            <Item
              item={{
                id: 3,
                name: "Following",
                value: visitUser.following.length,
                color: "cadet",
              }}
            />
          </>
        )}

        {visitUserId === curUser._id && (
          <>
            <Item
              item={{
                id: 1,
                name: "User Name",
                value: curUser.name,
                color: "yellow",
              }}
            />
            <Item
              item={{
                id: 2,
                name: "Follower",
                value: curUser.followers.length,
                color: "green",
              }}
            />
            <Item
              item={{
                id: 3,
                name: "Following",
                value: curUser.following.length,
                color: "cadet",
              }}
            />
          </>
        )}
      </VStack>
      <Actions setUpdate={handleUpdate} />
    </>
  );
}

export default Data;
