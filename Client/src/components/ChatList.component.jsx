import React, { useEffect, useState, useContext } from "react";
import { chatState } from "../contexts/chatContext.component";
import axios from "axios";
import { API_URL } from "../utils";
import { Box, Text, Spinner, Stack } from "@chakra-ui/react";

const ChatList = () => {
  const {
    currentUser,
    chatsArray,
    setChatsArray,
    setCurrentChat,
    currentChat,
    fetchChats,
  } = useContext(chatState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChatList();
  }, [fetchChats]);

  const fetchChatList = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/chat/getAllChats`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      setLoading(false);
      setChatsArray(data);
    } catch (error) {
      setLoading(false);
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
        <Text fontSize="xl">New Group Chat</Text>
      </Box>
      <Stack p={3} width='100%' height='95%' bg="#f0ece2">
        {loading ? (
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
              bg={chat === currentChat ? "#010101" : "white"}
              color={chat === currentChat? "#acdbdf" : "##69779b"}
              onClick={() => setCurrentChat(chat)}
            >
              {chat.chatName}
              {chat.lastMessage}
            </Box>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default ChatList;
