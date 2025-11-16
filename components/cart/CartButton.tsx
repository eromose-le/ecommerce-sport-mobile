import CartIcon from "@/assets/icons/cart.svg";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SvgIcon } from "../common/SvgIcon";
import { CART } from "@/constants/urls";

const CartButton = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(CART)}
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
