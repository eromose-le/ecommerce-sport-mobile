import { Slot, Redirect } from "expo-router";
import { useAuth } from "@/providers/auth";
import { ActivityIndicator, View } from "react-native";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { SIGN_IN, TABS_PUBLIC } from "@/constants/urls";
import { useAppState } from "@/hooks/useAppState";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Logger } from "@/utils/logger";

export default function ProtectedLayout() {
  const { user, loading, skippedLogin } = useAuth();

  const appState = useAppState();
  const userState = useAuthUser();

  Logger.dump("APP_STATE", appState);
  Logger.dump("USER_STATE", userState);
  Logger.dump("LABEL", "(PROTECTED) _layout ==::");

  if (loading) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="small" />
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
      <Slot />
    </ErrorBoundary>
  );
}
