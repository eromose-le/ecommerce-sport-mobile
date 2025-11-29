import { PRODUCT_DETAIL } from "@/constants/urls";
import { calculatePercentageDecrease } from "@/helpers/product-discount";
import { useThemedStyles } from "@/providers/theme";
import { Product } from "@/services/product/product.types";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/utils/currency";
import { resolveImageSource } from "@/utils/images";
import { Ionicons } from "@expo/vector-icons";
import classNames from "classnames";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { BodyText } from "../ui";

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
  const theme = useThemedStyles();
  const { addToCart } = useCartStore();
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
        className={`relative p-3 ${theme.pageBg}`}
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
          resizeMode="cover"
        />
        <BodyText
          size="md"
          align="left"
          weight="medium"
          tone={theme.bodyTone}
          numberOfLines={1}
          className="mt-3 mb-1"
        >
          {product?.name}
        </BodyText>

        <BodyText
          size="sm"
          align="left"
          weight="light"
          tone={theme.labelTone}
          numberOfLines={1}
          className="mb-2"
        >
          {product?.description}
        </BodyText>

        <View className="flex-row items-center justify-between">
          <>
            {discountCap ? (
              <View className="space-y-0.5">
                <BodyText
                  size="md"
                  align="left"
                  weight="medium"
                  tone={theme.labelTone}
                  numberOfLines={1}
                  className="line-through "
                >
                  {formatCurrency(product?.price || 0)}
                </BodyText>

                <BodyText
                  size="md"
                  align="left"
                  weight="semibold"
                  tone={theme.bodyTone}
                  numberOfLines={1}
                  className=""
                >
                  {formatCurrency(product?.salesPrice || 0)}
                </BodyText>
              </View>
            ) : (
              <BodyText
                size="md"
                align="left"
                weight="semibold"
                tone={theme.bodyTone}
                numberOfLines={1}
                className=""
              >
                {formatCurrency(product?.price || 0)}
              </BodyText>
            )}
          </>

          {/* Separate button for add-to-cart to avoid blocking Link */}
          <TouchableOpacity
            className={`hidden p-2 rounded-full ${theme.pageBgInverse}`}
            onPress={(e) => {
              e.stopPropagation(); // prevent triggering the Link
              onAddToCart?.();
              addToCart(product, true);
            }}
          >
            <Ionicons name="add" size={16} color={theme.pageBgInverse} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Link>
  );
};
