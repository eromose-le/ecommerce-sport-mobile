import ReviewModal from "@/components/review/ReviewModal";
import { PRODUCT_DETAIL } from "@/constants/urls";
import { Order, OrderItem } from "@/services/order/order.types";
import { resolveImageSource } from "@/utils/images";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
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
  const [showReview, setShowReview] = useState(false);
  const productId = useMemo(
    () => item?.productId || product?.id || product?.id,
    [item?.productId, product]
  );

  const isDelivered = useMemo(() => {
    const status = order?.status?.toLowerCase?.() || "";
    return (
      status === "delivered" ||
      status === "completed" ||
      status === "fulfilled" ||
      !!item?.productCompleted
    );
  }, [item?.productCompleted, order?.status]);

  const canReview = !!productId && isDelivered && !item?.reviewed;

  const handleViewProduct = () => {
    if (!productId) return;
    router.push({
      pathname: PRODUCT_DETAIL,
      params: {
        id: String(productId),
        product: JSON.stringify(product || { id: productId }),
      },
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
      <View className="items-end gap-2">
        {canReview ? (
          <TouchableOpacity
            onPress={() => setShowReview(true)}
            className="px-4 py-2 bg-black rounded-full"
            activeOpacity={0.8}
          >
            <Text className="text-xs text-white font-jost-medium">Review</Text>
          </TouchableOpacity>
        ) : item?.reviewed ? (
          <View className="px-4 py-2 rounded-full bg-green-50">
            <Text className="text-xs text-green-700 font-jost-medium">
              Reviewed
            </Text>
          </View>
        ) : null}

        <TouchableOpacity
          onPress={handleViewProduct}
          className="px-4 py-2 border rounded-full border-primary"
        >
          <Text className="text-xs font-jost-medium text-primary">View</Text>
        </TouchableOpacity>
      </View>

      {canReview && productId ? (
        <ReviewModal
          visible={showReview}
          onClose={() => setShowReview(false)}
          productId={String(productId)}
          productName={product?.name}
        />
      ) : null}
    </View>
  );
};

export default OrderItemRow;
