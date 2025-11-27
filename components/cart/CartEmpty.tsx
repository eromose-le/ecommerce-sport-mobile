import CartEmptyIcon from "@/assets/icons/cart-empty.svg";
import { PRODUCTS_PROTECTED, PRODUCTS_PUBLIC } from "@/constants/urls";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { SvgIcon } from "../common/SvgIcon";
import { PrimaryButton } from "../ui";

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

      <View className="mt-4">
        <PrimaryButton
          title="Shop now"
          onPress={() =>
            router.push(user ? PRODUCTS_PROTECTED : PRODUCTS_PUBLIC)
          }
        />
      </View>
    </View>
  );
};

export default CartEmpty;
