import React, { useContext, useState, useEffect } from "react";
import { chatState } from "../contexts/chatContext.component";
import ProfileModal from "./ProfileModal.component";
import GroupModal from "./groupModal.component";
import Messages from "./messages.component";
import { getOtherUser } from "../utils";
import { API_URL } from "../utils";
import axios from "axios";
import io from "socket.io-client";
import {
  Box,
  Spinner,
  Text,
  useToast,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

let socket;

const MainChat = () => {
  const toast = useToast();
  const { currentChat, currentUser, setNotification, notification } =
    useContext(chatState);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendMessageloading, setSendMessageLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    socket = io(API_URL);
    if (currentUser) {
      socket.emit("create user room", currentUser);
    }
    socket.on("connected", () => {
      setSocketConnected(true);
    });
  }, [currentUser?._id]);

  useEffect(() => {
    currentChat && socket.emit("join chat", currentChat);
    fetchMessages();
  }, [currentChat?._id]);

  useEffect(() => {
    socket.on("message Recieved", (mess) => {
      if (mess.chat._id === currentChat?._id) {
        setMessages([...messages, mess]);
      } else {
        setNotification([...notification, mess]);
      }
    });
  });

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
      setNewMessage("");
      const { data } = await axios.post(
        `${API_URL}/api/message/sendMessage`,
        { message: newMessage, chatId: currentChat._id },
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );
      socket.emit("new Message", data);
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
              {sendMessageloading && <Spinner />}
              <Input
                type="text"
                variant="flush"
                size="lg"
                bg="#010101"
                placeholder="Type your message here"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                _focus={{ bg: "#f0ece2" }}
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
