import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";
import {
  VStack,
  FormLabel,
  FormControl,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [token, setToken] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("blah:", email, password);
    setToken(token);
  }, []);
  const submitHandler = async () => {
    if (!email || !password) {
      toast({
        title: "OOPS",
        description: "Fill the field",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    try {
      const { data } = await axios.post("/api/user/login", { email, password });

      toast({
        title: "Welcome",
        description: "Login successful",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.setItem("token", data.token); // Store the token in the local storage
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Login Failed",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing="5px" color="black">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <Input
          type={"password"}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>

      <Button width="100%" onClick={submitHandler}>
        Login
      </Button>
    </VStack>
  );
};

export default Login;
