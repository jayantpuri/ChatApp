import React, { useContext } from "react";
import { chatState } from "../contexts/chatContext.component";
import {
  Box,
  ScaleFade,
  useDisclosure,
  Stack,
  Modal,
  Text,
  Divider,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const NotificationModal = ({ children, notifications }) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { setCurrentChat, setNotification } = useContext(chatState);
  console.log(notifications);

  const handleNotification = (chat) => {
    setCurrentChat(chat);
    setNotification(
      notifications.filter((notif) => notif.chat._id !== chat._id)
    );
    onClose();
  };

  const modal = (
    <Stack bg="#f0ece2" color="#010101" borderRadius="xl">
      {notifications.map((notif) => (
        <Box
          key={notif._id}
          cursor="pointer"
          onClick={() => handleNotification(notif.chat)}
        >
          <Text
            align="center"
            padding={2}
            borderRadius="lg"
            fontSize="18px"
            _hover={{ bg: "#69779b", color: "white" }}
          >
            {!notif.chat.isGroupChat
              ? `${notif.sender.name} sent you a message`
              : `${notif.sender.name} sent a message in ${notif.chat.chatName} `}
          </Text>
          <Divider type="solid" colorScheme="cyan" />
        </Box>
      ))}
    </Stack>
  );

  return (
    <>
      <span onClick={onToggle}>{children}</span>

      <ScaleFade initialScale={0.9} in={isOpen}>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent display="flex" justifyContent="center">
            <ModalHeader mx="auto">Notifications</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', fontSize: '18px' }}>
                  No new messages
                </div>
              ) : (
                modal
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </ScaleFade>
    </>
  );
};

export default NotificationModal;
