import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { User } from "@/types/user";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  skippedLogin: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  skipLogin: () => Promise<void>;
  unSkipLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

// const DUMMY_USER_ACCOUNT = { id: "1", email: "" };

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [skippedLogin, setSkippedLogin] = useState(false);

  useEffect(() => {
    const load = async () => {
      const storedUser = await SecureStore.getItemAsync("user");
      const storedSkip = await SecureStore.getItemAsync("skippedLogin");

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedSkip === "true") setSkippedLogin(true);

      setLoading(false);
    };

    load();
  }, []);

  const skipLogin = async () => {
    setSkippedLogin(true);
    await SecureStore.setItemAsync("skippedLogin", "true");
  };

  const unSkipLogin = async () => {
    setSkippedLogin(false);
    await SecureStore.deleteItemAsync("skippedLogin");
  };

  const login = async (email: string, password: string) => {
    const loggedInUser = { id: "1", email };
    setUser(loggedInUser);
    await SecureStore.setItemAsync("user", JSON.stringify(loggedInUser));

    return loggedInUser;
  };

  const logout = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        skippedLogin,
        login,
        logout,
        skipLogin,
        unSkipLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
