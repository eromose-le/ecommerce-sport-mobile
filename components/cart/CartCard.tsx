import { PRODUCT_DETAIL } from "@/constants/urls";
import { showSinglePriceInCart } from "@/helpers/cart";
import { CartItem } from "@/services/cart/cart.types";
import { formatCurrency } from "@/utils/currency";
import { resolveImageSource } from "@/utils/images";
import { Ionicons } from "@expo/vector-icons";
import classNames from "classnames";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type CartCardProps = {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
};

const CartCard: React.FC<CartCardProps> = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  const qty = Math.max(1, item?.variant?.qty || 1);
  const lineTotal = showSinglePriceInCart(item);
  const imageSource = resolveImageSource(
    item?.displayImage || item?.product?.displayImage
  );

  const isDisableIncreament = qty <= 1;

  return (
    <Link
      href={{
        pathname: PRODUCT_DETAIL,
        params: { id: item?.id, product: JSON.stringify(item) },
      }}
      asChild
    >
      <TouchableOpacity className="flex-1 mb-8">
        <View className="flex-row items-center gap-4">
          {/* Product Image */}
          <Image
            source={imageSource}
            className="w-36 h-24 rounded-xl bg-[#E8EAEC]"
            resizeMode="cover"
          />

          {/* Details */}
          <View className="flex-1 ml-4">
            <Text className="text-lg font-jost-medium" numberOfLines={1}>
              {item.name}
            </Text>
            <Text
              numberOfLines={2}
              className="mt-1 text-sm text-secondary font-jost"
            >
              {item.description || "No description added"}
            </Text>

            <Text className="mt-2 text-base font-bold">
              {formatCurrency(lineTotal)}
            </Text>

            {/* Quantity Controls */}
            <View className="flex-row items-center mt-2">
              <TouchableOpacity
                className={classNames(
                  isDisableIncreament
                    ? "border-gray-300 bg-[#eee]"
                    : "bg-black",
                  "px-3 py-2 border border-black rounded"
                )}
                onPress={onDecrement}
                disabled={isDisableIncreament}
              >
                <Ionicons
                  name="remove"
                  size={14}
                  color={isDisableIncreament ? "#aaa" : "white"}
                />
              </TouchableOpacity>

              <Text className="mx-3 font-jost">{qty}</Text>

              <TouchableOpacity
                className="px-3 py-2 bg-black border border-black rounded"
                onPress={onIncrement}
              >
                <Ionicons name="add" size={14} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="flex-row items-center justify-between mt-2">
          {/* Save for later */}
          <TouchableOpacity
            disabled
            className="px-4 py-2 border border-gray-300 rounded-xl w-fit"
          >
            <Text className="text-sm font-jost text-secondary">
              Save for later
            </Text>
          </TouchableOpacity>

          {/* Trash Icon */}
          <TouchableOpacity onPress={onRemove} hitSlop={8}>
            <Ionicons name="trash-outline" size={22} color="red" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default CartCard;
