import { SIGN_IN, TABS_PUBLIC } from "@/constants/urls";
import { User } from "@/services/user/user.types";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Logger } from "@/utils/logger";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  skippedLogin: boolean;
  login: (user: User) => Promise<User>;
  logout: () => Promise<void>;
  skipLogin: () => Promise<void>;
  unSkipLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

// const dummyLoggedInUser = { id: "1", email: "" };

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [skippedLogin, setSkippedLogin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync("user");
        const storedSkip = await SecureStore.getItemAsync("skippedLogin");

        if (!isMounted) return;

        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedSkip === "true") setSkippedLogin(true);
      } catch (error) {
        Logger.error("AuthProvider: failed to restore session", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const skipLogin = async () => {
    setSkippedLogin(true);
    await SecureStore.setItemAsync("skippedLogin", "true");
    router.push({
      pathname: TABS_PUBLIC,
      params: { fromOnboarding: "true" },
    });
  };

  const unSkipLogin = async () => {
    setSkippedLogin(false);
    await SecureStore.deleteItemAsync("skippedLogin");
    router.push({
      pathname: SIGN_IN,
      params: { fromOnboarding: "true" },
    });
  };

  const login = async (user: User) => {
    const loggedInUser = user;
    setUser(loggedInUser);
    await SecureStore.setItemAsync("user", JSON.stringify(loggedInUser));

    return loggedInUser;
  };

  const logout = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync("user");
    router.push({
      pathname: SIGN_IN,
      params: { fromOnboarding: "true" },
    });
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
