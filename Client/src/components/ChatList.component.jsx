import React, { useEffect, useState, useContext } from "react";
import { chatState } from "../contexts/chatContext.component";
import axios from "axios";
import { API_URL } from "../utils";
import UserList from "./userList.component";
import UserTag from "./userTag.component";
import {
  Box,
  Text,
  Spinner,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  FormControl,
  useToast,
} from "@chakra-ui/react";


const ChatList = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const {
    currentUser,
    chatsArray,
    setChatsArray,
    setCurrentChat,
    currentChat,
    fetchChats,
    setFetchChats,
  } = useContext(chatState);

  const [loggedUser, setLoggedUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [userList, setUserList] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (
      currentUser === "" ||
      currentUser === undefined ||
      currentUser === null
    ) {
      let user = localStorage.getItem("user");
      setLoggedUser(JSON.parse(user));
    } else {
      setLoggedUser(currentUser);
    }

    fetchChatList();
  }, [fetchChats, loggedUser?._id]);

  const fetchChatList = async () => {
    if (!loggedUser) return;
    setLoading(true);
    
    try {
      const { data } = await axios.get(`${API_URL}/api/chat/getAllChats`, {
        headers: { Authorization: `Bearer ${loggedUser.token}` },
      });
      setLoading(false);
      setChatsArray(data);
    } catch (error) {
      setLoading(false);
    }
  };

  const searchUser = async (query) => {
    setSearchQuery(query);
    if (query.length === 0) {
      return;
    }
    setLoading(true);

    try {
      const { data } = await axios.get(`${API_URL}/api/user/findUser`, {
        headers: {
          Authorization: `Bearer ${loggedUser.token}`,
        },
        params: { search: query },
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

  const addUserToGroup = (user) => {
    if (groupMembers.includes(user)) {
      toast({
        title: "User already in group",
        description:
          "You cannot add this user, as they are already in the group",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setGroupMembers([...groupMembers, user]);
  };

  const removeUser = (user) => {
    setGroupMembers(groupMembers.filter((member) => member._id !== user._id));
  };

  const createGroupChat = async () => {
    if (!groupName) {
      toast({
        title: "No group name",
        description: "Please enter a group name",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (groupMembers.length < 2) {
      toast({
        title: "Not enough members",
        description: "You need to add atleast 3 members to create a group chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_URL}/api/chat/createGroupChat`,
        {
          chatName: groupName,
          users: JSON.stringify(groupMembers.map((member) => member._id)),
        },
        {
          headers: {
            Authorization: `Bearer ${loggedUser.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFetchChats(!fetchChats);
      setCurrentChat(data);
      setGroupMembers([]);
      setGroupName("");
      setSearchQuery("");
      setUserList(null);
      onClose();
      toast({
        title: "New group chat created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error creating group chat",
        description: "Cannot create chat at this time",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Box
      height="100%"
      width="100%"
      display="column"
      flexDirection="column"
      alignItems="center"
      flexBasis="40%"
      bg="white"
      padding={3}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-around"
        p={3}
        width="100%"
      >
        <Text fontSize="2xl">My chats</Text>
        <Button bg="#acdbdf" color="#010101" fontSize="xl" onClick={onOpen}>
          New Group Chat +
        </Button>
      </Box>
      <Stack p={3} width="100%" height="95%" bg="#f0ece2">
        {loading === true ? (
          <Spinner />
        ) : (
          chatsArray?.map((chat) => (
            <Box
              key={chat._id}
              px={3}
              py={2}
              borderRadius="lg"
              cursor="pointer"
              mb={3}
              display="flex"
              flexDir="column"
              gap="5px"
              bg={chat === currentChat ? "#010101" : "white"}
              color={chat === currentChat ? "#acdbdf" : "##69779b"}
              onClick={() => setCurrentChat(chat)}
            >
              {chat.chatName}
              <Text fontFamily="sans-serif" fontSize="12px">
                {chat.lastMessage?.content}
              </Text>
            </Box>
          ))
        )}
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mx="auto" fontSize="3xl">
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" gap="15px">
            <FormControl>
              <Input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                type="text"
                placeholder="Add users to Group"
                value={searchQuery}
                onChange={(e) => {
                  searchUser(e.target.value);
                }}
              />
            </FormControl>
            <Box display="flex" flexWrap="wrap" gap="10px">
              {groupMembers?.map((member) => (
                <UserTag
                  key={member._id}
                  user={member}
                  removeUser={removeUser}
                />
              ))}
            </Box>
            <Box width="100%">
              {loading === false ? (
                userList
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserList
                      key={user._id}
                      user={user}
                      handleClick={addUserToGroup}
                    />
                  ))
              ) : (
                <div> Loading ...</div>
              )}
            </Box>
          </ModalBody>
          <ModalFooter>
            <FormControl>
              <Button
                _hover={{ color: "#acdbdf" }}
                bg="#010101"
                color="#f0ece2"
                onClick={createGroupChat}
              >
                Create Chat
              </Button>
            </FormControl>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ChatList;
