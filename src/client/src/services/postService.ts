import axios from 'axios';

const postService = {
  getPosts: async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/posts`,
    );
    return data;
  },
};

export default postService;
