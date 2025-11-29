import AppLoader from "@/components/common/AppLoader";
import OtpInput from "@/components/common/OtpInput";
import {
  BodyText,
  Heading,
  LinkButton,
  PrimaryButton,
  SecondaryButton,
} from "@/components/ui";
import SafeContainer from "@/components/ui/layout/safe-container";
import { SIGN_IN, TABS_PROTECTED } from "@/constants/urls";
import { useAuth } from "@/providers/auth";
import { useThemedStyles } from "@/providers/theme";
import { AuthService } from "@/services/api";
import {
  IResendSignupOtpPayload,
  IVerifySignupOtpPayload,
} from "@/services/auth/auth.types";
import { AppToast } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { InferType, object, string } from "yup";

const OTP_LENGTH = 4;
const RESEND_INTERVAL = 60;

const verifyOtpSchema = object({
  email: string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
  otp: string()
    .trim()
    .matches(/^[0-9]+$/, "OTP must be digits")
    .length(OTP_LENGTH, `Enter the ${OTP_LENGTH}-digit code`)
    .required("OTP is required"),
});

type VerifyOtpFormValues = InferType<typeof verifyOtpSchema>;

export default function VerifyOtp() {
  const theme = useThemedStyles();
  const params = useLocalSearchParams<{ email?: string }>();
  const { login } = useAuth();
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_INTERVAL);
  const hiddenInputRef = useRef<TextInput>(null);
  const formik = useFormik<VerifyOtpFormValues>({
    enableReinitialize: true,
    initialValues: {
      email: typeof params.email === "string" ? params.email : "",
      otp: "",
    },
    validationSchema: verifyOtpSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      if (verifyMutation.isPending) return;
      const payload: IVerifySignupOtpPayload = {
        email: values.email.trim(),
        code: values.otp,
      };
      verifyMutation.mutate(payload);
    },
  });

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(
      () => setResendTimer((prev) => (prev > 0 ? prev - 1 : 0)),
      1000
    );
    return () => clearInterval(timer);
  }, [resendTimer]);

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

  const handleResend = () => {
    if (resendTimer > 0 || resendMutation.isPending) return;

    const email = formik.values.email.trim();
    if (!email) {
      AppToast.info("Enter your email to receive a new OTP");
      return;
    }

    const payload: IResendSignupOtpPayload = { email };
    resendMutation.mutate(payload);
  };

  const handleOtpChange = (value: string) => {
    formik.setFieldValue("otp", value);
    if (!formik.touched.otp) {
      formik.setFieldTouched("otp", true, false);
    }
  };

  return (
    <SafeContainer padding="sm" gap="md" className={`${theme.pageBg} flex-1`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mt-10">
            <Heading level="h1" align="center" weight="bold" tone={theme.headingTone}>
              Verify account
            </Heading>
            <BodyText size="sm" align="center" tone={theme.labelTone}>
              Paste or type the {OTP_LENGTH}-digit code sent to your email. You
              can request another code after the timer ends.
            </BodyText>
            <BodyText
              align="center"
              size="md"
              weight="medium"
              tone={theme.headingTone}
            >
              ({formik.values.email})
            </BodyText>
          </View>

          <View className="gap-4 mt-14">
            <View className="flex-row flex-wrap items-start gap-1">
              <BodyText
                size="sm"
                tone={theme.headingTone}
                className="flex-1 w-32"
                weight="medium"
              >
                * OTP
              </BodyText>
              <View className="flex-2 min-w-[225px] gap-2">
                <OtpInput
                  length={OTP_LENGTH}
                  value={formik.values.otp}
                  onChange={handleOtpChange}
                  inputRef={hiddenInputRef}
                  onPress={() => hiddenInputRef.current?.focus()}
                />
                {formik.touched.otp && formik.errors.otp ? (
                  <Text className="mt-2 text-xs text-red-500 font-jost">
                    {formik.errors.otp}
                  </Text>
                ) : (
                  <BodyText size="sm" align="right" tone={theme.labelTone}>
                    {resendTimer > 0
                      ? `Request new OTP in ${resendTimer}s`
                      : "You can request a new OTP now."}
                  </BodyText>
                )}
              </View>
            </View>

            <PrimaryButton
              title="Verify Account"
              onPress={formik.handleSubmit as () => void}
              loading={verifyMutation.isPending}
              loadingText="Verifying..."
              disabled={!formik.isValid}
              className={`${theme.primaryButtonClass} mt-4`}
              textClassName={theme.primaryTextClassInverse}
              spinnerColor={theme.primarySpinnerColor}
            />

            <SecondaryButton
              title={
                resendTimer > 0
                  ? `Request new OTP in ${resendTimer}s`
                  : "Request new OTP"
              }
              onPress={handleResend}
              disabled={resendTimer > 0 || resendMutation.isPending}
              loading={resendMutation.isPending}
              loadingText="Sending..."
              className={theme.secondaryButtonClass}
              textClassName={theme.secondaryTextClass}
              spinnerColor={theme.secondarySpinnerColor}
            />
          </View>

          <View className="mt-4">
            <LinkButton
              title="Back to Login"
              onPress={() => router.replace(SIGN_IN)}
              textClassName={theme.linkTextClass}
              spinnerColor={theme.linkSpinnerColor}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {loadingOverlay && (
        <View className="absolute inset-0 items-center justify-center bg-black/20">
          <AppLoader />
        </View>
      )}
    </SafeContainer>
  );
}
