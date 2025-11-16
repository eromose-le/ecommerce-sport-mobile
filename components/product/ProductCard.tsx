import { PRODUCT_DETAIL } from "@/constants/urls";
import { Product } from "@/types/product";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ProductCardProps {
  product: Product;
  horizontal?: boolean;
  width?: number;
  index?: number;
  onAddToCart?: () => void; // optional callback
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  horizontal = false,
  width,
  onAddToCart,
}) => {
  return (
    <Link
      href={{
        pathname: PRODUCT_DETAIL,
        params: { id: product.id, product: JSON.stringify(product) },
      }}
      // href={`/(protected)/product/${product.id.toString()}` as any} // simpler & works perfectly
      asChild
    >
      <TouchableOpacity
        style={{ width }}
        className="p-3 bg-white"
        activeOpacity={0.8}
      >
        <Image
          source={product.image}
          className={`w-full ${horizontal ? "h-32" : "h-40"} bg-[#F5F5F7]`}
          resizeMode="contain"
        />

        <Text
          className="mt-3 mb-1 text-base font-jost-medium"
          numberOfLines={1}
        >
          {product.name}
        </Text>

        <Text
          className="mb-2 text-sm text-secondary font-jost"
          numberOfLines={1}
        >
          {product.brand}
        </Text>

        <View className="flex-row items-center justify-between">
          <Text className="text-base text-primary font-jost-semibold">
            ${product.price.toFixed(2)}
          </Text>

          {/* Separate button for add-to-cart to avoid blocking Link */}
          <TouchableOpacity
            className="p-1 bg-black rounded-full"
            onPress={(e) => {
              e.stopPropagation(); // prevent triggering the Link
              onAddToCart?.();
            }}
          >
            <Ionicons name="add" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Link>
  );
};
