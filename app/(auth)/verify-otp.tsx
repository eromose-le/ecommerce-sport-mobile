import AppLoader from "@/components/common/AppLoader";
import { SIGN_IN, TABS_PROTECTED } from "@/constants/urls";
import { useAuth } from "@/providers/auth";
import { AuthService } from "@/services/api";
import {
  IResendSignupOtpPayload,
  IVerifySignupOtpPayload,
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
  otp: string;
};

export default function VerifyOtp() {
  const params = useLocalSearchParams<{ email?: string }>();
  const { login } = useAuth();
  const [form, setForm] = useState<FormState>({
    email: typeof params.email === "string" ? params.email : "",
    otp: "",
  });
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

  const handleOtpChange = (text: string) => {
    const clean = text.replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
    setForm((prev) => ({ ...prev, otp: clean }));
  };

  const updateEmail = (text: string) => {
    setForm((prev) => ({ ...prev, email: text }));
  };

  const canSubmit =
    form.email.trim().length > 0 && form.otp.length === OTP_LENGTH;

  const verifyMutation = useMutation({
    mutationFn: (payload: IVerifySignupOtpPayload) =>
      AuthService.verifySignupOtp(payload),
    onMutate: () => setLoadingOverlay(true),
    onSuccess: async (res) => {
      AppToast.success(res?.message || "Account verified successfully");
      if (res?.data) {
        await login(res.data);
        router.replace(TABS_PROTECTED);
      } else {
        router.replace(SIGN_IN);
      }
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.error || err?.message || "OTP verification failed";
      AppToast.failed(msg);
    },
    onSettled: () => setLoadingOverlay(false),
  });

  const resendMutation = useMutation({
    mutationFn: (payload: IResendSignupOtpPayload) =>
      AuthService.resendSignupOtp(payload),
    onSuccess: (res) => {
      AppToast.success(res?.message || "OTP sent successfully");
      setResendTimer(RESEND_INTERVAL);
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.error || err?.message || "Unable to resend OTP";
      AppToast.failed(msg);
    },
  });

  const handleVerify = () => {
    if (!canSubmit || verifyMutation.isPending) {
      if (!canSubmit) {
        AppToast.info("Enter the OTP to continue");
      }
      return;
    }

    const payload: IVerifySignupOtpPayload = {
      email: form.email.trim(),
      code: form.otp,
    };

    verifyMutation.mutate(payload);
  };

  const handleResend = () => {
    if (resendTimer > 0 || resendMutation.isPending) return;

    const email = form.email.trim();
    if (!email) {
      AppToast.info("Enter your email to receive a new OTP");
      return;
    }

    const payload: IResendSignupOtpPayload = { email };
    resendMutation.mutate(payload);
  };

  const renderOtpBoxes = () => (
    <View className="flex-row items-center justify-between gap-3">
      {Array.from({ length: OTP_LENGTH }).map((_, idx) => {
        const digit = form.otp[idx] ?? "";
        const isFilled = digit !== "";
        return (
          <TouchableOpacity
            key={`otp-${idx}`}
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
        value={form.otp}
        onChangeText={handleOtpChange}
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
            Verify account
          </Text>
          <Text className="mt-3 text-xs text-center text-secondary font-jost">
            Paste or type the {OTP_LENGTH}-digit code sent to your email. You
            can request another code after the timer ends.
          </Text>

          <View className="gap-4 mt-16">
            <View className="flex-row flex-wrap items-start gap-4">
              <Text className="w-32 text-sm text-gray-600 font-jost-medium">
                * Email
              </Text>
              <TextInput
                placeholder="eg. name@domain.com"
                placeholderTextColor="#9CA3AF"
                className="flex-1 min-w-[220px] flex-row items-center justify-center px-4 py-3 text-xs bg-white border-[0.34px] border-[#DEE2E6] rounded font-jost h-[44px] text-[#aaa]"
                value={form.email}
                onChangeText={updateEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={false}
                selectTextOnFocus={false}
              />
            </View>

            <View className="flex-row flex-wrap items-start gap-4">
              <Text className="w-32 text-sm text-gray-600 font-jost-medium">
                * OTP
              </Text>
              <View className="flex-1 min-w-[220px]">
                {renderOtpBoxes()}
                <Text className="mt-2 text-xs text-secondary font-jost">
                  {resendTimer > 0
                    ? `Request new OTP in ${resendTimer}s`
                    : "You can request a new OTP now."}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleVerify}
              disabled={!canSubmit || verifyMutation.isPending}
              className={`w-full rounded mt-4 py-4 ${
                canSubmit ? "bg-black" : "bg-gray-200"
              } ${verifyMutation.isPending ? "opacity-90" : ""}`}
            >
              <Text
                className={`text-center text-base font-jost-medium ${
                  canSubmit ? "text-white" : "text-secondary"
                }`}
              >
                {verifyMutation.isPending ? "Verifying..." : "Verify Account"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleResend}
              disabled={resendTimer > 0 || resendMutation.isPending}
              className={`w-full rounded py-3 border border-[#DEE2E6] ${
                resendTimer > 0 || resendMutation.isPending
                  ? "bg-gray-100"
                  : "bg-white"
              }`}
            >
              <Text className="text-base text-center font-jost-medium text-primary">
                {resendMutation.isPending
                  ? "Sending..."
                  : resendTimer > 0
                    ? `Request new OTP in ${resendTimer}s`
                    : "Request new OTP"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.replace(SIGN_IN)}
            className="mt-6"
          >
            <Text className="text-base text-center underline text-primary font-jost-medium">
              Back to Login
            </Text>
          </TouchableOpacity>
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
