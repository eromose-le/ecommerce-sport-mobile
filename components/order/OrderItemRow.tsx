import ReviewModal from "@/components/review/ReviewModal";
import { PRODUCT_DETAIL } from "@/constants/urls";
import { Order, OrderItem } from "@/services/order/order.types";
import { resolveImageSource } from "@/utils/images";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { SecondaryButton } from "../ui";
import { BodyText } from "../ui";
import { useThemedStyles, useTheme } from "@/providers/theme";

const OrderItemRow = ({
  order,
  item,
  isFirst,
}: {
  order: Order;
  item: OrderItem;
  isFirst?: boolean;
}) => {
  const theme = useThemedStyles();
  const { isDark } = useTheme();
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
      className={`flex-row items-center gap-3 py-3 ${
        isFirst ? "pt-0" : isDark ? "border-t border-gray-800" : "border-t border-gray-100"
      }`}
    >
      <Image
        source={resolveImageSource(product?.displayImage)}
        className="w-16 h-16 rounded-lg"
      />
      <View className="flex-1">
        <BodyText size="sm" weight="medium" tone={theme.headingTone} numberOfLines={2}>
          {product?.name || "Unnamed product"}
        </BodyText>
        <BodyText size="xs" tone={theme.labelTone}>
          Qty: {item?.quantity ?? 1}
        </BodyText>
        <BodyText size="xs" tone={theme.labelTone}>
          Item #{item?.orderId}
        </BodyText>
      </View>
      <View className="items-end gap-2">
        {canReview ? (
          <TouchableOpacity
            onPress={() => setShowReview(true)}
            className={`px-4 py-2 rounded-full ${isDark ? "bg-white" : "bg-black"}`}
            activeOpacity={0.8}
          >
            <BodyText size="xs" weight="medium" tone={isDark ? "primary" : "inverse"}>
              Review
            </BodyText>
          </TouchableOpacity>
        ) : item?.reviewed ? (
          <View className={isDark ? "px-4 py-2 rounded-full bg-green-900/40" : "px-4 py-2 rounded-full bg-green-50"}>
            <BodyText size="xs" weight="medium" tone={isDark ? "inverse" : "success"}>
              Reviewed
            </BodyText>
          </View>
        ) : null}

        <SecondaryButton size="sm" title="View" onPress={handleViewProduct} />
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
