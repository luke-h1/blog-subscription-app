import { useEffect, useState } from 'react';
import postService from '../services/postService';
import { Box, Center, Heading, Text, Stack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export enum Access {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
}
export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
  access: Access;
}

const PostPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>('');

  const fetchPosts = async () => {
    const data = await postService.getPosts();
    console.log(data);
    if (data.errors) {
      setError(data.errors);
    } else {
      setPosts(data.data);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Center py={6}>
      <Stack spacing={4}>
        {posts &&
          posts.map(post => (
            <Link to={`/posts/${post.id}`} key={post.id}>
              <Box
                maxW={'445px'}
                w={'full'}
                bg={'white'}
                boxShadow={'2xl'}
                rounded={'md'}
                p={6}
                overflow={'hidden'}
              >
                <Box
                  h={'210px'}
                  bg={'gray.100'}
                  mt={-6}
                  mx={-6}
                  mb={6}
                  pos={'relative'}
                >
                  <img src={post.imageUrl} alt={post.title} />
                </Box>
                <Stack>
                  <Text
                    color={'green.500'}
                    textTransform={'uppercase'}
                    fontWeight={800}
                    fontSize={'sm'}
                    letterSpacing={1.1}
                  >
                    Blog
                  </Text>
                  <Heading color={'white'} fontSize={'2xl'} fontFamily={'body'}>
                    {post.title}
                  </Heading>
                  <Text color={'gray.500'}>{post.content}</Text>
                </Stack>
              </Box>
            </Link>
          ))}
        {error && error}
        {!posts && <p>NO posts available</p>}
      </Stack>
    </Center>
  );
};

export default PostPage;
