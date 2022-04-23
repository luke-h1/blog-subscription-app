import { useState, useEffect, ReactNode } from 'react';
import subscriptionService from '../services/subscriptionService';
import {
  Box,
  Stack,
  HStack,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Button,
} from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';

interface Price {
  active: boolean;
  billing_scheme: 'per_unit';
  created: number;
  currency: string;
  id: string;
  livemode: boolean;
  nickname: string;
  object: string;
  product: string;
  tax_behavior: string;
  type: string;
  unit_amount: number;
  unit_amount_decimal: string;
}

function PriceWrapper({ children }: { children?: ReactNode }) {
  return (
    <Box
      mb={4}
      shadow="base"
      borderWidth="1px"
      alignSelf={{ base: 'center', lg: 'flex-start' }}
      borderColor={useColorModeValue('gray.200', 'gray.500')}
      borderRadius={'xl'}
    >
      {children}
    </Box>
  );
}

const PostPlanPage = () => {
  const [prices, setPrices] = useState<Price[]>([]);

  const fetchPrices = async () => {
    const data = await subscriptionService.getPrices();
    // @ts-ignore
    setPrices(data.data);
  };

  const createSession = async (priceId: string) => {
    const { data } = await subscriptionService.createSession(priceId);
    window.location.href = data.data.url;
  };

  useEffect(() => {
    // @ts-ignore
    const data = fetchPrices();
    console.log('data in post plan page', data);
    // @ts-ignore
  }, []);

  return (
    <Box py={12}>
      <VStack spacing={2} textAlign="center">
        <Heading as="h1" fontSize="4xl">
          Plans that fit your need
        </Heading>
        <Text fontSize="lg" color={'gray.500'}>
          Start with 14-day free trial. No credit card needed. Cancel at
          anytime.
        </Text>
      </VStack>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        textAlign="center"
        justify="center"
        spacing={{ base: 4, lg: 10 }}
        py={10}
      >
        {prices &&
          prices.map(price => (
            <PriceWrapper>
              <Box position="relative">
                <Box
                  position="absolute"
                  top="-16px"
                  left="50%"
                  style={{ transform: 'translate(-50%)' }}
                ></Box>
                <Box py={8} px={12}>
                  <Text fontWeight="500" fontSize="2xl">
                    {price.nickname}
                  </Text>
                  <HStack justifyContent="center">
                    <Text fontSize="3xl" fontWeight="600">
                      £
                    </Text>
                    <Text fontSize="5xl" fontWeight="900">
                      {price.unit_amount / 100}
                    </Text>
                    <Text fontSize="3xl" color="gray.500">
                      /month
                    </Text>
                  </HStack>
                </Box>
                <VStack bg={'gray.300'} py={4} borderBottomRadius={'xl'}>
                  <List spacing={3} textAlign="start" px={12}>
                    <ListItem>
                      <ListIcon as={FaCheckCircle} color="green.500" />
                      great posts
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheckCircle} color="green.500" />
                      Lorem, ipsum dolor.
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheckCircle} color="green.500" />
                      Lorem, ipsum dolor.
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheckCircle} color="green.500" />
                      Lorem, ipsum dolor.
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheckCircle} color="green.500" />
                      Lorem, ipsum dolor.
                    </ListItem>
                  </List>
                  <Box w="80%" pt={7}>
                    <Button w="full" colorScheme="red">
                      Purchase
                    </Button>
                  </Box>
                </VStack>
              </Box>
            </PriceWrapper>
          ))}
      </Stack>
    </Box>
  );
};

export default PostPlanPage;
