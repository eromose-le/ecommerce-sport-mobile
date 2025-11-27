import AppLoader from "@/components/common/AppLoader";
import PasswordField from "@/components/common/PasswordField";
import TextField from "@/components/common/TextField";
import { LinkButton, PrimaryButton } from "@/components/ui";
import { SIGN_IN, VERIFY_OTP } from "@/constants/urls";
import { AuthService } from "@/services/api";
import { ICreateUserPayload } from "@/services/auth/auth.types";
import { Logger } from "@/utils/logger";
import { AppToast } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useFormik } from "formik";
import { ReactNode, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { boolean, InferType, object, ref, string } from "yup";

type CountryOption = {
  label: string;
  value: string;
  dialCode: string;
  flag: string;
};

const COUNTRY_OPTIONS: CountryOption[] = [
  {
    label: "Nigeria",
    value: "NG",
    dialCode: "+234",
    flag: "https://flagcdn.com/w40/ng.png",
  },
  {
    label: "United States",
    value: "US",
    dialCode: "+1",
    flag: "https://flagcdn.com/w40/us.png",
  },
  {
    label: "United Kingdom",
    value: "GB",
    dialCode: "+44",
    flag: "https://flagcdn.com/w40/gb.png",
  },
  {
    label: "Canada",
    value: "CA",
    dialCode: "+1",
    flag: "https://flagcdn.com/w40/ca.png",
  },
];

const countrySchema = object({
  label: string().required(),
  value: string().required(),
  dialCode: string().required(),
  flag: string().required(),
});

const signUpSchema = object({
  email: string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: string()
    .oneOf([ref("password")], "Passwords must match")
    .required("Confirm your password"),
  address: string().trim().required("Address is required"),
  firstName: string().trim().required("First name is required"),
  lastName: string().trim().required("Last name is required"),
  phoneNumber: string()
    .trim()
    .matches(/^[0-9+\s()-]{6,}$/, "Enter a valid phone number")
    .required("Phone number is required"),
  agreeToTerms: boolean().oneOf([true], "You must agree to continue"),
  country: countrySchema.required(),
});

type SignUpFormValues = InferType<typeof signUpSchema>;

export default function SignUp() {
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [loadingOverlay, setLoadingOverlay] = useState(false);

  const registerMutation = useMutation({
    mutationFn: (payload: ICreateUserPayload) =>
      AuthService.registerUser(payload),
    onMutate: () => setLoadingOverlay(true),
    onSuccess: (res, variables) => {
      AppToast.success(
        res?.message || "Account created! Check your email for the OTP"
      );
      const emailParam = variables?.email || "";
      router.push({
        pathname: VERIFY_OTP,
        params: { email: emailParam },
      });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.error || err?.message || "Registration failed";
      AppToast.failed(msg);
    },
    onSettled: () => setLoadingOverlay(false),
  });

  const formik = useFormik<SignUpFormValues>({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      agreeToTerms: false,
      country: COUNTRY_OPTIONS[0],
    },
    validationSchema: signUpSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      if (registerMutation.isPending) return;
      const numericPhone = values.phoneNumber.replace(/[^0-9]/g, "");
      const payload: ICreateUserPayload = {
        email: values.email.trim(),
        password: values.password,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        address: values.address.trim(),
        phone: `${values.country.dialCode}${numericPhone}`,
      };
      registerMutation.mutate(payload);
    },
  });

  const handleRegister = () => formik.handleSubmit();

  const handleToggleTerms = () => {
    formik.setFieldTouched("agreeToTerms", true, false);
    formik.setFieldValue("agreeToTerms", !formik.values.agreeToTerms);
  };

  const selectedCountry = formik.values.country;

  const FieldRow = ({
    label,
    required = true,
    children,
  }: {
    label: string;
    required?: boolean;
    children: ReactNode;
  }) => (
    <View className="flex-row flex-wrap items-start gap-4">
      <Text className="w-32 text-sm text-gray-600 font-jost-medium">
        {required ? "* " : ""}
        {label}
      </Text>
      <View className="flex-1 min-w-[220px]">{children}</View>
    </View>
  );

  Logger.warn("formik", formik.values);

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
            Sign up
          </Text>

          <View className="gap-4 mt-16">
            <FieldRow label="Country / Region">
              <TouchableOpacity
                className="flex-row items-center justify-between px-4 py-3 bg-white border-[0.34px] border-[#DEE2E6] rounded"
                onPress={() => setCountryModalVisible(true)}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center gap-3">
                  <Image
                    source={{ uri: selectedCountry.flag }}
                    className="w-8 h-5 rounded-sm"
                    resizeMode="cover"
                  />
                  <Text className="text-xs text-primary font-jost-medium">
                    {selectedCountry.label}
                  </Text>
                </View>
                <Text className="text-xs text-primary">Change</Text>
              </TouchableOpacity>
            </FieldRow>

            <FieldRow label="Email">
              <TextField
                label="Email"
                hideLabel
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formik.values.email}
                onChangeText={formik.handleChange("email")}
                onBlur={formik.handleBlur("email")}
                error={formik.touched.email ? formik.errors.email : undefined}
              />
            </FieldRow>

            <FieldRow label="Login Password">
              <PasswordField
                label="Set login password"
                hideLabel
                placeholder="Set login password"
                value={formik.values.password}
                onChangeText={formik.handleChange("password")}
                onBlur={formik.handleBlur("password")}
                error={
                  formik.touched.password ? formik.errors.password : undefined
                }
              />
            </FieldRow>

            <FieldRow label="Confirm Password">
              <PasswordField
                label="Enter the login password again"
                hideLabel
                placeholder="Enter the login password again"
                value={formik.values.confirmPassword}
                onChangeText={formik.handleChange("confirmPassword")}
                onBlur={formik.handleBlur("confirmPassword")}
                error={
                  formik.touched.confirmPassword
                    ? formik.errors.confirmPassword
                    : undefined
                }
              />
            </FieldRow>

            <FieldRow label="Full Name">
              <View className="flex-row gap-3">
                <View className="flex-1 mb-0">
                  <TextField
                    label="First name"
                    hideLabel
                    placeholder="First name"
                    keyboardType="default"
                    autoCapitalize="none"
                    value={formik.values.firstName}
                    onChangeText={formik.handleChange("firstName")}
                    onBlur={formik.handleBlur("firstName")}
                    error={
                      formik.touched.firstName
                        ? formik.errors.firstName
                        : undefined
                    }
                  />
                </View>

                <View className="flex-1 mb-0">
                  <TextField
                    label="Last name"
                    hideLabel
                    placeholder="Last name"
                    keyboardType="default"
                    autoCapitalize="none"
                    value={formik.values.lastName}
                    onChangeText={formik.handleChange("lastName")}
                    onBlur={formik.handleBlur("lastName")}
                    error={
                      formik.touched.lastName
                        ? formik.errors.lastName
                        : undefined
                    }
                  />
                </View>
              </View>
            </FieldRow>

            <FieldRow label="Pick up location">
              <TextField
                label="Address"
                hideLabel
                placeholder="Please enter your address"
                keyboardType="default"
                autoCapitalize="none"
                value={formik.values.address}
                onChangeText={formik.handleChange("address")}
                onBlur={formik.handleBlur("address")}
                error={
                  formik.touched.address ? formik.errors.address : undefined
                }
              />
            </FieldRow>

            <FieldRow label="Tel">
              <View className="flex-row items-stretch gap-3">
                <View className="flex-1 max-w-[70px] mb-0">
                  <TextField
                    label="Contry code"
                    hideLabel
                    placeholder="Contry code"
                    keyboardType="phone-pad"
                    value={selectedCountry.dialCode.replace("+", "")}
                  />
                </View>

                <View className="flex-1 mb-0">
                  <TextField
                    label="Phone number"
                    hideLabel
                    placeholder="Phone number"
                    keyboardType="phone-pad"
                    value={formik.values.phoneNumber}
                    onChangeText={formik.handleChange("phoneNumber")}
                    onBlur={formik.handleBlur("phoneNumber")}
                    error={
                      formik.touched.phoneNumber
                        ? formik.errors.phoneNumber
                        : undefined
                    }
                  />
                </View>
              </View>
            </FieldRow>

            <View className="flex-row items-center justify-center gap-3 align-middle">
              <TouchableOpacity
                onPress={handleToggleTerms}
                className="items-center justify-center w-5 h-5 mt-1 border border-gray-300 rounded-full"
              >
                {formik.values.agreeToTerms && (
                  <View className="h-2.5 w-2.5 rounded-full bg-black" />
                )}
              </TouchableOpacity>
              <Text className="items-center justify-center flex-1 text-sm leading-6 align-middle text-secondary">
                I agree to (a)
                <Text className="text-primary font-jost-semibold">
                  {" "}
                  Free Membership Agreement
                </Text>
                , (b)
                <Text className="text-primary font-jost-semibold">
                  {" "}
                  Terms of Use
                </Text>
                , and (c)
                <Text className="text-primary font-jost-semibold">
                  {" "}
                  Privacy Policy
                </Text>
                . I agree to receive more information from sportygalaxy.com
                about its products and services.
              </Text>
            </View>
            {formik.touched.agreeToTerms && formik.errors.agreeToTerms ? (
              <Text className="text-xs text-red-500 font-jost">
                {formik.errors.agreeToTerms}
              </Text>
            ) : null}

            <PrimaryButton
              title="Agree and Register"
              onPress={handleRegister}
              loading={registerMutation.isPending}
              loadingText="Registering..."
              disabled={!formik.isValid}
              className="mt-4"
            />
          </View>

          <View className="mt-4">
            <LinkButton
              title="Login"
              onPress={() =>
                router.push({
                  pathname: SIGN_IN,
                  params: { fromOnboarding: "true" },
                })
              }
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={countryModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setCountryModalVisible(false)}
      >
        <View className="items-center justify-center flex-1 px-6 bg-black/40">
          <View className="w-full max-h-[70%] rounded-3xl bg-white p-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg text-gray-900 font-jost-bold">
                Select Country
              </Text>
              <TouchableOpacity onPress={() => setCountryModalVisible(false)}>
                <Text className="text-sm text-gray-500 font-jost">Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView className="divide-y divide-gray-100">
              {COUNTRY_OPTIONS.map((country) => {
                const isActive = country.value === selectedCountry.value;
                return (
                  <TouchableOpacity
                    key={country.value}
                    className="flex-row items-center justify-between py-3"
                    onPress={() => {
                      formik.setFieldValue("country", country);
                      setCountryModalVisible(false);
                    }}
                  >
                    <View className="flex-row items-center gap-3">
                      <Image
                        source={{ uri: country.flag }}
                        className="w-8 h-5 rounded-sm"
                      />
                      <View>
                        <Text className="text-base text-gray-900 font-jost">
                          {country.label}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          {country.dialCode}
                        </Text>
                      </View>
                    </View>
                    {isActive && (
                      <Text className="text-sm font-jost-medium text-primary">
                        Selected
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {loadingOverlay && (
        <View className="absolute inset-0 items-center justify-center bg-black/20">
          <AppLoader />
        </View>
      )}
    </SafeAreaView>
  );
}
