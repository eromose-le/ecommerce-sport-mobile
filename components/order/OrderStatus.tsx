import React from "react";
import { Text, View } from "react-native";

const OrderStatus = ({ status }: { status: string }) => {
  const normalized = status?.toLowerCase();
  const colorMap: Record<string, string> = {
    delivered: "bg-green-50 text-green-700",
    completed: "bg-green-50 text-green-700",
    pending: "bg-amber-50 text-amber-700",
    cancelled: "bg-red-50 text-red-600",
  };
  const classes = colorMap[normalized] || "bg-blue-50 text-blue-700";
  return (
    <View className={`px-3 py-1 rounded-full ${classes}`}>
      <Text className="text-xs capitalize font-jost-medium">{status}</Text>
    </View>
  );
};

export default OrderStatus;
