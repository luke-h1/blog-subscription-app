import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import postService from '../services/postService';
import { Post } from './PostPage';

const PostSlugPage = () => {
  const [post, setPost] = useState<Post>();
  let params = useParams();

  const fetchPost = async () => {
    const post = await postService.getPost(params.id as string);
    console.log(post);
    setPost(post as unknown as Post);
  };

  useEffect(() => {
    fetchPost();
  }, []);
  return <div>slug page</div>;
};
export default PostSlugPage;
