import { useAuth } from "@/providers/auth";
import { OrderService } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { EmptyState } from "../common/EmptyState";
import { LoadingContent } from "../common/LoadingContent";
import OrderCard from "./OrderCard";
import OrderPaginationButton from "./OrderPaginationButton";

const Order = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const limit = 3;
  const { data, error, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["orders", user?.id, page],
    queryFn: () =>
      OrderService.fetchOrders({
        userId: user?.id as string,
        sort: "desc",
        page,
        limit,
      }),
    enabled: !!user?.id,
    staleTime: 1000 * 30,
  });

  const ordersResponse = data?.data?.results ?? [];
  const totalPages = data?.data?.pageCount ?? 1;

  if (!user?.id) {
    return (
      <EmptyState
        icon={<Ionicons name={"cart-outline"} size={38} color="#ddd" />}
        error="Sign in to view your orders."
      />
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
      <LoadingContent
        loading={isLoading}
        error={error}
        onRetry={refetch}
        data={ordersResponse}
        EmptyComponent={(error, onRetry) => (
          <View className="items-center">
            <EmptyState
              icon={
                <Ionicons name={"bag-handle-outline"} size={38} color="#ddd" />
              }
              error="No orders yet"
              onRetry={onRetry}
            />
          </View>
        )}
      >
        <>
          {ordersResponse?.map((order) => (
            <OrderCard key={String(order?.id)} order={order} />
          ))}

          {totalPages > 1 && (
            <View className="flex-row items-center justify-center gap-4 pt-4 pb-10">
              <OrderPaginationButton
                icon="chevron-back"
                disabled={page === 1}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
              />
              <Text className="text-sm text-secondary">
                Page {page} of {totalPages}
              </Text>
              <OrderPaginationButton
                icon="chevron-forward"
                disabled={page === totalPages}
                onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
              />
            </View>
          )}
        </>
      </LoadingContent>
    </ScrollView>
  );
};

export default Order;
