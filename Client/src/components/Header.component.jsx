import React, { useState, useContext } from "react";
import { chatState } from "../contexts/chatContext.component";
import { useHistory } from "react-router-dom";
import UserList from "./userList.component";
import ProfileModal from "./ProfileModal.component";
import NotificationModal from "./NotificationModal.component";
import axios from "axios";
import { API_URL } from "../utils";
import { SearchIcon, BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Container,
  Box,
  Text,
  Input,
  Button,
  Tooltip,
  useToast,
  Spinner,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const history = useHistory();

  const {
    currentUser,
    setCurrentChat,
    setCurrentUser,
    setFetchChats,
    fetchChats,
    notification,
  } = useContext(chatState);

  const [userList, setUserList] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const createChat = async (user) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/chat/createSingleChat`,
        { chatName: user.name, userId: user._id },
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      setCurrentChat(data);
      setFetchChats(!fetchChats);
      onClose();
    } catch (error) {
      toast({
        title: "Error creating chat",
        description: "Cannot create users at this time",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const searchUser = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get(`${API_URL}/api/user/findUser`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
        params: { search: searchQuery },
      });

      setUserList(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error searching users",
        description: "Cannot fetch users at this time",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setCurrentUser("");
    history.push("/");
  };
  return (
    <Container minW="100vw" height="7vh" bg="#69779b">
      <Box
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        direction="row"
        justifyContent="space-between"
      >
        <Tooltip label="search users" hasArrow fontSize="md">
          <Button
            bg="#69779b"
            _hover={{ bg: "#69779b" }}
            onClick={onOpen}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="5px"
          >
            <SearchIcon />
            <Text fontSize="1xl" fontWeight="500" color="white">
              Search users
            </Text>
          </Button>
        </Tooltip>

        <Box>
          <Text fontSize="4xl" fontWeight="500" color="white">
            Talk-A-Tive
          </Text>
        </Box>
        <Box display="flex" alignItems="center" gap="15px">
          <NotificationModal notifications={notification}>
            <BellIcon boxSize={8} />
          </NotificationModal>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                src={currentUser?.picture}
                size="sm"
                cursor="pointer"
                name={currentUser?.name}
                bg="none"
                color="#69779b"
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={currentUser}>
                <MenuItem>Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      <Drawer
        bg="#f0ece2"
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent color="#010101" bg="#f0ece2">
          <DrawerCloseButton />
          <DrawerHeader margin="auto">Search users</DrawerHeader>

          <DrawerBody>
            <Box width="100%" display="flex" gap="10px">
              <Input
                placeholder="Search by name or email"
                type="text"
                value={searchQuery}
                name="searchUsers"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={() => {
                  searchUser();
                }}
              >
                Search
              </Button>
            </Box>

            {loading === true ? (
              <Spinner />
            ) : (
              userList?.map((user) => (
                <UserList key={user._id} user={user} handleClick={createChat} />
              ))
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Container>
  );
};

export default Header;
