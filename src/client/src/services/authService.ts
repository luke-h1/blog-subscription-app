import axios from 'axios';

const authService = {
  login: async (
    email: string,
    password: string,
  ): Promise<{
    errors?: [{ message: string }];
    data: {
      token: string;
      user: {
        id: string;
        email: string;
        stripeCustomerId: string;
      };
    };
  }> => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/login`,
      {
        email,
        password,
      },
    );
    return data;
  },

  register: async (
    email: string,
    password: string,
  ): Promise<{
    errors?: [{ message: string }];
    data: {
      token: string;
      user: {
        id: string;
        email: string;
        stripeCustomerId: string;
      };
    };
  }> => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/register`,
      {
        email,
        password,
      },
    );
    return data;
  },
  me: async (): Promise<{
    errors?: [{ message: string }];
    user: { id: string; email: string; stripeCustomerId: string };
  }> => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/me`,
    );
    return data;
  },
};

export default authService;
