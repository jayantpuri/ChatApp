import React from "react";
import { Box, Text, Avatar } from "@chakra-ui/react";

const Messages = ({ messages, currenUser }) => {
  messages = messages.filter((mess) => mess.content);
  return (
    <Box display="flex" flexDir="column" gap={2} p={2}>

      {messages?.map((message, i, arr) => {
        let dispAvatar = false;
        if (arr[i].sender._id !== arr[i + 1]?.sender?._id) {
          dispAvatar = true;
        }
        if (message.sender._id === currenUser._id) {
          return (
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              alignSelf="flex-start"
            >
              <Box
                key={message._id}
                color="#010101"
                bg="#acdbdf"
                borderRadius="xl"
                p={2}
              >
                <Text fontFamily="serif"> {message.content}</Text>
              </Box>
              {dispAvatar && <Avatar name={message.sender.name} size="sm" />}
            </Box>
          );
        } else {
          return (
            <Box
              display="flex"
              alignItems="center"
              flexDir="row-reverse"
              gap={1}
              alignSelf="flex-end"
            >
              <Box
                key={message._id}
                color="#010101"
                bg="#f0ece2"
                borderRadius="xl"
                p={2}
              >
                <Text fontFamily="serif"> {message.content}</Text>
              </Box>
              {dispAvatar && <Avatar name={message.sender.name} size="sm" />}
            </Box>
          );
        }
      })}
    </Box>
  );
};

export default Messages;
