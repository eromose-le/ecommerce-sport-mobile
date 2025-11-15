import { useAuth } from "@/providers/auth";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProtectedHome() {
  const { user, loading, skippedLogin, logout } = useAuth();
  console.log("(PROTECTED home) ==::", { user, loading, skippedLogin });
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl">Protected Home</Text>

      <TouchableOpacity onPress={logout} disabled={loading}>
        <Text className="text-blue-500">Log out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
