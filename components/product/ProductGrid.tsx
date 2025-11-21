import { Product } from "@/services/product/product.types";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  useWindowDimensions,
  View,
} from "react-native";
import { EmptyState } from "../common/EmptyState";
import { ErrorState } from "../common/ErrorState";
import { ProductCard } from "./ProductCard";
import { SkeletonCard } from "./SkeletonCard";

interface ProductGridProps {
  data: Product[];
  horizontal?: boolean;
  numColumns?: number;
  scrollEnabled?: boolean;
  gap?: number;
  loading?: boolean; // NEW → Show skeletons
  loadingMore?: boolean; // NEW → Infinite scroll loader
  onEndReached?: () => void;
  skeletonCount?: number; // NEW → How many skeletons to show

  error?: any;
  onRetry?: () => void;

  ListHeaderComponent?: FlatListProps<Product>["ListHeaderComponent"];
  contentContainerStyle?: FlatListProps<Product>["contentContainerStyle"];
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  data,
  horizontal = false,
  numColumns = 2,
  scrollEnabled = false,
  gap = 12,
  loading = false,
  loadingMore = false,
  skeletonCount = 6,
  onEndReached,

  error,
  onRetry,

  ListHeaderComponent,
  contentContainerStyle,
}) => {
  const { width } = useWindowDimensions();

  const cardWidth = horizontal
    ? 150
    : (width - gap * (numColumns - 1) - 35) / numColumns;

  // Show skeletons while loading
  const skeletons = Array.from({ length: skeletonCount }).map((_, i) => ({
    id: `skeleton-${i}`,
    skeleton: true,
  }));

  if (error) {
    return (
      <>
        <ErrorState error={error} onRetry={onRetry} />
      </>
    );
  }

  if (!loading && (!data || data.length === 0)) {
    return (
      <>
        <EmptyState error={"No Product Found"} onRetry={onRetry} />;
      </>
    );
  }

  return (
    <FlatList
      data={loading ? skeletons : data}
      horizontal={horizontal}
      scrollEnabled={scrollEnabled}
      showsHorizontalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      contentContainerStyle={{
        gap,
        paddingBottom: 4,
        ...contentContainerStyle,
      }}
      numColumns={horizontal ? undefined : numColumns}
      columnWrapperStyle={
        !horizontal
          ? {
              gap,
            }
          : undefined
      }
      keyExtractor={(item: any, index) =>
        (item?.id ?? item?.key ?? `item-${index}`).toString()
      }
      renderItem={({ item, index }) =>
        item.skeleton ? (
          <SkeletonCard width={cardWidth} horizontal={horizontal} />
        ) : (
          <ProductCard
            product={item}
            width={cardWidth}
            horizontal={horizontal}
            index={index}
          />
        )
      }
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={
        loadingMore ? (
          <View className="items-center justify-center py-4">
            <ActivityIndicator size="small" color="#000" />
          </View>
        ) : null
      }
    />
  );
};
