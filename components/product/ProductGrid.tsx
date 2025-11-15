import { Product } from "@/types/product";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
  View,
} from "react-native";
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
      }}
      numColumns={horizontal ? undefined : numColumns}
      columnWrapperStyle={
        !horizontal
          ? {
              gap,
            }
          : undefined
      }
      keyExtractor={(item: any) => item.id.toString()}
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
