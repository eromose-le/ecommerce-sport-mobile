import AppLoader from "@/components/common/AppLoader";
import LabeledInput from "@/components/common/LabeledInput";
import { LinkButton, PrimaryButton } from "@/components/ui";
import { RESET_PASSWORD, SIGN_IN } from "@/constants/urls";
import { AuthService } from "@/services/api";
import { IRequestPasswordResetPayload } from "@/services/auth/auth.types";
import { AppToast } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useFormik } from "formik";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InferType, object, string } from "yup";

const forgotPasswordSchema = object({
  email: string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
});

type ForgotPasswordFormValues = InferType<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
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

            <PrimaryButton
              title="Send code"
              onPress={handleSubmit}
              loading={requestMutation.isPending}
              loadingText="Sending..."
              disabled={!formik.isValid}
              className="mt-2"
            />

            <LinkButton
              title="Back to Login"
              onPress={() => router.replace(SIGN_IN)}
            />
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
