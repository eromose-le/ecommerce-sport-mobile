import CartIcon from "@/assets/icons/cart.svg";
import { useRouter } from "expo-router";
import React, { FC } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SvgIcon } from "../common/SvgIcon";
import { CART_PROTECTED, CART_PUBLIC } from "@/constants/urls";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useCartStore } from "@/store/useCartStore";
import { showCartQtyValue } from "@/helpers/cart";

const CartButton: FC = () => {
  const router = useRouter();
  const { user } = useAuthUser();
  const cart = useCartStore((state) => state.cart);
  const badge = showCartQtyValue(cart);

  return (
    <TouchableOpacity
      onPress={() => router.push(!!user ? CART_PROTECTED : CART_PUBLIC)}
      className="relative p-3 rounded-full bg-transparent border border-[#0000001A]"
    >
      <SvgIcon Icon={CartIcon} size={22} color={"#000"} />
      {badge.status ? (
        <View className="absolute items-center justify-center min-w-[20px] h-5 px-1 bg-red-500 rounded-full -bottom-1 -right-1">
          <Text className="text-xs text-white font-jost-semibold">
            {badge.value}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

export default CartButton;
