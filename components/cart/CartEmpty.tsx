import CartEmptyIcon from "@/assets/icons/cart-empty.svg";
import { PRODUCTS_PROTECTED, PRODUCTS_PUBLIC } from "@/constants/urls";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SvgIcon } from "../common/SvgIcon";

const CartEmpty = () => {
  const { user } = useAuthUser();
  const router = useRouter();
  return (
    <View className="items-center justify-center flex-1">
      <SvgIcon Icon={CartEmptyIcon} size={144} />
      <View className="items-center mt-0">
        <Text className="text-xl text-primary font-jost-semibold">
          Your Cart is Empty
        </Text>
        <Text className="text-base text-secondary font-jost">
          Add new items
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push(user ? PRODUCTS_PROTECTED : PRODUCTS_PUBLIC)}
        className="px-8 py-4 mt-4 bg-black rounded"
      >
        <Text className="text-white font-jost-medium">Shop now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartEmpty;
