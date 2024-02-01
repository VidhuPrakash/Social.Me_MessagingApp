import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  VStack,
  FormLabel,
  FormControl,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
const Signup = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const postDetails = (file) => {
    var reader = new FileReader();

    reader.onload = function (e) {
      console.log(e.target.result);
    };

    reader.readAsDataURL(file);
  };
  const submitHandlerr = async () => {
    setLoading(true);
    console.log(pic);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Fill the field",
        description: "We've created your account for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      console.log("Fill all the fields");
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Password Do Not Match",
        status: "Warning",
        duration: 5000,
        isClosable: true,
      });
      console.log("password");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("pic", pic);

      const { data } = await axios.post("/api/user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast({
        title: "Registration successful",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      console.log("Registertt");
      localStorage.setItem("userinfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Registration Failed",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });

      setLoading(false);
    }
  };
  return (
    <VStack spacing="5px" color="black">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="emailControl" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          id="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="passwordControl" isRequired>
        <FormLabel>Password</FormLabel>
        <Input
          id="password"
          type={"password"}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>

      <FormControl id="confirmpassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          type={"password"}
          placeholder="Confirm-Password"
          onChange={(e) => setConfirmpassword(e.target.value)}
        />
      </FormControl>
      <FormControl id="pic" isRequired>
        <FormLabel>Profile Picture</FormLabel>
        <Input
          type={"file"}
          p={1.5}
          accept="image/*"
          onChange={(e) => setPic(e.target.files[0])}
        />
      </FormControl>
      <Button width="100%" colorScheme="teal" onClick={submitHandlerr}>
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
