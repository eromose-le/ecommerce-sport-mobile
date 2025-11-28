import AppLoader from "@/components/common/AppLoader";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { TABS_PROTECTED } from "@/constants/urls";
import { useAuth } from "@/providers/auth";
import { Redirect, Slot } from "expo-router";
import { View } from "react-native";

export default function PublicLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <AppLoader />
      </View>
    );
  }

  if (user) return <Redirect href={TABS_PROTECTED} />;

  return (
    <ErrorBoundary>
      <Slot />
    </ErrorBoundary>
  );
}
