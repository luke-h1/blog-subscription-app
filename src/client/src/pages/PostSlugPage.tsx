import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import postService from '../services/postService';
import { Post } from './PostPage';
import { Box, Container, Text } from '@chakra-ui/react';

const PostSlugPage = () => {
  const [post, setPost] = useState<Post>();
  let params = useParams();

  const fetchPost = async () => {
    const { data } = await postService.getPost(params.id as string);
    setPost(data as unknown as Post);
  };

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Container>
      {post ? (
        <Box>
          <Text as="h1" fontSize="3xl">
            {post.title}
          </Text>
          <img src={post.imageUrl} alt={post.title} />
          <Text as="p">{post.content}</Text>
          <Text>Access Level: {post.access}</Text>
        </Box>
      ) : (
        <Text>no posts</Text>
      )}
    </Container>
  );
};
export default PostSlugPage;
