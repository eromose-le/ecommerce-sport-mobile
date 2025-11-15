import { Slot, Redirect } from "expo-router";
import { useAuth } from "@/providers/auth";
import { ActivityIndicator, View } from "react-native";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export default function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(public)/(tabs-public)" />;
  }

  return (
    <ErrorBoundary>
      <Slot />
    </ErrorBoundary>
  );
}
