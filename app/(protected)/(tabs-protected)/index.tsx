import AppProtectedHeader from "@/components/common/AppProtectedHeader";
import { LoadingContent } from "@/components/common/LoadingContent";
import HeroSlider from "@/components/home/HeroSlider";
import Product from "@/components/product/Product";
import { BodyText, Container } from "@/components/ui";
import SafeContainer from "@/components/ui/layout/safe-container";
import { FIVE_MINUTES } from "@/constants";
import { SEARCH_PROTECTED } from "@/constants/urls";
import { useThemedStyles } from "@/providers/theme";
import { UserService } from "@/services/api";
import { IUserResponse } from "@/services/user/user.types";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProtectedHome() {
  const theme = useThemedStyles();
  const [isSticky, setIsSticky] = useState(false);
  const stickyAnim = useRef(new Animated.Value(0)).current;
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

  const handleScroll = (event: any) => {
    const offsetY = event?.nativeEvent?.contentOffset?.y ?? 0;
    setIsSticky(offsetY > 0);
  };

  useEffect(() => {
    Animated.timing(stickyAnim, {
      toValue: isSticky ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isSticky, stickyAnim]);

  const containerScale = stickyAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.99],
  });
  const containerTranslate = stickyAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });

  return (
    <SafeContainer
      edges={["top", "left", "right"]}
      padding="md"
      gap="md"
      className={`${theme.pageBg} flex-1`}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
        stickyHeaderIndices={[1]}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Header Logo */}
        <AppProtectedHeader />

        {/* Sticky Search Section */}
        <Animated.View
          style={{
            transform: [
              { translateY: containerTranslate },
              { scale: containerScale },
            ],
          }}
        >
          <Container
            className={classNames(
              "z-50 rounded-3xl",
              isSticky ? theme.mutedSurface : theme.pageBg
            )}
            padding={isSticky ? "md" : "none"}
            background="default"
          >
            <View className="flex-row items-center gap-1 mb-3">
              <BodyText
                size="sm"
                tone={theme.headingTone}
                className="mb-0"
                weight="light"
              >
                What are you buying today,
              </BodyText>
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
                      <Ionicons
                        name="reload-outline"
                        size={12}
                        color="#ef4444"
                      />
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
              className={classNames(
                "flex-row items-center gap-4 px-3 py-3 rounded-2xl",
                isSticky ? theme.pageBg : theme.mutedSurface
              )}
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
              <Ionicons
                name="search-outline"
                size={20}
                color={theme.iconMuted}
              />
            </TouchableOpacity>
          </Container>
        </Animated.View>

        {/* Hero Slider */}
        <View className="my-4">
          <HeroSlider />
        </View>

        <Product />
      </ScrollView>
    </SafeContainer>
  );
}
