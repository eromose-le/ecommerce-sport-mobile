import CartCard from "@/components/cart/CartCard";
import CartEmpty from "@/components/cart/CartEmpty";
import AppHeader from "@/components/common/AppHeader";
import Modal from "@/components/common/Modal";
import PrimaryButton from "@/components/common/PrimaryButton";
import TextField from "@/components/common/TextField";
import {
  MINIMUM_CHECKOUT_AMOUNT,
  PARTIAL_PAYMENT_DISCOUNT,
  SHIPPING_FEE,
  SHIPPING_STATE_OPTIONS,
  showShippingFeePrice,
  showTotalPrice,
  showTotalPriceInCart,
} from "@/helpers/cart";
import { useAuth } from "@/providers/auth";
import { PaymentService } from "@/services/api";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/utils/currency";
import { AppToast } from "@/utils/toast";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  state: string;
};

type CartOrderPayload = {
  userId?: string | number;
  items: {
    productId: string | number;
    quantity: number;
    size?: string;
    color?: string;
  }[];
  variant: any;
};

const checkoutSchema = Yup.object({
  firstName: Yup.string().trim().required("First name is required"),
  lastName: Yup.string().trim().required("Last name is required"),
  email: Yup.string()
    .trim()
    .email("Enter a valid email")
    .required("Email is required"),
  phoneNumber: Yup.string().trim().required("Phone number is required"),
  address: Yup.string().trim().required("Address is required"),
  state: Yup.string().trim().required("State is required"),
});

export default function ProtectedCheckout() {
  const { cart, incrementQty, decrementQty, removeFromCart } = useCartStore();
  const { user } = useAuth();

  // Needed so WebBrowser can close once redirected back to the app
  WebBrowser.maybeCompleteAuthSession();
  const [paymentOption, setPaymentOption] = useState<"FULL" | "PARTIAL">(
    "FULL"
  );
  const [selectStateOpen, setSelectStateOpen] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const isEmpty = useMemo(() => (cart?.length || 0) === 0, [cart]);
  const subtotal = useMemo(() => showTotalPriceInCart(cart), [cart]);

  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNumber: user?.phone || "",
      address: user?.address || "",
      state: "",
    },
    enableReinitialize: true,
    validationSchema: checkoutSchema,
    onSubmit: async (values) => {
      if (!cart?.length) {
        AppToast.failed("Your cart is empty.");
        return;
      }

      const shippingTarget = values.state || SHIPPING_FEE;
      const shippingFee = showShippingFeePrice(subtotal, shippingTarget);
      const checkoutAmount = showTotalPrice(subtotal, shippingFee);
      const payableAmount =
        paymentOption === "PARTIAL"
          ? (checkoutAmount * PARTIAL_PAYMENT_DISCOUNT) / 100
          : checkoutAmount;

      if (checkoutAmount < MINIMUM_CHECKOUT_AMOUNT) {
        AppToast.failed(
          `A minimum of ${formatCurrency(
            MINIMUM_CHECKOUT_AMOUNT
          )} is required to checkout.`
        );
        return;
      }

      setLoadingPayment(true);
      try {
        // Use the Expo deep link (scheme://) so Paystack can bounce back into the app
        const redirectUrl = Linking.createURL("/");
        const callbackUrl = redirectUrl;
        const cartPayload: CartOrderPayload = {
          userId: user?.id,
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item?.variant?.qty || 1,
            size: item?.variant?.size || (item?.variant as any)?.sizes,
            color: item?.variant?.color || (item?.variant as any)?.colors,
          })),
          variant: cart?.[0]?.variant,
        };
        const metadata = {
          items: cartPayload,
          shippingFee,
          shippingState: values.state,
          checkoutAmount,
          paymentOption,
          partialPercentage:
            paymentOption === "PARTIAL" ? PARTIAL_PAYMENT_DISCOUNT : 100,
          contact: values,
          subtotal,
          redirectUrl,
          callbackUrl,
          offlineUser: {
            email: values.email,
            address: values.address,
            state: values.state,
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
          },
        };

        const initResponse = await PaymentService.initiatePayment({
          amount: payableAmount,
          currency: "NGN",
          email: values.email || user?.email || "",
          userId: user?.id,
          paymentOption,
          metadata,
          gatewayName: "PAYSTACK",
          redirectUrl,
          callbackUrl,
        });

        const authorizationUrl =
          initResponse?.data?.authorizationUrl ||
          (initResponse as any)?.authorizationUrl ||
          initResponse?.data?.authorization_url;
        const reference =
          initResponse?.data?.reference ||
          (initResponse as any)?.reference ||
          (metadata as any)?.reference;
        const backendReference =
          initResponse?.data?.backendReference ||
          (initResponse as any)?.backendReference ||
          reference;

        if (!authorizationUrl || !reference) {
          throw new Error(
            initResponse?.message || "Unable to start payment with Paystack"
          );
        }

        router.push({
          pathname: "/(protected)/paystack-webview",
          params: {
            url: authorizationUrl,
            reference,
            backendReference,
            metadata: JSON.stringify(metadata),
            payableAmount: String(payableAmount),
            checkoutAmount: String(checkoutAmount),
            shippingFee: String(shippingFee),
            shippingState: values.state,
            paymentOption,
            redirectUrl,
            callbackUrl,
          },
        });
      } catch (error: any) {
        const msg =
          error?.response?.data?.error ||
          error?.message ||
          "Unable to complete payment.";
        AppToast.failed(msg);
      } finally {
        setLoadingPayment(false);
      }
    },
  });

  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    touched,
    setFieldValue,
    isSubmitting,
  } = formik;

  const selectedStateLabel =
    SHIPPING_STATE_OPTIONS.find((opt) => opt.value === values.state)?.label ||
    "";
  const shippingTarget = values.state || SHIPPING_FEE;
  const shippingFee = showShippingFeePrice(subtotal, shippingTarget);
  const checkoutAmount = showTotalPrice(subtotal, shippingFee);
  const payableAmount =
    paymentOption === "PARTIAL"
      ? (checkoutAmount * PARTIAL_PAYMENT_DISCOUNT) / 100
      : checkoutAmount;
  const belowMinimum = checkoutAmount < MINIMUM_CHECKOUT_AMOUNT;
  const shippingLabel =
    typeof shippingTarget === "string"
      ? selectedStateLabel || shippingTarget
      : `${shippingTarget}%`;

  if (isEmpty) {
    return <CartEmpty />;
  }

  const renderStateOption = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => {
        setFieldValue("state", item.value);
        setSelectStateOpen(false);
      }}
      className="px-4 py-3 border-b border-gray-100"
    >
      <Text className="text-base font-jost">{item.label}</Text>
    </TouchableOpacity>
  );

  const paymentOptionButton = (
    option: "FULL" | "PARTIAL",
    label: string,
    description: string
  ) => {
    const isActive = paymentOption === option;
    return (
      <TouchableOpacity
        onPress={() => setPaymentOption(option)}
        className={`flex-1 rounded-2xl border px-4 py-3 ${
          isActive ? "bg-black border-black" : "bg-white border-gray-200"
        }`}
        activeOpacity={0.8}
      >
        <Text
          className={`text-sm font-jost-semibold ${
            isActive ? "text-white" : "text-primary"
          }`}
        >
          {label}
        </Text>
        <Text
          className={`mt-1 text-xs font-jost ${
            isActive ? "text-gray-200" : "text-secondary"
          }`}
        >
          {description}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <AppHeader title="Checkout" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.select({ ios: 10, android: 0 })}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-4 pb-6">
            <Text className="text-xl font-jost-semibold">Delivery details</Text>

            <View className="gap-3 mt-4">
              <TextField
                label="First name"
                value={values.firstName}
                onChangeText={handleChange("firstName")}
                error={touched.firstName && errors.firstName}
              />
              <TextField
                label="Last name"
                value={values.lastName}
                onChangeText={handleChange("lastName")}
                error={touched.lastName && errors.lastName}
              />
              <TextField
                label="Email"
                value={values.email}
                onChangeText={handleChange("email")}
                keyboardType="email-address"
                autoCapitalize="none"
                error={touched.email && errors.email}
              />
              <TextField
                label="Phone number"
                value={values.phoneNumber}
                onChangeText={handleChange("phoneNumber")}
                keyboardType="phone-pad"
                error={touched.phoneNumber && errors.phoneNumber}
              />
              <TextField
                label="Address"
                value={values.address}
                onChangeText={handleChange("address")}
                error={touched.address && errors.address}
              />

              <View>
                <Text className="mb-2 text-sm font-jost-medium text-primary">
                  State
                </Text>
                <TouchableOpacity
                  className="flex-row items-center justify-between px-4 py-4 bg-white border border-gray-200 rounded-2xl"
                  onPress={() => setSelectStateOpen(true)}
                  activeOpacity={0.8}
                >
                  <Text
                    className={`text-sm font-jost ${
                      selectedStateLabel ? "text-primary" : "text-secondary"
                    }`}
                  >
                    {selectedStateLabel || "Select state"}
                  </Text>
                  <Text className="text-xs text-secondary">Change</Text>
                </TouchableOpacity>
                {touched.state && errors.state ? (
                  <Text className="mt-1 text-xs text-red-500">
                    {errors.state}
                  </Text>
                ) : null}
              </View>
            </View>

            <View className="mt-8">
              <Text className="text-xl font-jost-semibold">
                Payment options
              </Text>
              <View className="flex-row gap-3 mt-3">
                {paymentOptionButton(
                  "FULL",
                  "100% payment",
                  "Pay the entire amount now"
                )}
                {paymentOptionButton(
                  "PARTIAL",
                  "30% down payment",
                  "Pay 30% now, balance later"
                )}
              </View>
            </View>

            <View className="mt-8">
              <Text className="text-xl font-jost-semibold">Order summary</Text>
              <View className="gap-2 mt-3">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-secondary font-jost">
                    Subtotal
                  </Text>
                  <Text className="text-sm font-jost-medium">
                    {formatCurrency(subtotal)}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-secondary font-jost">
                    Shipping ({shippingLabel})
                  </Text>
                  <Text className="text-sm font-jost-medium">
                    {formatCurrency(shippingFee)}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-base font-jost-medium">Total</Text>
                  <Text className="text-base font-jost-semibold">
                    {formatCurrency(checkoutAmount)}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-base font-jost-medium">
                    Amount to pay (
                    {paymentOption === "PARTIAL" ? "30%" : "100%"})
                  </Text>
                  <Text className="text-base font-jost-semibold">
                    {formatCurrency(payableAmount)}
                  </Text>
                </View>
              </View>
              {belowMinimum && (
                <Text className="mt-2 text-xs text-red-500 font-jost">
                  Minimum checkout amount is{" "}
                  {formatCurrency(MINIMUM_CHECKOUT_AMOUNT)}.
                </Text>
              )}
            </View>

            <View className="mt-8">
              <Text className="text-xl font-jost-semibold">Items</Text>
              <View className="mt-3">
                {cart.map((item) => (
                  <CartCard
                    key={item.id}
                    item={item}
                    onIncrement={() => incrementQty(item.id)}
                    onDecrement={() => decrementQty(item.id)}
                    onRemove={() => removeFromCart(item.id)}
                  />
                ))}
              </View>
            </View>

            <View className="mt-6">
              <PrimaryButton
                title={
                  paymentOption === "PARTIAL"
                    ? `Pay ${formatCurrency(payableAmount)} (30%)`
                    : `Pay ${formatCurrency(payableAmount)}`
                }
                onPress={() => handleSubmit()}
                loading={loadingPayment || isSubmitting}
                disabled={belowMinimum || loadingPayment || isSubmitting}
                loadingText="Starting payment..."
              />
              <Text className="mt-2 text-xs text-secondary font-jost">
                Secured by Paystack
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={selectStateOpen}
        onClose={() => setSelectStateOpen(false)}
        contentHeight="90%"
      >
        <SafeAreaView
          className="relative flex-1 bg-background"
          edges={["top", "left", "right", "bottom"]}
        >
          <View className="flex-row items-baseline justify-between gap-2 mb-4">
            <Text className="text-lg font-jost-semibold text-primary">
              Select state
            </Text>
          </View>

          <FlatList
            data={SHIPPING_STATE_OPTIONS}
            keyExtractor={(item) => item.value}
            renderItem={renderStateOption}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
