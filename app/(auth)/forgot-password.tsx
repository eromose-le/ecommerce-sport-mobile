import AppLoader from "@/components/common/AppLoader";
import LabeledInput from "@/components/common/LabeledInput";
import { BodyText, Heading, LinkButton, PrimaryButton } from "@/components/ui";
import SafeContainer from "@/components/ui/layout/safe-container";
import { RESET_PASSWORD, SIGN_IN } from "@/constants/urls";
import { useThemedStyles } from "@/providers/theme";
import { AuthService } from "@/services/api";
import { IRequestPasswordResetPayload } from "@/services/auth/auth.types";
import { AppToast } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useFormik } from "formik";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { InferType, object, string } from "yup";

const forgotPasswordSchema = object({
  email: string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
});

type ForgotPasswordFormValues = InferType<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const theme = useThemedStyles();
  const params = useLocalSearchParams<{ email?: string }>();
  const [loadingOverlay, setLoadingOverlay] = useState(false);

  const requestMutation = useMutation({
    mutationFn: (payload: IRequestPasswordResetPayload) =>
      AuthService.requestPasswordReset(payload),
    onMutate: () => setLoadingOverlay(true),
    onSuccess: (res, variables) => {
      const targetEmail = res?.data?.email || variables?.email || "";
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

  const formik = useFormik<ForgotPasswordFormValues>({
    enableReinitialize: true,
    initialValues: {
      email: typeof params.email === "string" ? params.email : "",
    },
    validationSchema: forgotPasswordSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      requestMutation.mutate({ email: values.email.trim() });
    },
  });

  const handleSubmit = () => formik.handleSubmit();

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
              Forgot password
            </Heading>

            <BodyText size="sm" align="center" tone={theme.labelTone}>
              Enter the email associated with your account and we&apos;ll email
              you a reset code.
            </BodyText>
          </View>

          <View className="gap-3 mt-14">
            <LabeledInput
              label="Email"
              placeholder="eg. name@domain.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={formik.values.email}
              onChangeText={formik.handleChange("email")}
              onBlur={formik.handleBlur("email")}
              error={formik.touched.email ? formik.errors.email : undefined}
            />

            <View className="items-center w-full gap-2 mt-4">
              <PrimaryButton
                title="Send code"
                onPress={handleSubmit}
                loading={requestMutation.isPending}
                loadingText="Sending..."
                disabled={!formik.isValid}
                className={`${theme.primaryButtonClass} w-full`}
                textClassName={theme.primaryTextClassInverse}
                spinnerColor={theme.primarySpinnerColor}
              />

              <LinkButton
                title="Back to Login"
                onPress={() =>
                  router.push({
                    pathname: SIGN_IN,
                    params: { fromOnboarding: "true" },
                  })
                }
                textClassName={theme.linkTextClass}
                spinnerColor={theme.linkSpinnerColor}
              />
            </View>
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
