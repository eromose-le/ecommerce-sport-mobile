import CartIcon from "@/assets/icons/cart.svg";
import { useRouter } from "expo-router";
import React, { FC } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SvgIcon } from "../common/SvgIcon";
import { CART_PROTECTED, CART_PUBLIC } from "@/constants/urls";
import { useAuthUser } from "@/hooks/useAuthUser";

const CartButton: FC = () => {
  const router = useRouter();
  const { user } = useAuthUser();

  return (
    <TouchableOpacity
      onPress={() => router.push(!!user ? CART_PROTECTED : CART_PUBLIC)}
      className="relative p-3 rounded-full bg-transparent border border-[#0000001A]"
    >
      <SvgIcon Icon={CartIcon} size={22} color={"#000"} />
      <View className="absolute items-center justify-center w-5 h-5 bg-red-500 rounded-full -bottom-1 -right-1">
        <Text className="text-xs text-white font-jost-semibold">3</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CartButton;
