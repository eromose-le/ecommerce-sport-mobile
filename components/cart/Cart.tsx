import CartCard from "@/components/cart/CartCard";
import CartEmpty from "@/components/cart/CartEmpty";
import Modal from "@/components/common/Modal";
import {
  BodyText,
  Heading,
  PrimaryButton,
  SecondaryButton,
} from "@/components/ui";
import { CHECKOUT, SIGN_IN, SIGN_UP } from "@/constants/urls";
import {
  showShippingFeePrice,
  showTotalPrice,
  showTotalPriceInCart,
} from "@/helpers/cart";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useAuth } from "@/providers/auth";
import { useThemedStyles } from "@/providers/theme";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/utils/currency";
import classNames from "classnames";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Cart() {
  const theme = useThemedStyles();
  const { cart, incrementQty, decrementQty, removeFromCart } = useCartStore();
  const { user } = useAuthUser();

  const { unSkipLogin } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const isEmpty = (cart?.length || 0) === 0;
  const shippingPercentage = 5;

  const subtotal = useMemo(() => showTotalPriceInCart(cart), [cart]);
  const shippingFee = useMemo(
    () => showShippingFeePrice(subtotal, shippingPercentage),
    [shippingPercentage, subtotal]
  );
  const total = useMemo(
    () => showTotalPrice(subtotal, shippingFee),
    [shippingFee, subtotal]
  );

  useEffect(() => {
    setShowAuthPrompt(!user?.id);
  }, [user?.id]);

  const authPrompt = (
    <Modal
      visible={showAuthPrompt}
      onClose={() => setShowAuthPrompt(false)}
      variant="center"
      dismissOnBackdropPress
      contentHeight="auto"
    >
      <SafeAreaView
        edges={["top", "bottom"]}
        className={classNames(
          "gap-3 pt-4",
          Platform.OS === "ios" ? "pb-10" : "pb-2"
        )}
      >
        <Heading
          level="h3"
          weight="semibold"
          tone={theme.headingTone}
          align="center"
        >
          Sign in to continue
        </Heading>
        <BodyText size="sm" tone={theme.labelTone} align="center">
          Sign in or create an account to manage your cart and checkout.
        </BodyText>
        <View className="flex-row gap-3 mt-2">
          <PrimaryButton
            title="Sign in"
            onPress={() => {
              unSkipLogin();
              router.replace({
                pathname: SIGN_IN,
                params: { fromOnboarding: "true" },
              });
            }}
            className={`flex-1 ${theme.primaryButtonClass}`}
            textClassName={theme.primaryTextClassInverse}
            spinnerColor={theme.primarySpinnerColor}
          />
          <SecondaryButton
            title="Create account"
            onPress={() => {
              unSkipLogin();
              router.replace({
                pathname: SIGN_UP,
                params: { fromOnboarding: "true" },
              });
            }}
            // onPress={() => navigateToAuth(SIGN_UP)}
            className={`flex-1 ${theme.secondaryButtonClass}`}
            textClassName={theme.secondaryTextClass}
            spinnerColor={theme.secondarySpinnerColor}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );

  if (isEmpty) {
    return (
      <>
        <CartEmpty />
        {authPrompt}
      </>
    );
  }
  return (
    <View className={`flex-1 px-2 pt-0 ${theme.pageBg}`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {cart?.map((item) => (
          <CartCard
            key={item.id}
            item={item}
            onIncrement={() => incrementQty(item.id)}
            onDecrement={() => decrementQty(item.id)}
            onRemove={() => removeFromCart(item.id)}
          />
        ))}
      </ScrollView>

      {/* Bottom Checkout Bar */}
      <View
        className={`absolute bottom-0 left-0 right-0 px-5 pt-4 pb-8 ${theme.mutedSurface}`}
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.01,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: -2 },
          elevation: 6,
        }}
      >
        <View
          className={classNames("flex-row items-center justify-between mb-3")}
        >
          <BodyText size="sm" tone={theme.labelTone}>
            Subtotal + shipping
          </BodyText>
          <Heading level="h3" weight="bold" tone={theme.headingTone}>
            {formatCurrency(total)}
          </Heading>
        </View>
        <View className="flex-row items-center justify-between gap-0">
          <View>
            <BodyText size="sm" weight="semibold" tone={theme.headingTone}>
              Shipping ({shippingPercentage}%)
            </BodyText>
            <BodyText size="xs" tone={theme.labelTone} className="text-wrap">
              Fee: {formatCurrency(shippingFee)} · Subtotal:{" "}
              {formatCurrency(subtotal)}
            </BodyText>
          </View>
          <PrimaryButton
            title="Checkout"
            onPress={() => router.push(user ? CHECKOUT : SIGN_IN)}
            className={`${theme.primaryButtonClass}`}
            textClassName={theme.primaryTextClassInverse}
            spinnerColor={theme.primarySpinnerColor}
          />
        </View>
      </View>
      {authPrompt}
    </View>
  );
}
