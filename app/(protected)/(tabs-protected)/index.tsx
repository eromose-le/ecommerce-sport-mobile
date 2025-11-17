import LogoIcon from "@/assets/icons/logo.svg";
import LogoutIcon from "@/assets/icons/logout.svg";
import { LoadingContent } from "@/components/common/LoadingContent";
import { SvgIcon } from "@/components/common/SvgIcon";
import { Title } from "@/components/common/Title";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useAppState } from "@/hooks/useAppState";
import { useAuthUser } from "@/hooks/useAuthUser";
import { products } from "@/lib/dummy-data";
import { useAuth } from "@/providers/auth";
import { ProductService, UserService } from "@/services/api";
import { IProductResponse } from "@/services/product/product.types";
import { IUserResponse } from "@/services/user/user.types";

import { Logger } from "@/utils/logger";
import { AppToast } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProtectedHome() {
  const { logout } = useAuth();

  const appState = useAppState();
  const userState = useAuthUser();

  Logger.info("APP_STATE", appState);
  Logger.info("USER_STATE", userState);
  Logger.dump("LABEL", "(PROTECTED) home ==::");

  const { data, isLoading, error, refetch, isSuccess } =
    useQuery<IUserResponse>({
      queryKey: ["users", "me"],
      queryFn: UserService.fetchMe,
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

  const {
    data: productData,
    isLoading: productIsLoading,
    error: productError,
    refetch: productRefetch,
    isSuccess: productIsSuccess,
  } = useQuery<IProductResponse>({
    queryKey: ["products", "id"],
    queryFn: () => ProductService.fetchProducts({ limit: 4 }),
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (isSuccess) {
      AppToast.success(`${data?.data?.firstName}'s profile retived!`);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (productIsSuccess) {
      AppToast.success(`Product retived!`);
    }
  }, [data, productIsSuccess]);

  const userResponse = data?.data || null;
  const productsResponse = productData?.data?.results || [];

  const customerName = `${data?.data?.firstName} ${data?.data?.lastName}`;

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-background"
    >
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        stickyHeaderIndices={[1]}
      >
        {/* Header Logo */}
        <View className="flex-row items-center justify-between mb-2">
          <SvgIcon Icon={LogoIcon} size={75} />

          {/* <TouchableOpacity
            onPress={logout}
            className="items-center justify-center bg-black rounded-full w-9 h-9"
          >
            <Text className="font-semibold text-white">E</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={logout}
            className="items-center justify-center"
          >
            <SvgIcon Icon={LogoutIcon} size={28} />
          </TouchableOpacity>
        </View>

        {/* Sticky Search Section */}
        <View className="z-50 pt-2 pb-3 bg-background">
          <View className="flex-row items-center gap-1 mb-3">
            <Text className="text-sm font-light text-secondary font-jost">
              What are you buying today?
            </Text>
            <LoadingContent
              loading={isLoading}
              loadingClassName="flex absolute p-0 m-0 left-44"
              error={error}
              onRetry={refetch}
              data={userResponse}
            >
              <Text className="text-sm font-light text-secondary font-jost">
                {customerName}
              </Text>
            </LoadingContent>
          </View>

          <View className="flex-row items-center px-3 py-3 bg-[#F0F0F0] gap-4 rounded-2xl">
            <TouchableOpacity className="flex-row items-center px-6 py-2 mr-2 bg-white rounded-xl">
              <Text className="mr-2 text-sm font-bold text-primary">
                Products
              </Text>
              <Ionicons name="chevron-down" size={14} color="black" />
            </TouchableOpacity>

            <TextInput
              // onPress={() => console.log("search")}
              // value=""
              // onChangeText={() => {}}
              placeholder="Search..."
              placeholderTextColor="#aaa"
              className="flex-1 text-secondary font-jost-semibold"
            />
            <Ionicons name="search-outline" size={20} color="black" />
          </View>
        </View>

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
            title="Best selling"
            actionText="See all"
            onActionPress={() => {}}
          />

          <View className="flex items-center justify-center w-full">
            <ProductGrid
              data={productsResponse}
              loading={productIsLoading}
              loadingMore={false}
              onEndReached={() => {}}
              numColumns={2}
              skeletonCount={2}
              gap={12}
              scrollEnabled={false}
            />

            <LoadingContent
              loading={productIsLoading}
              error={productError}
              onRetry={productRefetch}
              data={productsResponse}
              EmptyComponent={<Text>Product data not found!</Text>}
            >
              <ProductGrid
                data={productsResponse}
                numColumns={2}
                gap={12}
                scrollEnabled={false}
              />
            </LoadingContent>
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
            data={products}
            horizontal
            scrollEnabled
            loading={true}
            skeletonCount={3}
          />

          <ProductGrid data={products} horizontal gap={12} scrollEnabled />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
