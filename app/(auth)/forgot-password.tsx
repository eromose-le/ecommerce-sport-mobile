import AppLoader from "@/components/common/AppLoader";
import { RESET_PASSWORD, SIGN_IN } from "@/constants/urls";
import { AuthService } from "@/services/api";
import { IRequestPasswordResetPayload } from "@/services/auth/auth.types";
import { AppToast } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loadingOverlay, setLoadingOverlay] = useState(false);

  const requestMutation = useMutation({
    mutationFn: (payload: IRequestPasswordResetPayload) =>
      AuthService.requestPasswordReset(payload),
    onMutate: () => setLoadingOverlay(true),
    onSuccess: (res) => {
      const targetEmail = res?.data?.email || email;
      AppToast.success(res?.message || "Reset code sent to your email");
      router.push({
        pathname: RESET_PASSWORD,
        params: { email: targetEmail },
      });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Unable to send reset code";
      AppToast.failed(msg);
    },
    onSettled: () => setLoadingOverlay(false),
  });

  const handleSubmit = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      AppToast.info("Enter your email");
      return;
    }
    if (requestMutation.isPending) return;

    requestMutation.mutate({ email: trimmedEmail });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mt-16">
            <Text className="text-2xl text-center text-primary font-jost-bold">
              Forgot password
            </Text>
            <Text className="mt-3 text-xs text-center text-secondary font-jost">
              Enter the email associated with your account and we&apos;ll email
              you a reset code.
            </Text>
          </View>

          <View className="gap-3 mt-16">
            <Text className="text-sm text-gray-700 font-jost-medium">
              Email
            </Text>
            <TextInput
              placeholder="eg. name@domain.com"
              placeholderTextColor="#9CA3AF"
              className="px-4 py-3 text-xs bg-white border-[0.34px] border-[#DEE2E6] rounded font-jost"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={requestMutation.isPending}
              className={`w-full rounded mt-6 py-4 ${
                requestMutation.isPending ? "bg-gray-200" : "bg-black"
              }`}
            >
              <Text className="text-base text-center text-white font-jost-medium">
                {requestMutation.isPending ? "Sending..." : "Send code"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace(SIGN_IN)}
              className="mt-4"
            >
              <Text className="text-base text-center underline text-primary font-jost-medium">
                Back to Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {loadingOverlay && (
        <View className="absolute inset-0 items-center justify-center bg-black/20">
          <AppLoader />
        </View>
      )}
    </SafeAreaView>
  );
}
