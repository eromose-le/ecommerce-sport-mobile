import AppLoader from "@/components/common/AppLoader";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { SIGN_IN, TABS_PUBLIC } from "@/constants/urls";
import { useAuth } from "@/providers/auth";
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";

export default function ProtectedLayout() {
  const { user, loading, skippedLogin } = useAuth();

  if (loading) {
    return (
      <View className="items-center justify-center flex-1">
        <AppLoader />
      </View>
    );
  }

  if (skippedLogin) return <Redirect href={TABS_PUBLIC} />;

  if (!user) return <Redirect href={SIGN_IN} />;

  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }} />
    </ErrorBoundary>
  );
}
