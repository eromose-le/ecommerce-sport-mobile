import AppLoader from "@/components/common/AppLoader";
import PasswordField from "@/components/common/PasswordField";
import {
  BodyText,
  Heading,
  LinkButton,
  PrimaryButton,
  SecondaryButton,
} from "@/components/ui";
import SafeContainer from "@/components/ui/layout/safe-container";
import { FORGOT_PASSWORD, SIGN_IN } from "@/constants/urls";
import { useThemedStyles } from "@/providers/theme";
import { AuthService } from "@/services/api";
import {
  IRequestPasswordResetPayload,
  IVerifyPasswordResetPayload,
} from "@/services/auth/auth.types";
import { Logger } from "@/utils/logger";
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
import { InferType, object, ref, string } from "yup";

const OTP_LENGTH = 4;
const RESEND_INTERVAL = 60;

const resetPasswordSchema = object({
  email: string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
  code: string()
    .trim()
    .length(OTP_LENGTH, `Enter the ${OTP_LENGTH}-digit code`)
    .required("Enter the code we sent"),
  password: string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: string()
    .oneOf([ref("password")], "Passwords must match")
    .required("Confirm your new password"),
});

type ResetPasswordFormValues = InferType<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const theme = useThemedStyles();
  const params = useLocalSearchParams<{ email?: string }>();
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_INTERVAL);
  const hiddenInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(
      () => setResendTimer((prev) => (prev > 0 ? prev - 1 : 0)),
      1000
    );
    return () => clearInterval(timer);
  }, [resendTimer]);

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

  const formik = useFormik<ResetPasswordFormValues>({
    enableReinitialize: true,
    initialValues: {
      email: typeof params.email === "string" ? params.email : "",
      code: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      if (verifyMutation.isPending) return;
      const payload: IVerifyPasswordResetPayload = {
        email: values.email.trim(),
        code: values.code,
        newPassword: values.password,
      };
      verifyMutation.mutate(payload);
    },
  });

  const resendDisabled =
    resendTimer > 0 || formik.values.email.trim().length === 0;

  const handleCodeChange = (text: string) => {
    const clean = text.replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
    formik.setFieldValue("code", clean);
    formik.setFieldTouched("code", true, false);
  };

  const handleSubmit = () => formik.handleSubmit();

  const handleResend = () => {
    if (resendDisabled || resendMutation.isPending) return;

    resendMutation.mutate({ email: formik.values.email.trim() });
  };

  const renderOtpBoxes = () => (
    <View className="flex-row items-center justify-between gap-3">
      {Array.from({ length: OTP_LENGTH }).map((_, idx) => {
        const digit = formik.values.code[idx] ?? "";
        const isFilled = digit !== "";

        return (
          <SecondaryButton
            title={digit}
            key={`reset-otp-${idx}`}
            onPress={() => hiddenInputRef.current?.focus()}
            className={`flex-1 items-center justify-center rounded border ${
              isFilled ? "border-primary" : "border-[#DEE2E6]"
            } h-14 bg-white`}
          />
        );
      })}
      <TextInput
        ref={hiddenInputRef}
        value={formik.values.code}
        onChangeText={handleCodeChange}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        maxLength={OTP_LENGTH}
        autoFocus
        style={{ position: "absolute", opacity: 0, height: 1, width: 1 }}
      />
    </View>
  );

  Logger.warn("formik", formik.values);

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
            <Heading level="h1" align="center" weight="bold">
              Reset password
            </Heading>
            <BodyText size="sm" align="center" tone={theme.labelTone}>
              Enter the code we emailed you along with your new password.
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

          <View className="gap-6 mt-14">
            <View className="gap-2">
              <BodyText
                size="sm"
                tone={theme.headingTone}
                className="flex-1 w-32"
                weight="medium"
              >
                OTP Code
              </BodyText>
              {renderOtpBoxes()}
              {formik.touched.code && formik.errors.code ? (
                <Text className="text-xs text-red-500 font-jost">
                  {formik.errors.code}
                </Text>
              ) : null}
              <View className="flex-row mt-0 ml-auto w-fit">
                <LinkButton
                  title={
                    resendMutation.isPending
                      ? "Sending..."
                      : resendTimer > 0
                        ? `Request new code in ${resendTimer}s`
                        : "Request new code"
                  }
                  onPress={handleResend}
                  disabled={resendDisabled || resendMutation.isPending}
                  textClassName={theme.linkTextClass}
                  spinnerColor={theme.linkSpinnerColor}
                />
              </View>
            </View>

            <View className="gap-2">
              <PasswordField
                label="New Password"
                hideLabel
                placeholder="Enter new password"
                value={formik.values.password}
                onChangeText={formik.handleChange("password")}
                onBlur={formik.handleBlur("password")}
                error={
                  formik.touched.password ? formik.errors.password : undefined
                }
              />
            </View>

            <View className="gap-2">
              <PasswordField
                label="Confirm Password"
                hideLabel
                placeholder="Re-enter new password"
                value={formik.values.confirmPassword}
                onChangeText={formik.handleChange("confirmPassword")}
                onBlur={formik.handleBlur("confirmPassword")}
                error={
                  formik.touched.confirmPassword
                    ? formik.errors.confirmPassword
                    : undefined
                }
              />
            </View>

            <PrimaryButton
              title="Reset password"
              onPress={handleSubmit}
              loading={verifyMutation.isPending}
              loadingText="Updating..."
              disabled={!formik.isValid}
              className={theme.primaryButtonClass}
              textClassName={theme.primaryTextClassInverse}
              spinnerColor={theme.primarySpinnerColor}
            />

            <LinkButton
              title="Back to Forgot Password"
              onPress={() => router.replace(FORGOT_PASSWORD)}
              textClassName={theme.linkTextClass}
              spinnerColor={theme.linkSpinnerColor}
            />

            <LinkButton
              title="Return to Login"
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
