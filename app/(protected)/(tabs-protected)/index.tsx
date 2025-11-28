import AppProtectedHeader from "@/components/common/AppProtectedHeader";
import { LoadingContent } from "@/components/common/LoadingContent";
import Product from "@/components/product/Product";
import { Container } from "@/components/ui";
import { FIVE_MINUTES } from "@/constants";
import { SEARCH_PROTECTED } from "@/constants/urls";
import { UserService } from "@/services/api";
import { IUserResponse } from "@/services/user/user.types";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProtectedHome() {
  const { data, isLoading, error, refetch } = useQuery<IUserResponse>({
    queryKey: ["users", "me"],
    queryFn: UserService.fetchMe,
    retry: 2,
    staleTime: FIVE_MINUTES,
  });

  const userResponse = data?.data || null;
  const userName =
    `${data?.data?.firstName ?? ""} ${data?.data?.lastName ?? ""}`.trim() ||
    "Guest";

  const handleSearchPress = () => {
    router.push(SEARCH_PROTECTED);
  };

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-background"
    >
      {/* <TailwindVariantPreview /> */}

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        stickyHeaderIndices={[1]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Logo */}
        <Container padding="md" background="default">
          <AppProtectedHeader />
        </Container>

        {/* Sticky Search Section */}
        <Container className="z-50" padding="md" background="default">
          <View className="flex-row items-center gap-1 mb-3">
            <Text className="text-sm font-light text-secondary font-jost">
              What are you buying today,
            </Text>
            <LoadingContent
              loading={isLoading}
              loadingClassName="flex absolute p-0 m-0 left-44"
              error={error}
              onRetry={refetch}
              data={userResponse}
              LoadingComponent={<ActivityIndicator size="small" />}
              ErrorComponent={(error, refetch) => (
                <View className="flex-row items-center gap-2">
                  <Text className="text-xs text-[#ef4444]">
                    {error?.message}
                  </Text>
                  <TouchableOpacity onPress={refetch}>
                    <Ionicons name="reload-outline" size={12} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              )}
            >
              <Text className="text-sm font-light text-secondary font-jost">
                {userName}?
              </Text>
            </LoadingContent>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSearchPress}
            className="flex-row items-center px-3 py-3 bg-[#F0F0F0] gap-4 rounded-2xl"
          >
            <View className="flex-row items-center px-6 py-2 mr-2 bg-white rounded-xl">
              <Text className="mr-2 text-sm font-bold text-primary">
                Products
              </Text>
              {/* <Ionicons name="chevron-down" size={14} color="black" /> */}
            </View>

            <Text className="flex-1 text-secondary font-jost-medium">
              I am looking for...
            </Text>
            <Ionicons name="search-outline" size={20} color="black" />
          </TouchableOpacity>
        </Container>

        <Container padding="md" background="default">
          <Product />
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
}
