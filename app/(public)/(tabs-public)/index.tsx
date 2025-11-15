import { useAuth } from "@/providers/auth";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PublicHome() {
  const { user, loading, skippedLogin } = useAuth();
  console.log("(PUBLIC home) ==::", { user, loading, skippedLogin });
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl">Public Home</Text>
    </SafeAreaView>
  );
}
