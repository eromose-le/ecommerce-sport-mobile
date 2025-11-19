import { Order } from "@/services/order/order.types";
import { formatDate } from "@/utils/date";
import React from "react";
import { Text, View } from "react-native";
import OrderItemRow from "./OrderItemRow";
import OrderStatus from "./OrderStatus";

const OrderCard = ({ order }: { order: Order }) => {
  return (
    <View className="p-4 mb-6 bg-white border border-gray-200 rounded-2xl">
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="max-w-[250px] text-base font-jost-semibold text-primary text-wrap">
            Order #{order.id}
          </Text>
          <Text className="mt-1 text-xs text-secondary">
            {formatDate(order.createdAt)} · {order.status}
          </Text>
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
