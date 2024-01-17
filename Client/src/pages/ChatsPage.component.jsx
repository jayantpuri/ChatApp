import React from "react";
import Header from "../components/Header.component";
import MainChat from "../components/MainChat.component";
import ChatList from "../components/ChatList.component";

const ChatsPage = () => {
  return (
    <div>
      <Header />
      <ChatList />
      <MainChat />
    </div>
  );
};

export default ChatsPage;
