import { Title } from "@/components/common/Title";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FIVE_MINUTES, PAGINATION_DEFAULT } from "@/constants";
import { ProductService } from "@/services/api";
import { IProductResponse } from "@/services/product/product.types";

import { AppToast } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Product() {
  const {
    data: productData,
    isLoading: productIsLoading,
    error: productError,
    refetch: productRefetch,
    isSuccess: productIsSuccess,
  } = useQuery<IProductResponse>({
    queryKey: ["products", "id"],
    queryFn: () => ProductService.fetchProducts(PAGINATION_DEFAULT),
    retry: 2,
    staleTime: FIVE_MINUTES,
  });

  useEffect(() => {
    if (productIsSuccess) {
      AppToast.success(`Product retived!`);
    }
  }, [productData, productIsSuccess]);

  const productsResponse = productData?.data?.results || [];

  return (
    <>
      {/* Categories */}
      <View className="mt-5 mb-7">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {[
            { name: "All", icon: "bag-handle-outline" },
            { name: "Equipment", icon: "barbell-outline" },
            { name: "Apparels", icon: "shirt-outline" },
            { name: "Sports", icon: "game-controller-outline" },
          ].map((item, idx) => (
            <TouchableOpacity
              key={idx}
              className="flex-row items-center px-4 py-3 mr-3 bg-transparent h-12 border border-[#0000001A] rounded-3xl"
            >
              <Ionicons name={item.icon as any} size={18} color="black" />
              <Text className="ml-2 text-gray-700">{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Best Selling Section */}
      <View className="mb-8">
        <Title
          title="New arrival"
          actionText="See all"
          onActionPress={() => {}}
        />

        <View className="flex items-center justify-center w-full">
          <ProductGrid
            data={productsResponse}
            loading={productIsLoading}
            error={productError}
            onRetry={productRefetch}
            loadingMore={false}
            onEndReached={() => {}}
            numColumns={2}
            skeletonCount={2}
            gap={12}
            scrollEnabled={false}
          />
        </View>
      </View>

      {/* Recently Viewed Section */}
      <View className="mb-0">
        <Title
          title="Recently viewed"
          actionText="See all"
          onActionPress={() => {}}
        />

        <ProductGrid
          data={productsResponse}
          loading={productIsLoading}
          error={productError}
          onRetry={productRefetch}
          horizontal
          scrollEnabled
          skeletonCount={3}
          gap={12}
        />
      </View>
    </>
  );
}
