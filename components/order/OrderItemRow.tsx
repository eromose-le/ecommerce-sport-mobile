import { PRODUCT_DETAIL } from "@/constants/urls";
import { Order, OrderItem } from "@/services/order/order.types";
import { resolveImageSource } from "@/utils/images";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const OrderItemRow = ({
  order,
  item,
  isFirst,
}: {
  order: Order;
  item: OrderItem;
  isFirst?: boolean;
}) => {
  const product = item?.product;

  const handleViewProduct = () => {
    if (!product?.id) return;
    router.push({
      pathname: PRODUCT_DETAIL,
      params: { id: String(product?.id), product: JSON.stringify(product) },
    });
  };

  return (
    <View
      className={`flex-row items-center gap-4 py-3 ${
        isFirst ? "pt-0" : "border-t border-gray-100"
      }`}
    >
      <Image
        source={resolveImageSource(product?.displayImage)}
        className="w-16 h-16 rounded-lg"
      />
      <View className="flex-1">
        <Text
          className="text-sm font-jost-medium text-primary"
          numberOfLines={2}
        >
          {product?.name || "Unnamed product"}
        </Text>
        <Text className="text-xs text-secondary">
          Qty: {item?.quantity ?? 1}
        </Text>
        <Text className="text-xs text-secondary">Item #{item?.orderId}</Text>
      </View>
      <TouchableOpacity
        onPress={handleViewProduct}
        className="px-4 py-2 border rounded-full border-primary"
      >
        <Text className="text-xs font-jost-medium text-primary">View</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderItemRow;
