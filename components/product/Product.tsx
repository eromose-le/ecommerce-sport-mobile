import { Title } from "@/components/common/Title";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FIVE_MINUTES, PAGINATION_DEFAULT } from "@/constants";
import { PRODUCTS_PROTECTED, PRODUCTS_PUBLIC } from "@/constants/urls";
import { ProductService } from "@/services/api";
import { IProductResponse } from "@/services/product/product.types";

import { useAuth } from "@/providers/auth";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { View } from "react-native";
import { LinkButton } from "../ui";

export default function Product() {
  const { user } = useAuth();

  const {
    data: productData,
    isLoading: productIsLoading,
    error: productError,
    refetch: productRefetch,
  } = useQuery<IProductResponse>({
    queryKey: ["products", "id"],
    queryFn: () =>
      ProductService.fetchProducts({ ...PAGINATION_DEFAULT, limit: 4 }),
    retry: 2,
    staleTime: FIVE_MINUTES,
  });

  const productsResponse = productData?.data?.results || [];

  const handleSeeAll = () =>
    router.push(user ? PRODUCTS_PROTECTED : PRODUCTS_PUBLIC);

  return (
    <>
      {/* Categories */}
      {/* <View className="mt-5 mb-7">
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
      </View> */}

      {/* Best Selling Section */}
      <View className="mt-2 mb-4">
        <Title
          title="New arrival"
          actionText="See all"
          onActionPress={handleSeeAll}
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

      <View className="mt-2 mb-4">
        <LinkButton title="See all products" onPress={handleSeeAll} />
      </View>

      {/* Recently Viewed Section */}
      <View className="mb-0">
        <Title
          title="Recently viewed"
          actionText="See all"
          onActionPress={handleSeeAll}
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
