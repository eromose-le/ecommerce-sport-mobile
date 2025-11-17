import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "@/providers/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { TABS_PROTECTED, TABS_PUBLIC } from "@/constants/urls";

export default function SignIn() {
  const { login, user, skipLogin, skippedLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.push(TABS_PROTECTED);
  }, [user]);

  useEffect(() => {
    if (skippedLogin) router.push(TABS_PUBLIC);
  }, [skippedLogin]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const loggedInUser = await login("demo@email.com", "password");
      if (loggedInUser) router.push(TABS_PROTECTED);
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => skipLogin();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="items-center justify-center flex-1 px-6">
        <Text className="mb-10 text-3xl font-semibold text-gray-800">
          Welcome
        </Text>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="w-full max-w-[260px] py-3 bg-black rounded-xl mb-5"
        >
          <Text className="text-lg font-medium text-center text-white">
            Sign In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSkip} disabled={loading}>
          <Text className="text-base text-blue-600 underline">Skip for now</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View className="absolute inset-0 items-center justify-center bg-black/20">
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}
    </SafeAreaView>
  );
}
