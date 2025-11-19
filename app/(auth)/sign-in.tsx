import DirectLeftIcon from "@/assets/icons/direct-left.svg";
import AppLoader from "@/components/common/AppLoader";
import { SvgIcon } from "@/components/common/SvgIcon";
import {
  FORGOT_PASSWORD,
  ON_BOARDING,
  SIGN_UP,
  TABS_PROTECTED,
  TABS_PUBLIC,
} from "@/constants/urls";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useAuth } from "@/providers/auth";
import { AuthService } from "@/services/api";
import { ILoginUserPayload } from "@/services/auth/auth.types";
import { User } from "@/services/user/user.types";
import { AppToast } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

export default function SignIn() {
  const params = useLocalSearchParams<{ fromOnboarding?: string }>();
  const cameFromOnboarding = params?.fromOnboarding === "true";
  const { login, user, skipLogin } = useAuth();
  const { isFreshUser, isGuest } = useAuthUser();

  const [form, setForm] = useState<ILoginUserPayload>({
    email: "",
    password: "",
  });

  const [loadingOverlay, setLoadingOverlay] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) router.replace(TABS_PROTECTED);
  }, [user]);

  // Redirect if skipped
  useEffect(() => {
    if (isGuest) router.replace(TABS_PUBLIC);
  }, [isGuest]);

  // Redirect if fresh user
  useEffect(() => {
    if (isFreshUser && !cameFromOnboarding) {
      router.replace(ON_BOARDING);
    }
  }, [cameFromOnboarding, isFreshUser]);

  const loginMutation = useMutation({
    mutationFn: () => AuthService.loginUser(form),
    onMutate: () => setLoadingOverlay(true),
    onSuccess: async (res) => {
      AppToast.success("Login Successful");

      // Store user using AuthProvider
      await login(res?.data as User);

      router.replace(TABS_PROTECTED);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error || err?.message || "Login failed";
      AppToast.failed(msg);
    },
    onSettled: () => setLoadingOverlay(false),
  });

  const handleLogin = () => {
    if (!form.email || !form.password) {
      AppToast.info("Enter email & password");
      return;
    }
    loginMutation.mutate();
  };

  const handleRegister = () => router.push(SIGN_UP);
  const handleSkip = () => skipLogin();

  return (
    <View className="flex-1 bg-white">
      <Image
        source={require("@/assets/images/onboarding/slide3.png")}
        className="absolute top-0 left-0 right-0 w-full"
        style={{ height: height * 0.5 }}
        resizeMode="cover"
      />

      <SafeAreaView className="flex-1" style={{ marginTop: height * 0.46 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1 px-11"
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <View className="flex-row items-center justify-center gap-3 mb-6">
              <TouchableOpacity
                className="relative p-3 rounded-full bg-transparent border border-[#0000001A]"
                onPress={handleSkip}
                disabled={loginMutation.isPending}
              >
                <SvgIcon Icon={DirectLeftIcon} size={16} color={"#000"} />
              </TouchableOpacity>
              <Text className="text-2xl text-primary font-jost-bold">
                Log in
              </Text>
            </View>

            <View>
              <Text className="mb-1 text-xs text-primary font-jost-medium">
                Account
              </Text>
              <TextInput
                placeholder="Enter your E-mail or member id"
                placeholderTextColor="#828282"
                keyboardType="email-address"
                autoCapitalize="none"
                className="p-3 mb-4 text-xs border-[0.46px] border-[#DEE2E6] rounded-md font-jost bg-white"
                value={form.email}
                onChangeText={(text) => setForm((p) => ({ ...p, email: text }))}
              />
            </View>

            <View>
              <Text className="mb-1 text-xs text-primary font-jost-medium">
                Password
              </Text>
              <TextInput
                placeholder="Enter password"
                placeholderTextColor="#828282"
                secureTextEntry
                className="p-3 mb-3 text-xs border-[0.46px] border-[#DEE2E6] rounded-md font-jost bg-white"
                value={form.password}
                onChangeText={(text) =>
                  setForm((p) => ({ ...p, password: text }))
                }
              />
            </View>

            <View className="items-center w-full mt-4">
              <TouchableOpacity
                disabled={loginMutation.isPending}
                onPress={() =>
                  router.push({
                    pathname: FORGOT_PASSWORD,
                    params: { email: form.email },
                  })
                }
              >
                <Text className="text-xs underline mb-7 text-primary font-jost-medium">
                  Forgot password?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogin}
                disabled={loginMutation.isPending}
                className={`py-4 w-full rounded mb-8 ${
                  loginMutation.isPending ? "bg-background" : "bg-black"
                }`}
              >
                <Text className="text-base text-center text-white font-jost-medium">
                  {loginMutation.isPending ? "Signing In..." : "Sign in"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="items-center">
              <Text className="mb-4 text-[9px] text-center text-primary font-jost-medium">
                Sign up with:
              </Text>

              <View className="flex-row justify-between w-full gap-6 px-12 mb-10">
                <View>
                  <Image
                    source={require("@/assets/images/social/facebook.png")}
                    className="w-16 h-16 rounded-md"
                  />
                </View>

                <View className="">
                  <Image
                    source={require("@/assets/images/social/google.png")}
                    className="w-16 h-16 rounded-md"
                  />
                </View>

                <View>
                  <Image
                    source={require("@/assets/images/social/linkedin.png")}
                    className="w-16 h-16 rounded-md"
                  />
                </View>
              </View>
            </View>

            <View className="gap-3 mb-8">
              <TouchableOpacity
                onPress={handleRegister}
                disabled={loginMutation.isPending}
              >
                <Text className="text-base text-center underline font-jost-semibold text-primary">
                  Create Account
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSkip}
                disabled={loginMutation.isPending}
              >
                <Text className="text-base text-center underline font-jost text-secondary">
                  Skip for now ?
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {loadingOverlay && (
        <View className="absolute inset-0 items-center justify-center bg-black/20">
          <AppLoader />
        </View>
      )}
    </View>
  );
}
