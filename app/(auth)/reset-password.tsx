import AppLoader from "@/components/common/AppLoader";
import { FORGOT_PASSWORD, SIGN_IN } from "@/constants/urls";
import { AuthService } from "@/services/api";
import {
  IRequestPasswordResetPayload,
  IVerifyPasswordResetPayload,
} from "@/services/auth/auth.types";
import { AppToast } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

const OTP_LENGTH = 4;
const RESEND_INTERVAL = 60;

type FormState = {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
};

export default function ResetPassword() {
  const params = useLocalSearchParams<{ email?: string }>();
  const [form, setForm] = useState<FormState>({
    email: typeof params.email === "string" ? params.email : "",
    code: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_INTERVAL);
  const hiddenInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (typeof params.email === "string") {
      setForm((prev) => ({ ...prev, email: params.email as string }));
    }
  }, [params.email]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(
      () => setResendTimer((prev) => (prev > 0 ? prev - 1 : 0)),
      1000
    );
    return () => clearInterval(timer);
  }, [resendTimer]);

  const updateForm = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCodeChange = (text: string) => {
    const clean = text.replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
    updateForm("code", clean);
  };

  const canSubmit =
    !!form.email.trim() &&
    form.code.length === OTP_LENGTH &&
    !!form.password &&
    !!form.confirmPassword &&
    form.password === form.confirmPassword;

  const resendDisabled = resendTimer > 0 || form.email.trim().length === 0;

  const verifyMutation = useMutation({
    mutationFn: (payload: IVerifyPasswordResetPayload) =>
      AuthService.verifyPasswordResetCode(payload),
    onMutate: () => setLoadingOverlay(true),
    onSuccess: (res) => {
      AppToast.success(res?.message || "Password reset successful");
      router.push({
        pathname: SIGN_IN,
        params: { fromOnboarding: "true" },
      });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.error || err?.message || "Password reset failed";
      AppToast.failed(msg);
    },
    onSettled: () => setLoadingOverlay(false),
  });

  const resendMutation = useMutation({
    mutationFn: (payload: IRequestPasswordResetPayload) =>
      AuthService.requestPasswordReset(payload),
    onSuccess: (res) => {
      AppToast.success(res?.message || "Reset code resent");
      setResendTimer(RESEND_INTERVAL);
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.error || err?.message || "Unable to resend code";
      AppToast.failed(msg);
    },
  });

  const handleSubmit = () => {
    if (!canSubmit) {
      AppToast.info("Complete the form to reset your password");
      return;
    }

    if (verifyMutation.isPending) return;

    const payload: IVerifyPasswordResetPayload = {
      email: form.email.trim(),
      code: form.code,
      newPassword: form.password,
    };

    verifyMutation.mutate(payload);
  };

  const handleResend = () => {
    if (resendDisabled || resendMutation.isPending) return;

    resendMutation.mutate({ email: form.email.trim() });
  };

  const renderOtpBoxes = () => (
    <View className="flex-row items-center justify-between gap-3">
      {Array.from({ length: OTP_LENGTH }).map((_, idx) => {
        const digit = form.code[idx] ?? "";
        const isFilled = digit !== "";
        return (
          <TouchableOpacity
            key={`reset-otp-${idx}`}
            onPress={() => hiddenInputRef.current?.focus()}
            activeOpacity={0.8}
            className={`flex-1 items-center justify-center rounded border ${
              isFilled ? "border-primary" : "border-[#DEE2E6]"
            } h-14 bg-white`}
          >
            <Text className="text-xl font-jost-medium text-primary">
              {digit}
            </Text>
          </TouchableOpacity>
        );
      })}
      <TextInput
        ref={hiddenInputRef}
        value={form.code}
        onChangeText={handleCodeChange}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        maxLength={OTP_LENGTH}
        autoFocus
        style={{ position: "absolute", opacity: 0, height: 1, width: 1 }}
      />
    </View>
  );

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
          <Text className="mt-10 text-2xl text-center text-primary font-jost-bold">
            Reset password
          </Text>
          <Text className="mt-3 text-xs text-center text-secondary font-jost">
            Enter the code we emailed you along with your new password.
          </Text>

          <View className="gap-6 mt-16">
            <View className="gap-2">
              <Text className="text-sm text-gray-700 font-jost-medium">
                Email
              </Text>
              <TextInput
                placeholder="eg. name@domain.com"
                placeholderTextColor="#9CA3AF"
                className="px-4 py-3 text-xs bg-white border-[0.34px] border-[#DEE2E6] rounded font-jost text-[#aaa]"
                autoCapitalize="none"
                keyboardType="email-address"
                value={form.email}
                onChangeText={(text) => updateForm("email", text)}
                editable={false}
                selectTextOnFocus={false}
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm text-gray-700 font-jost-medium">
                OTP Code
              </Text>
              {renderOtpBoxes()}
              <TouchableOpacity
                onPress={handleResend}
                disabled={resendDisabled || resendMutation.isPending}
                className="mt-2"
              >
                <Text className="text-xs text-right text-primary font-jost-medium">
                  {resendMutation.isPending
                    ? "Sending..."
                    : resendTimer > 0
                      ? `Request new code in ${resendTimer}s`
                      : "Request new code"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="gap-2">
              <Text className="text-sm text-gray-700 font-jost-medium">
                New Password
              </Text>
              <View className="relative">
                <TextInput
                  placeholder="Enter new password"
                  placeholderTextColor="#9CA3AF"
                  className="px-4 py-3 text-xs bg-white border-[0.34px] border-[#DEE2E6] rounded font-jost"
                  secureTextEntry={!showPassword}
                  value={form.password}
                  onChangeText={(text) => updateForm("password", text)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((prev) => !prev)}
                  className="absolute -translate-y-1/2 right-4 top-1/2"
                >
                  <Text className="text-xs text-primary font-jost-medium">
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="gap-2">
              <Text className="text-sm text-gray-700 font-jost-medium">
                Confirm Password
              </Text>
              <View className="relative">
                <TextInput
                  placeholder="Re-enter new password"
                  placeholderTextColor="#9CA3AF"
                  className="px-4 py-3 text-xs bg-white border-[0.34px] border-[#DEE2E6] rounded font-jost"
                  secureTextEntry={!showPassword}
                  value={form.confirmPassword}
                  onChangeText={(text) => updateForm("confirmPassword", text)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((prev) => !prev)}
                  className="absolute -translate-y-1/2 right-4 top-1/2"
                >
                  <Text className="text-xs text-primary font-jost-medium">
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!canSubmit || verifyMutation.isPending}
              className={`w-full rounded py-4 ${
                canSubmit ? "bg-black" : "bg-gray-200"
              } ${verifyMutation.isPending ? "opacity-90" : ""}`}
            >
              <Text className="text-base text-center text-white font-jost-medium">
                {verifyMutation.isPending ? "Updating..." : "Reset password"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace(FORGOT_PASSWORD)}
              className="mt-2"
            >
              <Text className="text-xs text-center underline text-primary font-jost-medium">
                Back to Forgot Password
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace(SIGN_IN)}
              className="mt-1"
            >
              <Text className="text-xs text-center underline text-secondary font-jost-medium">
                Return to Login
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
