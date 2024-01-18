import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Container,
} from "@chakra-ui/react";
import SignUp from "../components/SignUp.component";
import SignIn from "../components/SignIn.component";

const Home = () => {
  const history = useHistory();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      history.push("/chats");
    }
  }, [history]);

  return (
    <Container
      maxW={{ base: "70vw", md: "70vw", lg: "40vw" }}
      maxH="100vh"
      margin={"auto"}
      border={"solid #010101"}
      mt={"5%"}
      borderRadius={8}
      padding={3}
      bg={"#f0ece2"}
    >
      <Box
        w={"100%"}
        bg={"#acdbdf"}
        padding={4}
        fontSize={"45px"}
        fontWeight={500}
        textAlign={"center"}
        borderRadius={8}
      >
        Talk-A-Tive
      </Box>
      <Box bg={"#f0ece2"} mt={8} borderRadius={8} padding={3}>
        <Tabs defaultIndex={0} variant={"soft-rounded"} size={"lg"} isFitted>
          <TabList>
            <Tab bg={"#acdbdf"} fontSize="20px">
              Log In
            </Tab>
            <Tab bg={"#acdbdf"} fontSize="20px">
              Sign Up
            </Tab>
          </TabList>

          <TabPanels pt={4}>
            <TabPanel>
              <SignIn />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
