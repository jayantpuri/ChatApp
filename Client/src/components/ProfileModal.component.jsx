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

const ProfileModal = ({ children }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { currentUser } = useContext(chatState);
  return (
    <Fragment>
      <span onClick={() => onOpen()}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{currentUser && currentUser.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            gap="30px"
          >
            <Avatar src={currentUser.profile | ""} size="2xl" />
            <Text fontSize="xl" fontWeight="400">
              Email : {currentUser && currentUser.email}
            </Text>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default ProfileModal;
