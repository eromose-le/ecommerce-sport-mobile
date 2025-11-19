import AppLoader from "@/components/common/AppLoader";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { SIGN_IN, TABS_PUBLIC } from "@/constants/urls";
import { useAppState } from "@/hooks/useAppState";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useAuth } from "@/providers/auth";
import { Logger } from "@/utils/logger";
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";

export default function ProtectedLayout() {
  const { user, loading, skippedLogin } = useAuth();

  const appState = useAppState();
  const userState = useAuthUser();

  Logger.warn("LAYOUT", "(PROTECTED) ==::", { appState, userState });

  if (loading) {
    return (
      <View className="items-center justify-center flex-1">
        <AppLoader />
      </View>
    );
  }
  if (skippedLogin) {
    return <Redirect href={TABS_PUBLIC} />;
  }

  if (!user) {
    return <Redirect href={SIGN_IN} />;
  }

  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }} />
    </ErrorBoundary>
  );
}
