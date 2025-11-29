import { useThemedStyles } from "@/providers/theme";
import { Product } from "@/services/product/product.types";
import React, { useMemo } from "react";
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

type SkeletonItem = { id: string; skeleton: true };
type GridItem = Product | SkeletonItem;

interface ProductGridProps {
  data: Product[];
  horizontal?: boolean;
  numColumns?: number;
  scrollEnabled?: boolean;
  gap?: number;
  loading?: boolean; // Show skeletons
  loadingMore?: boolean; // Infinite scroll loader
  onEndReached?: () => void;
  skeletonCount?: number; // How many skeletons to show

  error?: any;
  onRetry?: () => void;

  ListHeaderComponent?: FlatListProps<GridItem>["ListHeaderComponent"];
  contentContainerStyle?: FlatListProps<GridItem>["contentContainerStyle"];
  stickyHeaderIndices?: FlatListProps<GridItem>["stickyHeaderIndices"];
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
  stickyHeaderIndices,
}) => {
  const theme = useThemedStyles();
  const { width } = useWindowDimensions();

  const cardWidth = horizontal
    ? 150
    : (width - gap * (numColumns - 1) - 35) / numColumns;

  // Show skeletons while loading
  const skeletons: SkeletonItem[] = useMemo(
    () =>
      Array.from({ length: skeletonCount }).map((_, i) => ({
        id: `skeleton-${i}`,
        skeleton: true as const,
      })),
    [skeletonCount]
  );

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (!loading && (!data || data.length === 0)) {
    return <EmptyState error={"No Product Found"} onRetry={onRetry} />;
  }

  return (
    <FlatList
      data={(loading ? skeletons : data) as GridItem[]}
      horizontal={horizontal}
      scrollEnabled={scrollEnabled}
      showsHorizontalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      stickyHeaderIndices={stickyHeaderIndices}
      contentContainerStyle={{
        gap,
        paddingBottom: 4,
        ...(contentContainerStyle as any),
      }}
      numColumns={horizontal ? undefined : numColumns}
      columnWrapperStyle={
        !horizontal
          ? {
              gap,
            }
          : undefined
      }
      keyExtractor={(item: GridItem, index) =>
        (item as any)?.id ? String((item as any).id) : `item-${index}`
      }
      renderItem={({ item, index }) =>
        (item as SkeletonItem).skeleton ? (
          <SkeletonCard width={cardWidth} horizontal={horizontal} />
        ) : (
          <ProductCard
            product={item as Product}
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
            <ActivityIndicator size="small" color={theme.primarySpinnerColor} />
          </View>
        ) : null
      }
    />
  );
};
