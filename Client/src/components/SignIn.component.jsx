import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { API_URL } from "../utils";
import { chatState } from "../contexts/chatContext.component";
import { useContext } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Button,
  InputRightAddon,
  InputGroup,
  useToast,
} from "@chakra-ui/react";

const SignIn = () => {
  const history = useHistory();
  const toast = useToast();

  const { setCurrentUser } = useContext(chatState);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  let isEmptyEmail = email === "";
  let isEmptyPassword = password === "";

  const showPassword = () => setShow(!show);
  const emailChange = (e) => setEmail(e.target.value);
  const passwordChange = (e) => setPassword(e.target.value);

  const login = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "empty fields",
        description: "Please fill all fields",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_URL}/api/user/signIn`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      setLoading(false);
      localStorage.setItem("user", JSON.stringify(data));
      setCurrentUser(data);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error",
        description: "failed to login",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const getGuestCred = () => {
    setEmail("guestUser@guest.com");
    setPassword("guestPassword");
  };

  return (
    <form>
      <VStack spacing={"25px"}>
        <FormControl isRequired isInvalid={isEmptyEmail}>
          <FormLabel>Email Address</FormLabel>
          <Input
            type="email"
            value={email}
            placeholder="Email"
            onChange={emailChange}
          />
          {isEmptyEmail && (
            <FormHelperText fontWeight={700} color={"blackAlpha.600"}>
              Empty email field
            </FormHelperText>
          )}
        </FormControl>

        <FormControl isRequired isInvalid={isEmptyPassword}>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              value={password}
              placeholder="Password"
              onChange={passwordChange}
            />
            <InputRightAddon onClick={showPassword}>show</InputRightAddon>
          </InputGroup>

          {isEmptyPassword && (
            <FormHelperText fontWeight={700} color={"blackAlpha.600"}>
              Empty password field
            </FormHelperText>
          )}
        </FormControl>

        <FormControl>
          <Button
            _hover={{ bg: "teal" }}
            color={"white"}
            w={"100%"}
            bg={"#69779b"}
            fontSize={"20px"}
            textAlign={"center"}
            onClick={(e) => login(e)}
            isDisabled={loading}
            isLoading={loading}
          >
            Login
          </Button>
        </FormControl>

        <FormControl>
          <Button
            color={"#010101"}
            w={"100%"}
            bg={"#acdbdf"}
            fontSize={"20px"}
            textAlign={"center"}
            onClick={getGuestCred}
            isDisabled={loading}
          >
            Get guest credentials
          </Button>
        </FormControl>
      </VStack>
    </form>
  );
};

export default SignIn;
