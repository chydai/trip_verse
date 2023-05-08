import {
  GridItem,
  Box,
  Flex,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Card,
  CardBody,
  Stack,
  Heading,
  Divider,
  CardFooter,
  CardHeader,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GroupIcon from "@mui/icons-material/Group";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import React, { useMemo, useState } from "react";

import { joinGroup, exitGroup } from "store/groupSlice";

const VisitSingleGroup = (props) => {
  const initialGroup = props.group;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((store) => store.users);

  const [group, updateGroup] = useState(initialGroup);
  const [showAlert, setShowAlert] = useState(-1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isGroupMember = useMemo(
    () => group?.members?.includes(user?.currentUser?._id),
    [user, group]
  );

  const isGroupOwner = useMemo(
    () => user?.currentUser?._id === group?.userId,
    [user, group]
  );

  const handleClickItem = (event, route = "") => {
    navigate(route);
  };

  const handleJoinClick = async () => {
    const res = await dispatch(joinGroup(group._id));
    setShowAlert(1);
    if (res?.payload) {
      updateGroup(res.payload);
    }
  };

  const handleExitClick = async () => {
    const res = await dispatch(exitGroup(group._id));
    setShowAlert(2);
    if (res?.payload) {
      updateGroup(res.payload);
    }
  };

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <GridItem colSpan={1}>
      <Card maxW="sm">
        <CardHeader>
          <Flex spacing="4">
            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              <Box>
                <Heading size="sm">{group.name}</Heading>
              </Box>
            </Flex>
            <Menu isOpen={isMenuOpen} onClose={handleMenuClose}>
              <MenuButton
                as={IconButton}
                variant="ghost"
                colorScheme="gray"
                aria-label="See menu"
                icon={<MoreVertIcon />}
                size="md"
                onClick={handleMenuOpen}
              />
              <MenuList>
                {!isGroupMember ? (
                  <MenuItem onClick={handleJoinClick}>Join Group</MenuItem>
                ) : isGroupOwner ? (
                  <>
                    <MenuItem
                      onClick={(event) =>
                        handleClickItem(event, `/group-page/${group._id}`)
                      }
                    >
                      View Group
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={handleExitClick}>Exit Group</MenuItem>
                    <MenuItem
                      onClick={(event) =>
                        handleClickItem(event, `/group-page/${group._id}`)
                      }
                    >
                      View Group
                    </MenuItem>
                  </>
                )}
              </MenuList>
            </Menu>
          </Flex>
        </CardHeader>
        <CardBody>
          <Image
            src={group.imgUrl ? group.imgUrl : "https://picsum.photos/400/300"}
            alt="Boston"
            borderRadius="lg"
          />
          <Stack mt="6" spacing="3">
            <Text>{group.description}</Text>

            {showAlert === 1 && (
              <Alert status="success">
                <AlertIcon />
                You successfully joined this group!
              </Alert>
            )}

            {showAlert === 2 && (
              <Alert status="success">
                <AlertIcon />
                You successfully exited this group!
              </Alert>
            )}
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <Flex justify="space-between" mt={4}>
            <Flex alignItems="center" mr={4}>
              <FavoriteIcon mr={4} variant="ghost" />
              <Text fontSize="md">{group.likes.length}</Text>
            </Flex>

            <Flex alignItems="center">
              <GroupIcon mr={4} variant="ghost" />
              <Text fontSize="md">{group.members.length}</Text>
            </Flex>
          </Flex>
        </CardFooter>
      </Card>
    </GridItem>
  );
};

export default VisitSingleGroup;
