import { Product } from "@/services/product/product.types";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
  return (
    <View className="flex-row items-center gap-3 mt-6">
      <TouchableOpacity
        onPress={onStartOrder}
        className="flex-1 py-3 bg-black rounded"
        activeOpacity={0.85}
      >
        <Text className="text-xs text-center text-white font-jost-semibold">
          Start order
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onAddToCart}
        className="flex-1 py-3 border rounded border-secondary"
        activeOpacity={0.85}
      >
        <Text className="text-xs text-center font-jost-semibold">
          Add to Cart
        </Text>
      </TouchableOpacity>
    </View>
  );
}
