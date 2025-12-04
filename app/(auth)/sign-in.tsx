import DirectLeftIcon from "@/assets/icons/direct-left.svg";
import AppLoader from "@/components/common/AppLoader";
import PasswordField from "@/components/common/PasswordField";
import { SvgIcon } from "@/components/common/SvgIcon";
import TextField from "@/components/common/TextField";
import { BodyText, LinkButton, PrimaryButton } from "@/components/ui";
import SafeContainer from "@/components/ui/layout/safe-container";
import {
  FORGOT_PASSWORD,
  ON_BOARDING,
  SIGN_UP,
  TABS_PROTECTED,
  TABS_PUBLIC,
} from "@/constants/urls";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useAuth } from "@/providers/auth";
import { useThemedStyles } from "@/providers/theme";
import { AuthService } from "@/services/api";
import { ILoginUserPayload } from "@/services/auth/auth.types";
import { User } from "@/services/user/user.types";
import { Logger } from "@/utils/logger";
import { AppToast } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import { InferType, object, string } from "yup";

const { height } = Dimensions.get("window");
const HEADER_EXPANDED_HEIGHT = height * 0.4;
const HEADER_COLLAPSED_HEIGHT = height * 0.15;
const FORM_OFFSET_EXPANDED = height * 0.38;
const FORM_OFFSET_COLLAPSED = height * 0.13;

const signInSchema = object({
  email: string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

type SignInFormValues = InferType<typeof signInSchema>;

export default function SignIn() {
  const theme = useThemedStyles();
  const params = useLocalSearchParams<{ fromOnboarding?: string }>();
  const cameFromOnboarding = params?.fromOnboarding === "true";
  const { login, user, skipLogin } = useAuth();
  const { isFreshUser, isGuest } = useAuthUser();
  const imageHeight = useRef(
    new Animated.Value(HEADER_EXPANDED_HEIGHT)
  ).current;
  const formOffset = imageHeight.interpolate({
    inputRange: [HEADER_COLLAPSED_HEIGHT, HEADER_EXPANDED_HEIGHT],
    outputRange: [FORM_OFFSET_COLLAPSED, FORM_OFFSET_EXPANDED],
    extrapolate: "clamp",
  });
  const keyboardVisible = useRef(false);

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
    mutationFn: (payload: ILoginUserPayload) => AuthService.loginUser(payload),
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

  const formik = useFormik<SignInFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: signInSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      const payload: ILoginUserPayload = {
        email: values.email.trim(),
        password: values.password,
      };
      loginMutation.mutate(payload);
    },
  });

  const handleLogin = () => formik.handleSubmit();

  const handleRegister = () => router.push(SIGN_UP);
  const handleSkip = () => skipLogin();

  Logger.warn("formik", formik.values);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const handleKeyboardChange = (visible: boolean) => {
      if (keyboardVisible.current === visible) return;
      keyboardVisible.current = visible;
      Animated.timing(imageHeight, {
        toValue: visible ? HEADER_COLLAPSED_HEIGHT : HEADER_EXPANDED_HEIGHT,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    };

    const showListener = Keyboard.addListener(showEvent, () =>
      handleKeyboardChange(true)
    );
    const hideListener = Keyboard.addListener(hideEvent, () =>
      handleKeyboardChange(false)
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [imageHeight]);

  return (
    <View className={`flex-1 ${theme.pageBg}`}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <Animated.Image
        source={require("@/assets/images/onboarding/slide3.png")}
        className="absolute top-0 left-0 right-0 w-full"
        style={{ height: imageHeight }}
        resizeMode="cover"
      />

      <Animated.View style={{ marginTop: formOffset, flex: 1 }}>
        <SafeContainer
          padding="sm"
          gap="md"
          className={`${theme.pageBg} flex-1`}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1"
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              className="flex-1 px-11"
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              <View className="flex-row items-center justify-center gap-3 mb-6">
                <TouchableOpacity
                  className={`relative p-3 rounded-full bg-transparent border ${theme.primaryBorderColor}`}
                  onPress={handleSkip}
                  disabled={loginMutation.isPending}
                >
                  <SvgIcon
                    Icon={DirectLeftIcon}
                    size={16}
                    color={theme.primarySpinnerColor}
                  />
                </TouchableOpacity>
                <BodyText size="lg" weight="bold" tone={theme.headingTone}>
                  Log in
                </BodyText>
              </View>

              <View className="gap-3">
                <TextField
                  label="Email"
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formik.values.email}
                  onChangeText={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                  error={formik.touched.email ? formik.errors.email : undefined}
                />
                <PasswordField
                  label="Password"
                  placeholder="******"
                  value={formik.values.password}
                  onChangeText={formik.handleChange("password")}
                  onBlur={formik.handleBlur("password")}
                  error={
                    formik.touched.password ? formik.errors.password : undefined
                  }
                />
              </View>

              <View className="items-center w-full gap-2 mt-8">
                <PrimaryButton
                  title="Sign in"
                  onPress={handleLogin}
                  loading={loginMutation.isPending}
                  loadingText="Signing In..."
                  disabled={!formik.isValid}
                  className={`${theme.primaryButtonClass} w-full`}
                  textClassName={theme.primaryTextClassInverse}
                  spinnerColor={theme.primarySpinnerColor}
                />
                <LinkButton
                  title="Forgot password ?"
                  disabled={loginMutation.isPending}
                  onPress={() =>
                    router.push({
                      pathname: FORGOT_PASSWORD,
                      params: { email: formik.values.email.trim() },
                    })
                  }
                  textClassName={theme.linkTextClass}
                  spinnerColor={theme.linkSpinnerColor}
                />
              </View>

              <View className="items-center mt-1">
                <View className="mb-4">
                  <BodyText
                    size="xs"
                    align="center"
                    weight="medium"
                    tone={theme.labelTone}
                  >
                    Sign up with:
                  </BodyText>
                </View>

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

              <View className="flex-row items-center justify-center gap-3 mb-8">
                <LinkButton
                  title="Create Account"
                  onPress={handleRegister}
                  disabled={loginMutation.isPending}
                  textClassName={theme.linkTextClass}
                  spinnerColor={theme.linkSpinnerColor}
                />
                <LinkButton
                  title="Skip for now?"
                  onPress={handleSkip}
                  disabled={loginMutation.isPending}
                  textClassName={theme.linkTextClass}
                  spinnerColor={theme.linkSpinnerColor}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeContainer>
      </Animated.View>

      {loadingOverlay && (
        <View className="absolute inset-0 items-center justify-center bg-black/20">
          <AppLoader />
        </View>
      )}
    </View>
  );
}
