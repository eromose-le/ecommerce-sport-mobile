import { PRODUCT_DETAIL } from "@/constants/urls";
import { calculatePercentageDecrease } from "@/helpers/product-discount";
import { Product } from "@/services/product/product.types";
import { formatCurrency } from "@/utils/currency";
import { resolveImageSource } from "@/utils/images";
import { Ionicons } from "@expo/vector-icons";
import classNames from "classnames";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ProductCardProps {
  product: Product;
  horizontal?: boolean;
  width?: number;
  index?: number;
  onAddToCart?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  horizontal = false,
  width,
  onAddToCart,
}) => {
  const discountCap = calculatePercentageDecrease({
    price: Number(product?.price),
    salesPrice: Number(product?.salesPrice),
  });

  return (
    <Link
      href={{
        pathname: PRODUCT_DETAIL,
        params: { id: product?.id, product: JSON.stringify(product) },
      }}
      // href={`/(protected)/product/${product.id.toString()}` as any} // simpler & works perfectly
      asChild
    >
      <TouchableOpacity
        style={{ width }}
        className="relative p-3 bg-white"
        activeOpacity={0.8}
      >
        {/* NOTE: sales */}
        <Text
          className={classNames(
            !discountCap && "hidden",
            "bg-orange-400 rounded-md p-1 absolute w-fit z-[1] text-xs text-white font-jost-semibold"
          )}
        >
          {discountCap}
        </Text>

        {/* NOTE: local */}
        {/* <Image
          source={product?.displayImage}
          className={`w-full ${horizontal ? "h-32" : "h-40"} bg-[#F5F5F7]`}
          resizeMode="contain"
        /> */}

        <Image
          source={resolveImageSource(product?.displayImage)}
          className={`w-full ${horizontal ? "h-32" : "h-40"} bg-[#F5F5F7]`}
          resizeMode="contain"
        />

        <Text
          className="mt-3 mb-1 text-base font-jost-medium"
          numberOfLines={1}
        >
          {product?.name}
        </Text>

        <Text
          className="mb-2 text-sm text-secondary font-jost"
          numberOfLines={1}
        >
          {product?.description}
        </Text>

        <View className="flex-row items-center justify-between">
          <>
            {discountCap ? (
              <View className="space-y-0.5">
                <Text className="text-base text-primary font-jost-semibold">
                  {formatCurrency(product?.price || 0)}
                </Text>
                <Text className="text-base line-through text-secondary font-jost-medium">
                  {formatCurrency(product?.salesPrice || 0)}
                </Text>
              </View>
            ) : (
              <Text className="text-base text-primary font-jost-semibold">
                {formatCurrency(product?.price || 0)}
              </Text>
            )}
          </>

          {/* Separate button for add-to-cart to avoid blocking Link */}
          <TouchableOpacity
            className="hidden p-1 bg-black rounded-full"
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
