import {
  Flex,
  Avatar,
  Heading,
  Text,
  Wrap,
  WrapItem,
  Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "api/user";
import { Link } from "react-router-dom";

function SingleFollower(props) {
  return (
    <WrapItem>
      <Link to={`/profile/${props.follower._id}`}>
        <Flex spacing="4">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar name={props.follower.name} src={props.follower.avatarUrl} />
            <Box>
              <Heading size="sm">{props.follower.name}</Heading>
              <Text>{props.follower.email}</Text>
            </Box>
          </Flex>
        </Flex>
      </Link>
    </WrapItem>
  );
}

function MyFollowing() {
  const curUser = useSelector((state) => state.users.currentUser);

  const [curFollowing, setCurFollowing] = useState([]);

  useEffect(() => {
    Promise.all(
      curUser.following.map((userId) =>
        getUser(userId)
          .then((response) => response.data)
          .catch((error) => {
            console.error(`Error retrieving user ${userId}: ${error}`);
          })
      )
    )
      .then((userObjects) => {
        const people = userObjects.map((user) => user);
        setCurFollowing(people);
      })
      .catch((error) => {
        console.error(`Error retrieving users: ${error}`);
      });
  }, [curUser]);

  return (
    curFollowing && (
      <Wrap spacing="40px">
        {/* <WrapItem> */}
        {curFollowing.map((follower) => (
          <SingleFollower follower={follower} />
        ))}
        {/* </WrapItem> */}
      </Wrap>
    )
  );
}

export default MyFollowing;
