import { BackButton } from "@/components/common/BackButton";
import { TabBarIcon } from "@/components/common/TabBarIcon";
import { Heading } from "@/components/ui";
import { JSX } from "react";
import { View } from "react-native";

export function tabScreenOptions({
  Icon,
  label,
  title,
  rightAction,
  badgeCount,
  showBack = true,
  isDark = false,
}: {
  Icon: any;
  label: string;
  title: string;
  rightAction?: () => JSX.Element;
  badgeCount?: number;
  showBack?: boolean;
  isDark?: boolean;
}) {
  return {
    title,
    headerShown: true,

    // HEADER STYLING
    headerStyle: {
      height: 110,
      borderBottomWidth: 0.2,
      elevation: 0,
      shadowOpacity: 0,
      backgroundColor: isDark ? "#0B0B0F" : "#FFFFFF",
    },

    // TAB ICON
    tabBarIcon: ({ focused }: any) => (
      <TabBarIcon
        Icon={Icon}
        label={label}
        focused={focused}
        badgeCount={badgeCount}
      />
    ),

    // HEADER TITLE
    headerTitle: () => (
      <Heading level="h3" align="center" weight="semibold">
        {title}
      </Heading>
    ),

    // HEADER LEFT — BACK BUTTON
    headerLeft: () =>
      showBack ? (
        <View className="mb-1 ml-5">
          <BackButton />
        </View>
      ) : (
        <View className="w-10" />
      ),

    // RIGHT (Custom or default spacer)
    headerRight: () =>
      rightAction ? (
        <View className="mb-1 mr-5">{rightAction()}</View>
      ) : (
        <View className="w-10" />
      ),
  };
}
