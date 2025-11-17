import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/providers/auth";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { api } from "@/services/api/api";
import { TABS_PROTECTED, TABS_PUBLIC } from "@/constants/urls";
import { Logger } from "@/utils/logger";

export default function SignIn() {
  const { login, user, skipLogin, skippedLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Full-screen loading overlay
  const [loadingOverlay, setLoadingOverlay] = useState(false);

  // Redirect if already authenticated or skipped
  useEffect(() => {
    if (user) router.push(TABS_PROTECTED);
  }, [user]);

  useEffect(() => {
    if (skippedLogin) router.push(TABS_PUBLIC);
  }, [skippedLogin]);

  //
  // 🚀 React Query Login Mutation
  //
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/auth/login", { email, password });
      return res.data;
    },
    onMutate: () => setLoadingOverlay(true),
    onSuccess: async (data) => {
      // Sync with your AuthProvider -> Zustand + SecureStore
      console.log("data", data);
      await login(data?.data);

      router.push(TABS_PROTECTED);
    },
    onError: (err: any) => {
      Logger.error("LOGIN ERR", err);
      console.log("LOGIN ERROR:", err?.response?.data || err.message);
    },
    onSettled: () => setLoadingOverlay(false),
  });

  const handleLogin = () => {
    if (!email || !password) {
      console.log("Email & password required");
      return;
    }
    mutation.mutate();
  };

  const handleSkip = () => skipLogin();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="items-center justify-center flex-1 px-6">
        <Text className="mb-10 text-3xl font-semibold text-gray-800">
          Welcome
        </Text>

        {/* Email Input */}
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          className="w-full max-w-[300px] bg-gray-100 px-4 py-3 rounded-xl mb-4 border border-gray-200"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password Input */}
        <TextInput
          placeholder="Password"
          secureTextEntry
          className="w-full max-w-[300px] bg-gray-100 px-4 py-3 rounded-xl mb-6 border border-gray-200"
          value={password}
          onChangeText={setPassword}
        />

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={mutation.isPending}
          className="w-full max-w-[260px] py-3 bg-black rounded-xl mb-5"
        >
          <Text className="text-lg font-medium text-center text-white">
            {mutation.isPending ? "Signing In..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        {/* Skip */}
        <TouchableOpacity onPress={handleSkip} disabled={mutation.isPending}>
          <Text className="text-base text-blue-600 underline">
            Skip for now
          </Text>
        </TouchableOpacity>
      </View>

      {/* FULLSCREEN LOADING OVERLAY */}
      {loadingOverlay && (
        <View className="absolute inset-0 items-center justify-center bg-black/20">
          <ActivityIndicator size="small" color="#000" />
        </View>
      )}
    </SafeAreaView>
  );
}
