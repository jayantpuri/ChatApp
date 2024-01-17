import React from "react";
import { Container, Box, Text, Input, Button } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import SideBar from "./SideBar.component";
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

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Container minW="100vw" height="7vh" bg="#69779b">
      <Box
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        direction="row"
        justifyContent="space-between"
      >
        <SideBar>
          <Box
            onClick={onOpen}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <SearchIcon />
            <Text fontSize="1xl" fontWeight="500" color="white">
              Search user
            </Text>
          </Box>
        </SideBar>
        <Box>
          <Text fontSize="4xl" fontWeight="500" color="white">
            Talk-A-Tive
          </Text>
        </Box>
        <Box>
          <Text fontSize="4xl" fontWeight="500" color="white">
            Modal
          </Text>
        </Box>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search for users</DrawerHeader>

          <DrawerBody>
            <Input placeholder="Type here..." />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Search
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Container>
  );
};

export default Header;
