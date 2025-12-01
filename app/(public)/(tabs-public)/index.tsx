import AppPublicHeader from "@/components/common/AppPublicHeader";
import Product from "@/components/product/Product";
import { BodyText, Container } from "@/components/ui";
import SafeContainer from "@/components/ui/layout/safe-container";
import { SEARCH_PUBLIC } from "@/constants/urls";
import { useThemedStyles } from "@/providers/theme";

import { Ionicons } from "@expo/vector-icons";
import classNames from "classnames";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PublicHome() {
  const theme = useThemedStyles();
  const [isSticky, setIsSticky] = useState(false);
  const stickyAnim = useRef(new Animated.Value(0)).current;

  const handleSearchPress = () => {
    router.push(SEARCH_PUBLIC);
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
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
        stickyHeaderIndices={[1]}
        onScroll={handleScroll}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
      >
        {/* Header Logo */}
        <AppPublicHeader />

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
            <BodyText
              size="sm"
              tone={theme.headingTone}
              className="mb-3"
              weight="light"
            >
              What are you buying today?
            </BodyText>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSearchPress}
              className={classNames(
                "flex-row items-center px-3 py-3 gap-4 rounded-2xl",
                isSticky ? theme.pageBg : theme.mutedSurface
              )}
            >
              <View
                className={classNames(
                  "flex-row items-center px-6 bg-white py-2 mr-2 rounded-xl"
                )}
              >
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

        <Product />
      </ScrollView>
    </SafeContainer>
  );
}
