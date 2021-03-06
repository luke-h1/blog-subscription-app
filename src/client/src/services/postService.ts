import axios from 'axios';
import { Post } from '../pages/PostPage';

const postService = {
  getPosts: async (): Promise<{ data: Post[] } & { errors?: string }> => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/posts`,
    );
    return data;
  },

  getPost: async (
    id: string,
  ): Promise<{ data: Post } & { errors?: string }> => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/posts/${id}`,
    );
    return data;
  },
};

export default postService;
