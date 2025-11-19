import LogoutIcon from "@/assets/icons/logout.svg";
import { LoadingContent } from "@/components/common/LoadingContent";
import Logo from "@/components/common/Logo";
import { SvgIcon } from "@/components/common/SvgIcon";
import Product from "@/components/product/Product";
import { FIVE_MINUTES } from "@/constants";
import { PROFILE } from "@/constants/urls";
import { useAuth } from "@/providers/auth";
import { UserService } from "@/services/api";
import { IUserResponse } from "@/services/user/user.types";

import { AppToast } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProtectedHome() {
  const { logout } = useAuth();

  const { data, isLoading, error, refetch, isSuccess } =
    useQuery<IUserResponse>({
      queryKey: ["users", "me"],
      queryFn: UserService.fetchMe,
      retry: 2,
      staleTime: FIVE_MINUTES,
    });

  useEffect(() => {
    if (isSuccess) {
      AppToast.success(`${data?.data?.firstName}'s profile retived!`);
    }
  }, [data, isSuccess]);

  const userResponse = data?.data || null;
  const userName = `${data?.data?.firstName} ${data?.data?.lastName}`;

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
          <Logo />

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => router.push(PROFILE)}
              className="items-center justify-center bg-black rounded-full w-9 h-9"
            >
              <Text className="font-semibold text-white">{userName[0]}</Text>
            </TouchableOpacity>
            <View>
              <TouchableOpacity
                onPress={logout}
                className="items-center justify-center"
              >
                <SvgIcon Icon={LogoutIcon} size={28} />
              </TouchableOpacity>
              <Text className="mb-3 text-xs font-light text-secondary font-jost">
                Log out
              </Text>
            </View>
          </View>
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
                {userName}
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
              placeholder="Search..."
              placeholderTextColor="#aaa"
              className="flex-1 text-secondary font-jost-semibold"
            />
            <Ionicons name="search-outline" size={20} color="black" />
          </View>
        </View>

        <Product />
      </ScrollView>
    </SafeAreaView>
  );
}
