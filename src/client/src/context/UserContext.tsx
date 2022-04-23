import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import authService from '../services/authService';

interface User {
  data?: {
    id: string;
    email: string;
    stripeCustomerId: string;
  };
  error?: string;
  loading: boolean;
}

export const UserContext = createContext<
  [User, React.Dispatch<React.SetStateAction<User>>]
>([
  {
    data: undefined,
    error: undefined,
    loading: true,
  },
  () => {},
]);

export const UserProvider = ({ children }: { children?: React.ReactNode }) => {
  const [user, setUser] = useState<User>({
    data: undefined,
    error: undefined,
    loading: false,
  });

  const token = localStorage.getItem('token');

  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  const fetchUser = async () => {
    const data = await authService.me();
    console.log(data);

    if (data.user) {
      setUser({
        data: {
          id: data.user.id,
          email: data.user.email,
          stripeCustomerId: data.user.stripeCustomerId,
        },
        error: undefined,
        loading: false,
      });
    } else if (data && data.errors && data.errors.length) {
      setUser({
        data: undefined,
        error: data.errors[0].message,
        loading: false,
      });
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser({
        data: undefined,
        error: undefined,
        loading: false,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};
