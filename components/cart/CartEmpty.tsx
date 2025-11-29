import CartEmptyIcon from "@/assets/icons/cart-empty.svg";
import { PRODUCTS_PROTECTED, PRODUCTS_PUBLIC } from "@/constants/urls";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useThemedStyles } from "@/providers/theme";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SvgIcon } from "../common/SvgIcon";
import { BodyText, Heading, PrimaryButton } from "../ui";

const CartEmpty = () => {
  const { user } = useAuthUser();
  const router = useRouter();
  const theme = useThemedStyles();
  return (
    <View className={`items-center justify-center flex-1 ${theme.pageBg}`}>
      <SvgIcon Icon={CartEmptyIcon} size={144} />
      <View className="items-center mt-0">
        <Heading level="h3" weight="semibold" tone={theme.headingTone}>
          Your Cart is Empty
        </Heading>
        <BodyText size="md" tone={theme.labelTone}>
          Add new items
        </BodyText>
      </View>

      <View className="mt-4">
        <PrimaryButton
          title="Shop now"
          onPress={() =>
            router.push(user ? PRODUCTS_PROTECTED : PRODUCTS_PUBLIC)
          }
          className={`${theme.primaryButtonClass}`}
          textClassName={theme.primaryTextClassInverse}
          spinnerColor={theme.primarySpinnerColor}
        />
      </View>
    </View>
  );
};

export default CartEmpty;
