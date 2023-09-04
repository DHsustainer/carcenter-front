"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import Cookie from 'js-cookie'

type AuthTokens = {
  name: string;
  email: string;
  role: any;
  token: string;
};

const AUTH_TOKENS_KEY = "AUTH";

export const AuthContext = createContext({
  login: (authTokens: AuthTokens) => {},
  logout: () => {},
  isLoggedIn: false,
  authTokens: null,
});

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const authTokensInLocalStorage = Cookie.get(AUTH_TOKENS_KEY);
  const parsedAuthTokens = authTokensInLocalStorage
    ? JSON.parse(authTokensInLocalStorage)
    : null;
  const [authTokens, setAuthTokens] = useState(parsedAuthTokens);

  const login = useCallback(function (authTokens: AuthTokens) {
    Cookie.set(AUTH_TOKENS_KEY, JSON.stringify(authTokens));
    setAuthTokens(authTokens);
  }, []);

  const logout = useCallback(function () {
    Cookie.remove(AUTH_TOKENS_KEY);
    setAuthTokens(null);
  }, []);

  const value = useMemo(
    () => ({
      login,
      logout,
      authTokens,
      isLoggedIn: authTokens !== null,
    }),
    [authTokens, login, logout]
  );

  return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}