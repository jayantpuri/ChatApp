import React, { useState } from "react";
import { chatState } from "../contexts/chatContext.component";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../utils";
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
  Spinner,
} from "@chakra-ui/react";

const url = "https://api.cloudinary.com/v1_1/dg8q4bagj/image/upload";

const SignUp = () => {
  const { setCurrentUser } = useContext(chatState);
  const toast = useToast();
  const history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState();

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEmptyEmail = email === "";
  const isEmptyPassword = password === "";
  const isEmptyName = name === "";
  const isEmptyConfirm = confirmPassword === "";

  const nameChange = (e) => setName(e.target.value);
  const emailChange = (e) => setEmail(e.target.value);
  const passwordChange = (e) => setPassword(e.target.value);
  const confirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const signUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      toast({
        title: "password!",
        description: "passwords do not match",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_URL}/api/user/signUp`,
        { name, email, password, profilePicture },
        { headers: { "Content-Type": "application/json" } }
      );

      setLoading(false);
      localStorage.setItem("user", JSON.stringify(data));
      setCurrentUser(data);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "eror",
        description: "error signing ip",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const uploadPicture = async (image) => {
    setLoading(true);

    if (image === "undefined") {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    if (image.type === "image/jpeg" || image.type === "image/png") {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "ReactChatApp");
      data.append("cloud_name", "dg8q4bagj");

      await axios
        .post(url, data)
        .then((res) => res.data['secure_url'])
        .then((data) => {
          setProfilePicture(data.toString());
          setLoading(false);
        })
        .catch((error) => {
          console.log(error)
          setLoading(false);
        });
    } else {
      toast({
        title: "Invalid file type",
        description: "You can only upload an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing={"25px"}>
      <FormControl isRequired isInvalid={isEmptyName}>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          value={name}
          placeholder="Name"
          onChange={nameChange}
        />
        {isEmptyName && (
          <FormHelperText fontWeight={700} color={"blackAlpha.600"}>
            Empty name field
          </FormHelperText>
        )}
      </FormControl>

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
            type={showPass ? "text" : "password"}
            value={password}
            placeholder="Password"
            onChange={passwordChange}
          />
          <InputRightAddon onClick={() => setShowPass(!showPass)}>
            show
          </InputRightAddon>
        </InputGroup>

        {isEmptyPassword && (
          <FormHelperText fontWeight={700} color={"blackAlpha.600"}>
            Empty password field
          </FormHelperText>
        )}
      </FormControl>

      <FormControl isRequired isInvalid={isEmptyPassword}>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={showConfirmPass ? "text" : "password"}
            value={confirmPassword}
            placeholder="Password"
            onChange={confirmPasswordChange}
          />
          <InputRightAddon onClick={() => setShowConfirmPass(!showConfirmPass)}>
            show
          </InputRightAddon>
        </InputGroup>

        {isEmptyConfirm && (
          <FormHelperText fontWeight={700} color={"blackAlpha.600"}>
            Empty password field
          </FormHelperText>
        )}
      </FormControl>

      <FormControl>
        <FormLabel>Upload your picture</FormLabel>

        <Input
          type="file"
        
          accept="image/*"
          placeholder="No file chosen"
          onChange={(e) => {
            uploadPicture(e.target.files[0]);
          }}
        />
      </FormControl>

      <FormControl>
        <Button
          _hover={{ bg: "teal", color: "white" }}
          color={"white"}
          w={"100%"}
          bg={"#69779b"}
          fontSize={"20px"}
          textAlign={"center"}
          onClick={signUp}
          isDisabled={loading}
          isLoading={loading}
        >
          {loading === true ? <Spinner /> : "Sign-Up"}
        </Button>
      </FormControl>
    </VStack>
  );
};

export default SignUp;
