import CartCard from "@/components/cart/CartCard";
import CartEmpty from "@/components/cart/CartEmpty";
import {
  showShippingFeePrice,
  showTotalPrice,
  showTotalPriceInCart,
} from "@/helpers/cart";
import { CHECKOUT } from "@/constants/urls";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/utils/currency";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Cart() {
  const { cart, incrementQty, decrementQty, removeFromCart } = useCartStore();

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

  if (isEmpty) {
    return <CartEmpty />;
  }
  return (
    <View className="flex-1 px-5 pt-0 bg-background">
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
        className="absolute bottom-0 left-0 right-0 px-5 pt-4 pb-8 bg-white"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.01,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: -2 },
          elevation: 6,
        }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base text-secondary font-jost">
            Subtotal + shipping
          </Text>
          <Text className="text-xl font-bold">
            {formatCurrency(total)}
          </Text>
        </View>
        <View className="flex-row items-center justify-between gap-0">
          <View>
            <Text className="text-sm font-jost-semibold text-primary">
              Shipping ({shippingPercentage}%)
            </Text>
            <Text className="text-xs text-secondary font-jost text-wrap">
              Fee: {formatCurrency(shippingFee)} · Subtotal:{" "}
              {formatCurrency(subtotal)}
            </Text>
          </View>
          <TouchableOpacity
            className="px-5 py-4 bg-black rounded-2xl"
            onPress={() => router.push(CHECKOUT)}
            activeOpacity={0.8}
          >
            <Text className="text-base text-white rounded-md font-jost-semibold">
              Check out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
