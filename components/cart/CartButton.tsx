import CartIcon from "@/assets/icons/cart.svg";
import { CART_PROTECTED, CART_PUBLIC } from "@/constants/urls";
import { showCartQtyValue } from "@/helpers/cart";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useThemedStyles } from "@/providers/theme";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "expo-router";
import React, { FC, useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SvgIcon } from "../common/SvgIcon";

const CartButton: FC = () => {
  const theme = useThemedStyles();
  const router = useRouter();
  const { user } = useAuthUser();
  const cart = useCartStore((state) => state.cart);
  const badge = showCartQtyValue(cart);

  const showBadge = badge.status;
  const scale = useSharedValue(showBadge ? 1 : 0);

  useEffect(() => {
    if (showBadge) {
      scale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1.25, { duration: 140 }),
        withSpring(1, { damping: 8, stiffness: 150 })
      );
    } else {
      scale.value = withTiming(0, { duration: 180 });
    }
  }, [scale, showBadge]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  return (
    <TouchableOpacity
      onPress={() => router.push(!!user ? CART_PROTECTED : CART_PUBLIC)}
      className={`relative p-3 rounded-full bg-transparent border ${theme.surface}`}
    >
      <SvgIcon Icon={CartIcon} size={22} color={theme.iconMuted} />
      {badge.status ? (
        <Animated.View
          style={animatedStyle}
          className="absolute items-center justify-center min-w-[20px] h-5 px-1 bg-red-500 rounded-full -bottom-1 -right-1"
        >
          <Text className="text-xs text-white font-jost-semibold">
            {badge.value}
          </Text>
        </Animated.View>
      ) : null}
    </TouchableOpacity>
  );
};

export default CartButton;
