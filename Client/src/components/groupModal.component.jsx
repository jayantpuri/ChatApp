import React, { useState, useContext } from "react";
import { chatState } from "../contexts/chatContext.component";
import UserTag from "./userTag.component";
import UserList from "./userList.component";
import axios from "axios";
import { API_URL } from "../utils";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  InputRightAddon,
  InputGroup,
  FormControl,
  useDisclosure,
  useToast,
  Spinner,
  Box,
} from "@chakra-ui/react";

const GroupModal = ({ groupChat, currentUser, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { setFetchChats, fetchChats } = useContext(chatState);

  const [chatName, setChatName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState(null);

  const updateGroupName = async () => {
    setLoading(true);
    if (chatName.length === 0) {
      toast({
        title: "Chat name cannot be empty",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    try {
      await axios.put(
        `${API_URL}/api/chat/renameGroup`,
        {
          groupName: chatName,
          chatId: groupChat._id,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      setFetchChats(!fetchChats);
      setChatName("");
    } catch (error) {
      toast({
        title: "Error updating name",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  const removeMember = (user) => {
    if (currentUser._id !== groupChat.groupAdmin._id) {
      toast({
        title: "Only admin can remove group members",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    console.log("to be implemnted");
  };

  const searchUser = async (query) => {
    setSearchQuery(query);
    if (query.length === 0) {
      return;
    }

    try {
      const { data } = await axios.get(`${API_URL}/api/user/findUser`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
        params: { search: query },
      });

      setUserList(data);
    } catch (error) {
      toast({
        title: "Error searching users",
        description: "Cannot fetch users at this time",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const addUser = async (user) => {
    if (groupChat.users.find((groupMember) => groupMember._id === user._id)) {
      toast({
        title: "User already in group",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      await axios.put(
        `${API_URL}/api/chat/addUser`,
        {
          user: user,
          chatId: groupChat._id,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      onClose();
      setFetchChats(!fetchChats);
    } catch (error) {}
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mx="auto" letterSpacing="wider">
            {groupChat && groupChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" gap="15px">
            <Box display="flex" flexWrap="wrap" gap="10px">
              {groupChat.users.map((groupMember) => (
                <UserTag
                  key={groupMember._id}
                  user={groupMember}
                  removeUser={removeMember}
                />
              ))}
            </Box>
            <FormControl>
              <InputGroup>
                <Input
                  type="text"
                  placeholder="Chat Name"
                  name="updateName"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                />
                <InputRightAddon
                  cursor="pointer"
                  bg="#acdbdf"
                  color="#010101"
                  onClick={updateGroupName}
                >
                  {loading ? <Spinner size="sm" /> : "update"}
                </InputRightAddon>
              </InputGroup>
            </FormControl>

            <FormControl>
              <Input
                type="text"
                placeholder="Add User"
                name="updateName"
                value={searchQuery}
                onChange={(e) => searchUser(e.target.value)}
              />
            </FormControl>
            <Box width="100%">
              {userList?.slice(0, 4).map((user) => (
                <UserList key={user._id} user={user} handleClick={addUser} />
              ))}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              _hover={{ color: "#acdbdf" }}
              bg="#010101"
              color="#f0ece2"
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupModal;
