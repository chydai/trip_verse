import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import {
  Button,
  Input,
  InputGroup,
  InputRightAddon,
  useClipboard,
  VStack,
  Box,
  Flex,
} from "@chakra-ui/react";
import { useParams } from "react-router";
import { subUser, unSubUser, getUser } from "api/user";

export default function Actions(props) {
  const curParams = useParams();
  const curUser = useSelector((state) => state.users.currentUser);
  const visitUserId = curParams.userid;
  const [visitUser, setVisitUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const value = `https://home.ourtripverse.com/profile/${curParams.userid}`;
  const { hasCopied, onCopy } = useClipboard(value);

  const profileUrl = useRef(null);

  useEffect(() => {
    if (hasCopied) {
      profileUrl.current.focus();
      profileUrl.current.select();
    }
  });

  useEffect(() => {
    if (visitUserId !== curUser._id) {
      getUser(visitUserId)
        .then((response) => {
          setVisitUser(response.data);
          setIsFollowing(response.data.followers.includes(curUser._id));
        })
        .catch((error) => {
          console.error(`Error retrieving user ${error}`);
        });
    } else {
      setVisitUser(curUser);
    }
  }, [curParams]);

  const handleFollow = () => {
    subUser(visitUserId).then(() => {
      props.setUpdate();
    });
    setIsFollowing(true);
  };

  const handleUnFollow = () => {
    unSubUser(visitUserId).then(() => {
      props.setUpdate();
    });
    setIsFollowing(false);
  };

  return (
    <VStack py={8} px={5} spacing={3}>
      <InputGroup>
        <Input
          ref={profileUrl}
          type="url"
          color="brand.blue"
          value={value}
          userSelect="all"
          isReadOnly
          _focus={{ borderColor: "brand.blue" }}
        />
        <InputRightAddon bg="transparent" px={0} overflow="hidden">
          <Button onClick={onCopy} variant="link">
            <svg width="1.2em" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          </Button>
        </InputRightAddon>
      </InputGroup>
      {visitUserId !== curUser._id && (
        <Box
          key={4}
          w="full"
          py={3}
          px={5}
          d="flex"
          alignItems="center"
          justifyContent="space-between"
          borderColor="brand.light"
        >
          <Flex alignItems="center">
            {isFollowing ? (
              <Button mr={4} isDisabled>
                Following
              </Button>
            ) : (
              <Button mr={4} onClick={handleFollow}>
                Follow
              </Button>
            )}
            {isFollowing ? (
              <Button mr={4} onClick={handleUnFollow}>
                Unfollow
              </Button>
            ) : (
              <Button mr={4} isDisabled>
                Unfollow
              </Button>
            )}
          </Flex>
        </Box>
      )}
    </VStack>
  );
}
