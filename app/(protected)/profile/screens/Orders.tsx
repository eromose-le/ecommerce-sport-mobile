import { PRODUCT_DETAIL } from "@/constants/urls";
import { useAuth } from "@/providers/auth";
import { OrderService } from "@/services/api";
import { Order, OrderItem } from "@/services/order/order.types";
import { formatDate } from "@/utils/date";
import { resolveImageSource } from "@/utils/images";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Orders = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["orders", user?.id, page],
    queryFn: () =>
      OrderService.fetchOrders({
        userId: user?.id as string,
        sort: "asc",
        page,
        limit,
      }),
    enabled: !!user?.id,
    staleTime: 1000 * 30,
  });

  const orders = data?.data?.results ?? [];
  const totalPages = data?.data?.pageCount ?? 1;

  if (!user?.id) {
    return (
      <EmptyState message="Sign in to view your orders." icon="cart-outline" />
    );
  }

  return (
    <ScrollView
      className="flex-1 px-6 pt-6"
      contentContainerStyle={{ paddingBottom: 32 }}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
      }
    >
      {isLoading ? (
        <View className="items-center justify-center py-20">
          <ActivityIndicator size="large" />
        </View>
      ) : orders.length === 0 ? (
        <EmptyState message="No orders yet" icon="bag-handle-outline" />
      ) : (
        orders.map((order) => (
          <OrderCard key={String(order.id)} order={order} />
        ))
      )}

      {totalPages > 1 && (
        <View className="flex-row items-center justify-center gap-4 pt-4 pb-10">
          <PaginationButton
            icon="chevron-back"
            disabled={page === 1}
            onPress={() => setPage((p) => Math.max(1, p - 1))}
          />
          <Text className="text-sm text-secondary">
            Page {page} of {totalPages}
          </Text>
          <PaginationButton
            icon="chevron-forward"
            disabled={page === totalPages}
            onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default Orders;

const OrderCard = ({ order }: { order: Order }) => (
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
      <StatusPill status={order.status} />
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

const StatusPill = ({ status }: { status: string }) => {
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

const PaginationButton = ({
  icon,
  disabled,
  onPress,
}: {
  icon: any;
  disabled?: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    disabled={disabled}
    onPress={onPress}
    className={`rounded-full border border-gray-200 p-2 ${disabled ? "opacity-40" : ""}`}
  >
    <Ionicons name={icon} size={18} color="#111" />
  </TouchableOpacity>
);

const EmptyState = ({ message, icon }: { message: string; icon: any }) => (
  <View className="items-center justify-center py-20">
    <View className="items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
      <Ionicons name={icon} size={28} color="#9CA3AF" />
    </View>
    <Text className="text-sm text-center text-secondary">{message}</Text>
  </View>
);
