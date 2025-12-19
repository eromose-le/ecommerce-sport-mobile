import { Title } from "@/components/common/Title";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FIVE_MINUTES } from "@/constants";
import { PRODUCTS_PROTECTED, PRODUCTS_PUBLIC } from "@/constants/urls";
import { ProductService } from "@/services/api";
import { IProductResponse } from "@/services/product/product.types";

import { useAuth } from "@/providers/auth";
import { useTheme, useThemedStyles } from "@/providers/theme";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { View } from "react-native";
import CategorySlider from "../home/CategorySlider";
import { SecondaryButton } from "../ui";

export default function Product() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const theme = useThemedStyles();

  const christmasQuery = {
    random: true,
    limit: 6,
    instance: "christmasDeal",
  } as const;

  const recentArrivalQuery = {
    limit: 6,
    instance: "recentArrival",
  } as const;

  const {
    data: christmasData,
    isLoading: christmasLoading,
    error: christmasError,
    refetch: christmasRefetch,
  } = useQuery<IProductResponse>({
    queryKey: ["products", "christmas-deal", christmasQuery],
    queryFn: () => ProductService.fetchProducts(christmasQuery),
    retry: 2,
    staleTime: FIVE_MINUTES,
  });

  const {
    data: recentArrivalData,
    isLoading: recentArrivalLoading,
    error: recentArrivalError,
    refetch: recentArrivalRefetch,
  } = useQuery<IProductResponse>({
    queryKey: ["products", "recent-arrival", recentArrivalQuery],
    queryFn: () => ProductService.fetchProducts(recentArrivalQuery),
    retry: 2,
    staleTime: FIVE_MINUTES,
  });

  const christmasProducts = christmasData?.data?.results || [];
  const recentArrivalProducts = recentArrivalData?.data?.results || [];

  const handleSeeAll = () =>
    router.push(user ? PRODUCTS_PROTECTED : PRODUCTS_PUBLIC);

  return (
    <>
      {/* Categories */}
      <CategorySlider />

      {/* CHRISTMAS DEALS. Section */}
      <View className="mt-2 mb-4">
        <Title
          title="CHRISTMAS DEALS."
          actionText="See all"
          onActionPress={handleSeeAll}
        />

        <View className="flex items-center justify-center w-full">
          <ProductGrid
            data={christmasProducts}
            loading={christmasLoading}
            error={christmasError}
            onRetry={christmasRefetch}
            loadingMore={false}
            onEndReached={() => {}}
            numColumns={2}
            skeletonCount={6}
            gap={12}
            scrollEnabled={false}
          />
        </View>
      </View>

      {/* <View className="mt-2 mb-4">
        <LinkButton title="See all products" onPress={handleSeeAll} />
      </View> */}
      <View className="mx-auto mt-2 mb-4 w-fit">
        <SecondaryButton
          size="sm"
          title="See all products"
          onPress={handleSeeAll}
          className={`w-fit items-center justify-center rounded-full border-2 ${isDark ? "border-[#0f172a]" : theme.surface}`}
        />
      </View>

      {/* RECENT ARRIVAL. Section */}
      <View className="mb-0">
        <Title
          title="RECENT ARRIVAL."
          actionText="See all"
          onActionPress={handleSeeAll}
        />

        <ProductGrid
          data={recentArrivalProducts}
          loading={recentArrivalLoading}
          error={recentArrivalError}
          onRetry={recentArrivalRefetch}
          horizontal
          scrollEnabled
          skeletonCount={6}
          gap={12}
        />
      </View>
    </>
  );
}
