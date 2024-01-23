import React, { useContext } from "react";
import { chatState } from "../contexts/chatContext.component";
import ProfileModal from "./ProfileModal.component";
import GroupModal from "./groupModal.component";
import { getOtherUser } from "../utils";
import { Box, Text } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

const MainChat = () => {
  const { currentChat, currentUser } = useContext(chatState);
  console.log(currentChat.users);

  const display =  currentChat.isGroupChat ? (
    <GroupModal groupChat={currentChat} currentUser={currentUser}>
      <EditIcon boxSize={6} color="#010101" cursor="pointer" />
    </GroupModal>
  ) : ( 
    <ProfileModal user={ getOtherUser(currentChat.users, currentUser)}>
      <EditIcon boxSize={6} color="#010101" cursor="pointer" />
    </ProfileModal>
  )

  return (
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
        {currentChat!==null && display }
        
      </Box>
      <Box
        height="100%"
        bg="#69779b"
        display="flex"
        flexDir="column"
        gap="5px"
        borderRadius="lg"
      >
        {currentChat ? (
          <>the chat is Selected</>
        ) : (
          <Text margin="auto" fontSize="3xl">
            Click on a chat to start chatting
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default MainChat;
