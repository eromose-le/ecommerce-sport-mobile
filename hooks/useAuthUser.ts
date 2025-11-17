import { useAuth } from "@/providers/auth";

export const useAuthUser = () => {
  const { user, skippedLogin, loading } = useAuth();

  return {
    user,
    loading,
    skippedLogin,
    loggedIn: !!user,
    isGuest: !user && skippedLogin,
    isFreshUser: !user && !skippedLogin,
  };
};

// USAGE
// const { user, loggedIn } = useAuthUser();