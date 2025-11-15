import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SvgIcon } from "../common/SvgIcon";
import CartEmptyIcon from "@/assets/icons/cart-empty.svg";

const CartEmpty = () => {
  return (
    <View className="items-center justify-center flex-1">
      <SvgIcon Icon={CartEmptyIcon} size={144}  />
      <View className="items-center mt-0">
        <Text className="text-xl text-primary font-jost-semibold">
          Your Cart is Empty
        </Text>
        <Text className="text-base text-secondary font-jost">
          Add new items
        </Text>
      </View>

      <TouchableOpacity className="px-8 py-4 mt-4 bg-black rounded">
        <Text className="text-white font-jost-medium">Shop now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartEmpty;
