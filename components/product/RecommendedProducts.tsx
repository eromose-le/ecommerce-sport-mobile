import { FIVE_MINUTES } from "@/constants";
import { ProductService } from "@/services/api";
import {
  IProductResponse,
  Product,
  TProductQuery,
} from "@/services/product/product.types";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { Text, View } from "react-native";

import { ProductGrid } from "./ProductGrid";

type RecommendedProductsProps = {
  categoryId?: string;
  subcategoryId?: string;
  currentProductId?: string | number;
};

export const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
  categoryId,
  subcategoryId,
  currentProductId,
}) => {
  const queryParams = useMemo<TProductQuery | null>(() => {
    if (!categoryId && !subcategoryId) return null;

    const params: TProductQuery = {
      limit: 12,
      instance: "recommendedProducts",
    };

    if (categoryId) params.category = categoryId;
    if (subcategoryId) params.subcategory = subcategoryId;

    return params;
  }, [categoryId, subcategoryId]);

  const { data, isLoading, isFetching, error, refetch } =
    useQuery<IProductResponse>({
      queryKey: ["products", "recommended", queryParams],
      queryFn: () => ProductService.fetchProducts(queryParams || undefined),
      enabled: !!queryParams,
      retry: 1,
      staleTime: FIVE_MINUTES,
    });

  const recommendedProducts = useMemo(() => {
    const results: Product[] = data?.data?.results || [];
    if (!currentProductId) return results;

    const currentId = String(currentProductId);
    return results.filter((product) => String(product.id) !== currentId);
  }, [currentProductId, data]);

  if (!queryParams) return null;

  return (
    <View className="px-4 mt-8 mb-0">
      <Text className="mb-3 text-lg font-jost-bold">
        Other recommended products
      </Text>

      <ProductGrid
        data={recommendedProducts}
        loading={isLoading || isFetching}
        error={error}
        onRetry={refetch}
        horizontal
        scrollEnabled
        skeletonCount={3}
        gap={12}
      />
    </View>
  );
};
