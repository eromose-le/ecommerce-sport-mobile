import { useThemedStyles } from "@/providers/theme";
import { Product } from "@/services/product/product.types";
import React from "react";
import { View } from "react-native";
import { PrimaryButton, SecondaryButton } from "../ui";

type ProductDetailActionsProps = {
  product: Product;
  onAddToCart: () => void;
  onStartOrder?: () => void;
};

export default function ProductDetailActions({
  product,
  onAddToCart,
  onStartOrder,
}: ProductDetailActionsProps) {
  const theme = useThemedStyles();

  return (
    <View className="flex-row items-center gap-3 mt-6">
      <PrimaryButton
        title="Start order"
        onPress={() => onStartOrder?.()}
        className={`${theme.primaryButtonClass} rounded px-6`}
        textClassName={theme.primaryTextClassInverse}
        spinnerColor={theme.primarySpinnerColor}
      />

      <SecondaryButton
        title="Add to Cart"
        onPress={onAddToCart}
        className={`${theme.secondaryButtonClass} rounded px-6`}
        textClassName={theme.secondaryTextClass}
        spinnerColor={theme.secondarySpinnerColor}
      />
    </View>
  );
}
