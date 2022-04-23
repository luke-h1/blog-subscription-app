import React from 'react';
import {
  Box,
  Link as ChakraLink,
  Flex,
  Button,
  Heading,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';

const Nav = () => {
  const navigate = useNavigate();
  const { loading, user, state, setState } = useAuthContext();

  let body = null;

  // data is loading
  if (!loading && !user) {
    body = (
      <>
        <Link to="/login">
          <ChakraLink mr={2}>login</ChakraLink>
        </Link>
        <Link to="/register">
          <ChakraLink>register</ChakraLink>
        </Link>
      </>
    );
    // user is logged in
  } else {
    body = (
      <Flex align="center">
        <Box mr={2}>{user?.email}</Box>
        <Button
          onClick={() => {
            setState({
              user: undefined,
              ready: true,
            });
            localStorage.removeItem('token');
            axios.defaults.headers.common['Authorization'] = '';
            navigate('/');
          }}
          variant="link"
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="#fff" p={4}>
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <Link to="/">
          <ChakraLink>
            <Heading>Home</Heading>
          </ChakraLink>
        </Link>
        <Box ml={'auto'}>{body}</Box>
      </Flex>
    </Flex>
  );
};
export default Nav;
