import React, { createContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import authService from '../services/authService';

interface AuthContextState {
  data?: {
    id: string;
    email: string;
    stripeCustomerId: string;
  };
  error?: string;
  loading: boolean;
}

export const UserContext = createContext<AuthContextState>({
  loading: false,
  data: undefined,
  error: undefined,
});

export const UserContextProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [user, setUser] = useState<AuthContextState>({
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

    if (data && data.user) {
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

  const contextState: AuthContextState = useMemo(() => {
    return {
      data: {
        email: user.data?.email as string,
        id: user.data?.id as string,
        stripeCustomerId: user.data?.stripeCustomerId as string,
      },
      error: user.error,
      loading: user.loading,
    };
  }, [user]);

  return (
    <UserContext.Provider value={contextState}>{children}</UserContext.Provider>
  );
};

export function useAuthContext(): AuthContextState {
  const context = React.useContext(UserContext);

  if (!context) {
    throw new Error('useAuthContext must be used within a UserContextProvider');
  }

  return context;
}
