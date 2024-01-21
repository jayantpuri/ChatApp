import React from "react";
import Header from "../components/Header.component";
import MainChat from "../components/MainChat.component";
import ChatList from "../components/ChatList.component";
import { Box } from "@chakra-ui/react";

const ChatsPage = () => {
  return (
    <div>
      <Header />
      <Box display='flex' width='100%' mt='2vh' height='90vh'>
        <ChatList />
        <MainChat />
      </Box>
    </div>
  );
};

export default ChatsPage;
