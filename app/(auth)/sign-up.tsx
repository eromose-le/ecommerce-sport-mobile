import AppLoader from "@/components/common/AppLoader";
import { SIGN_IN, VERIFY_OTP } from "@/constants/urls";
import { AuthService } from "@/services/api";
import { ICreateUserPayload } from "@/services/auth/auth.types";
import { AppToast } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { ReactNode, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

type FormState = {
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  agreeToTerms: boolean;
  country: CountryOption;
};

export default function SignUp() {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    agreeToTerms: false,
    country: COUNTRY_OPTIONS[0],
  });
  const [showPassword, setShowPassword] = useState(false);
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
      const emailParam = variables?.email || form.email;
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

  const updateForm = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canSubmit =
    !!form.email &&
    !!form.password &&
    !!form.confirmPassword &&
    !!form.firstName &&
    !!form.lastName &&
    !!form.phoneNumber &&
    !!form.address &&
    form.agreeToTerms &&
    form.password === form.confirmPassword;

  const handleRegister = () => {
    if (!canSubmit) {
      AppToast.info("Complete the form to register");
      return;
    }

    if (registerMutation.isPending) return;

    const numericPhone = form.phoneNumber.replace(/[^0-9]/g, "");
    const payload: ICreateUserPayload = {
      email: form.email.trim(),
      password: form.password,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      address: form.address.trim(),
      phone: `${form.country.dialCode}${numericPhone}`,
    };

    registerMutation.mutate(payload);
  };

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
                    source={{ uri: form.country.flag }}
                    className="w-8 h-5 rounded-sm"
                    resizeMode="cover"
                  />
                  <Text className="text-xs text-primary font-jost-medium">
                    {form.country.label}
                  </Text>
                </View>
                <Text className="text-xs text-primary">Change</Text>
              </TouchableOpacity>
            </FieldRow>

            <FieldRow label="Email">
              <TextInput
                placeholder="Please set the email as the login name"
                placeholderTextColor="#9CA3AF"
                className="flex-row items-center justify-center px-4 py-3 text-xs bg-white border-[0.34px] border-[#DEE2E6] rounded font-jost h-[40px]"
                value={form.email}
                onChangeText={(text) => updateForm("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </FieldRow>

            <FieldRow label="Login Password">
              <View className="relative">
                <TextInput
                  placeholder="Set login password"
                  placeholderTextColor="#9CA3AF"
                  className="flex-row items-center justify-center px-4 py-3 text-xs bg-white border-[0.34px] border-[#DEE2E6] rounded font-jost h-[40px]"
                  value={form.password}
                  onChangeText={(text) => updateForm("password", text)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
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
            </FieldRow>

            <FieldRow label="Confirm Password">
              <View className="relative">
                <TextInput
                  placeholder="Enter the login password again"
                  placeholderTextColor="#9CA3AF"
                  className="flex-row items-center justify-center px-4 py-3 text-xs bg-white border-[0.34px] border-[#DEE2E6] rounded font-jost h-[40px]"
                  value={form.confirmPassword}
                  onChangeText={(text) => updateForm("confirmPassword", text)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
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
            </FieldRow>

            <FieldRow label="Full Name">
              <View className="flex-row gap-3">
                <TextInput
                  placeholder="First name"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 items-center justify-center px-4 py-3 text-xs bg-white border-[0.34px] border-[#DEE2E6] rounded font-jost h-[40px]"
                  value={form.firstName}
                  onChangeText={(text) => updateForm("firstName", text)}
                />
                <TextInput
                  placeholder="Surname"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 items-center justify-center px-4 py-3 text-xs bg-white border-[0.34px] border-[#DEE2E6] rounded font-jost h-[40px]"
                  value={form.lastName}
                  onChangeText={(text) => updateForm("lastName", text)}
                />
              </View>
            </FieldRow>

            <FieldRow label="Pick up location">
              <TextInput
                placeholder="Please enter your address"
                placeholderTextColor="#9CA3AF"
                className="flex-row items-center justify-center px-4 py-3 text-xs bg-white border-[0.34px] border-[#DEE2E6] rounded font-jost h-[40px]"
                value={form.address}
                onChangeText={(text) => updateForm("address", text)}
              />
            </FieldRow>

            <FieldRow label="Tel">
              <View className="flex-row items-center gap-3">
                <View className="flex-row items-center justify-center px-4 py-3 text-xs bg-white border-[0.34px] border-[#DEE2E6] rounded font-jost h-[40px]">
                  <Text className="text-base text-primary font-jost-medium">
                    {form.country.dialCode.replace("+", "")}
                  </Text>
                </View>
                <TextInput
                  placeholder="Phone number"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 items-center justify-center px-4 py-3 text-xs bg-white border-[0.34px] border-[#DEE2E6] rounded font-jost h-[40px]"
                  value={form.phoneNumber}
                  onChangeText={(text) => updateForm("phoneNumber", text)}
                  keyboardType="phone-pad"
                />
              </View>
            </FieldRow>

            <View className="flex-row items-center justify-center gap-3 align-middle">
              <TouchableOpacity
                onPress={() => updateForm("agreeToTerms", !form.agreeToTerms)}
                className="items-center justify-center w-5 h-5 mt-1 border border-gray-300 rounded-full"
              >
                {form.agreeToTerms && (
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

            <TouchableOpacity
              onPress={handleRegister}
              disabled={!canSubmit || registerMutation.isPending}
              className={`w-full rounded mt-4 py-4 ${
                canSubmit ? "bg-black" : "bg-gray-200"
              } ${registerMutation.isPending ? "opacity-90" : ""}`}
            >
              <Text
                className={`text-center text-base font-jost-medium ${
                  canSubmit ? "text-white" : "text-secondary"
                }`}
              >
                {registerMutation.isPending
                  ? "Registering..."
                  : "Agree and Register"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: SIGN_IN,
                params: { fromOnboarding: "true" },
              })
            }
            className="mt-4"
          >
            <Text className="text-base text-center underline text-primary font-jost-medium">
              Login
            </Text>
          </TouchableOpacity>
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
                const isActive = country.value === form.country.value;
                return (
                  <TouchableOpacity
                    key={country.value}
                    className="flex-row items-center justify-between py-3"
                    onPress={() => {
                      updateForm("country", country);
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
