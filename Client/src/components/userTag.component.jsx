import React from "react";
import { Tag, TagLabel, TagRightIcon } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const UserTag = ({ removeUser, user }) => {
  return (
    <div>
      <Tag
        size="lg"
        bg="#f0ece2"
        color="#010101"
        _hover={{ bg: "#69779b", color: "white" }}
      >
        <TagLabel>{user.name}</TagLabel>
        <TagRightIcon
          cursor="pointer"
          as={CloseIcon}
          boxSize="10px"
          onClick={() => removeUser(user)}
        />
      </Tag>
    </div>
  );
};

export default UserTag;
