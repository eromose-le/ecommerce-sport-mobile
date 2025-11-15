import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "@/providers/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function SignIn() {
  const { login, user, skipLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login("demo@email.com", "password");
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  console.log("login", { login, user, skipLogin });

  const handleSkip = () => {
    skipLogin?.();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-2xl mb-6 text-red-100">Sign In</Text>

        <TouchableOpacity
          onPress={handleLogin}
          className="px-6 py-3 bg-black rounded-lg mb-4"
          disabled={loading}
        >
          <Text className="text-white">Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSkip} disabled={loading}>
          <Text className="text-blue-500">Skip for now</Text>
        </TouchableOpacity>
      </View>

      {/* Loader overlay */}
      {loading && (
        <View className="absolute inset-0 bg-black bg-opacity-30 justify-center items-center">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </SafeAreaView>
  );
}
