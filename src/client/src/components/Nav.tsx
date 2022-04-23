import React from 'react';
import {
  Box,
  Link as ChakraLink,
  Flex,
  Button,
  Heading,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Nav = () => {
  const [user, setUser] = useContext(UserContext);
  const navigate = useNavigate();

  let body = null;

  // data is loading
  if (user.loading) {
    // user not logged in
  } else if (!user.data) {
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
        <Box mr={2}>{user.data.email}</Box>
        <Button
          onClick={() => {
            setUser({
              loading: false,
              data: undefined,
              error: undefined,
            });
            localStorage.removeItem('token');
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
