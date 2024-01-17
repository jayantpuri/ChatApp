import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

const SideBar = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return <div>{children}</div>;
};

export default SideBar;
