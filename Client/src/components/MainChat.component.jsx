import React, { useContext, useState, useEffect } from "react";
import { chatState } from "../contexts/chatContext.component";
import ProfileModal from "./ProfileModal.component";
import GroupModal from "./groupModal.component";
import Messages from "./messages.component";
import { getOtherUser } from "../utils";
import { API_URL } from "../utils";
import axios from "axios";
import {
  Box,
  Spinner,
  Text,
  useToast,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

const MainChat = () => {
  const toast = useToast();
  const { currentChat, currentUser } = useContext(chatState);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendMessageloading, setSendMessageLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [currentChat?._id]);

  const display = currentChat?.isGroupChat ? (
    <GroupModal groupChat={currentChat} currentUser={currentUser}>
      <EditIcon boxSize={6} color="#010101" cursor="pointer" />
    </GroupModal>
  ) : (
    <ProfileModal user={getOtherUser(currentChat?.users, currentUser)}>
      <EditIcon boxSize={6} color="#010101" cursor="pointer" />
    </ProfileModal>
  );

  const fetchMessages = async () => {
    if (currentChat === null) {
      return;
    }
    setMessageLoading(true);
    console.log("selected chat", currentChat._id);

    try {
      const { data } = await axios.get(
        `${API_URL}/api/message/getAllMessages/${currentChat._id}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessageLoading(false);
      setMessages(data);
    } catch (error) {
      toast({
        title: "Error fetching messages",
        description: "Cannot fetch messages at this time",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setMessageLoading(false);
    }
  };

  const sendMessage = async (e) => {
    if (newMessage === "" || e.key !== "Enter") {
      return;
    }
    setSendMessageLoading(true);

    try {
      setNewMessage("")
      const { data } = await axios.post(
        `${API_URL}/api/message/sendMessage`,
        { message: newMessage, chatId: currentChat._id },
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );
      console.log(data);
      setMessages([...messages, data]);
      setSendMessageLoading(false);
    } catch (error) {
      toast({
        title: "cannot send a message at this time",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setSendMessageLoading(false);
    }
  };

  const load = <Spinner size="xl" color="white" />;

  const content = (
    <Box
      width="100%"
      height="100%"
      borderRadius="lg"
      borderWidth="1px"
      padding={3}
      display="flex"
      flexDir="column"
      justifyContent="center"
      bg="#ffffff"
    >
      <Box
        padding="0 5px"
        mb={2}
        letterSpacing="widest"
        display="flex"
        justifyContent="space-between"
      >
        <Text fontSize="3xl">{currentChat && currentChat.chatName}</Text>
        {currentChat && display}
      </Box>
      <Box
        height="100%"
        display="flex"
        flexDir="column"
        gap="5px"
        borderRadius="lg"
      >
        {currentChat ? (
          <Box
          borderRadius="lg"
            height="100%"
            display="flex"
            justifyContent="flex-end"
            overflowY="hidden"
            bg="#474f63"
            flexDir="column"
          >
            {messageLoading ? (
              <Spinner size={"lg"} />
            ) : (
              <Messages messages={messages} currenUser={currentUser} />
            )}
            <FormControl p={2} onKeyDown={sendMessage} isRequired mt={3} mb={2}>
              <Input
                type="text"
                variant="flush"
                size='lg'
                bg="#010101"
                placeholder="Type your message here"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                _focus={{bg: "#f0ece2"}}
              />
            </FormControl>
          </Box>
        ) : (
          <Text margin="auto" fontSize="3xl">
            Click on a chat to start chatting
          </Text>
        )}
      </Box>
    </Box>
  );

  if (!currentUser && !currentChat) {
    return load;
  } else {
    return content;
  }
};

export default MainChat;
