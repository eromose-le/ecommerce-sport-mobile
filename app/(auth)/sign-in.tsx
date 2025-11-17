import AppLoader from "@/components/common/AppLoader";
import { SIGN_UP, TABS_PROTECTED, TABS_PUBLIC } from "@/constants/urls";
import { useAuth } from "@/providers/auth";
import { api } from "@/services/api/api";
import { Logger } from "@/utils/logger";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  const { login, user, skipLogin, skippedLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loadingOverlay, setLoadingOverlay] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) router.push(TABS_PROTECTED);
  }, [user]);

  // Redirect if skipped
  useEffect(() => {
    if (skippedLogin) router.push(TABS_PUBLIC);
  }, [skippedLogin]);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/auth/login", { email, password });
      return res.data;
    },
    onMutate: () => setLoadingOverlay(true),
    onSuccess: async (data) => {
      await login(data?.data);

      router.push(TABS_PROTECTED);
    },
    onError: (err: any) => {
      Logger.error("LOGIN ERROR:", err?.response?.data || err.message);
    },
    onSettled: () => setLoadingOverlay(false),
  });

  const handleLogin = () => {
    if (!email || !password) {
      Logger.warn("Email & password required");
      return;
    }
    mutation.mutate();
  };

  const handleRegister = () => router.push(SIGN_UP);

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

        <View className="flex-col items-center gap-3">
          {/* Sign up */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={mutation.isPending}
          >
            <Text className="text-base underline text-primary">
              Create Account
            </Text>
          </TouchableOpacity>

          {/* Skip */}
          <TouchableOpacity onPress={handleSkip} disabled={mutation.isPending}>
            <Text className="text-base underline text-secondary">
              Skip for now ?
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FULLSCREEN LOADING OVERLAY */}
      {loadingOverlay && (
        <View className="absolute inset-0 items-center justify-center bg-black/20">
          <AppLoader />
        </View>
      )}
    </SafeAreaView>
  );
}
