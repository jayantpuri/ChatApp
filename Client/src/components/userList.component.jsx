import React from "react";
import { Box, Avatar, Text } from "@chakra-ui/react";

const UserList = ({ user, handleClick }) => {
  return (
    <Box
      onClick={() => handleClick(user)}
      cursor="pointer"
      mx="auto"
      maxW="90%"
      display="flex"
      justifyContent="space-around"
      alignItems="center"
      mt="20px"
      bg="#acdbdf"
      padding="10px 0"
      borderRadius="lg"
      _hover={{ background: "#69779b", color: "white" }}
    >
      <Avatar size="md" name={user.name} src={user.picture} />
      <Box display="flex" flexDir="column" ml="-30px">
        <Text fontSize="2xl">{user.name}</Text>
        Email: {user.email}
      </Box>
    </Box>
  );
};

export default UserList;
