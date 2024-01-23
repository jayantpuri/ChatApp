import React, { useContext, Fragment } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { chatState } from "../contexts/chatContext.component";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Avatar,
} from "@chakra-ui/react";

const ProfileModal = ({ children , user}) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  return (
    <Fragment>
      <span onClick={() => onOpen()}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{user && user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            gap="30px"
          >
            <Avatar src={user.profile | ""} size="2xl" />
            <Text fontSize="xl" fontWeight="400">
              Email : {user && user.email}
            </Text>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default ProfileModal;
