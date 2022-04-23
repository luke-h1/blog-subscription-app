import React, { createContext, useEffect, useState } from 'react';
import authService from '../services/authService';
import { useMemo } from 'react';
import axios from 'axios';

interface AuthContextState {
  user?: {
    id: string;
    email: string;
    stripeCustomerId: string;
  };
  error?: string;
  loading: boolean;
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}

interface User {
  id: string;
  email: string;
  stripeCustomerId: string;
  loading: boolean;
  error?: string;
}

export const AuthContext = createContext<AuthContextState | undefined>(
  undefined,
);

interface Props {
  children?: React.ReactNode;
}

interface State {
  ready: boolean;
  user?: User;
}

export const AuthContextProvider = ({ children }: Props) => {
  const [state, setState] = useState<State>({ ready: false });

  const token = localStorage.getItem('token');

  if (token) {
    axios.defaults.headers.common['authorization'] = `Bearer ${token}`;
  }

  const fetchUser = async () => {
    const data = await authService.me();
    if (data && data.user) {
      setState({
        user: {
          id: data.user.id,
          email: data.user.email,
          stripeCustomerId: data.user.stripeCustomerId,
          loading: false,
        },
        ready: true,
      });
    } else if (data && data.errors && data.errors.length > 0) {
      setState({
        user: undefined,
        ready: true,
      });
    } else {
      setState({
        user: undefined,
        ready: true,
      });
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setState({
        user: undefined,
        ready: true,
      });
    }
  }, []);

  const contextState: AuthContextState = useMemo(() => {
    return {
      user: state.user,
      error: state.user?.error,
      loading: state.user?.loading as boolean,
      state,
      setState,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user]);

  return !state.user?.loading && state.ready ? (
    <AuthContext.Provider value={contextState}>{children}</AuthContext.Provider>
  ) : null;
};

export function useAuthContext(): AuthContextState {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within a AuthContextProvider');
  }
  return context;
}
