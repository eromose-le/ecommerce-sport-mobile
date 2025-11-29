import { Order } from "@/services/order/order.types";
import { formatDate } from "@/utils/date";
import React from "react";
import { View } from "react-native";
import OrderItemRow from "./OrderItemRow";
import OrderStatus from "./OrderStatus";
import { BodyText, Heading } from "../ui";
import { useThemedStyles } from "@/providers/theme";

const OrderCard = ({ order }: { order: Order }) => {
  const theme = useThemedStyles();
  return (
    <View className={`p-4 mb-1 rounded ${theme.surface}`}>
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Heading
            level="h4"
            weight="semibold"
            tone={theme.headingTone}
            className="max-w-[250px] text-wrap"
          >
            Order #{order.id}
          </Heading>
          <BodyText size="xs" tone={theme.labelTone} className="mt-1">
            {formatDate(order.createdAt)} · {order.status}
          </BodyText>
        </View>
        <OrderStatus status={order.status} />
      </View>

      {(order.items ?? []).map((item, index) => (
        <OrderItemRow
          key={`${order.id}-${item.productId}-${item.orderId}`}
          order={order}
          item={item}
          isFirst={index === 0}
        />
      ))}
    </View>
  );
};

export default OrderCard;
