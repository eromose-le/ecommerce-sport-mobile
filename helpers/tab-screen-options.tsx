import { BackButton } from "@/components/common/BackButton";
import { TabBarIcon } from "@/components/common/TabBarIcon";
import { JSX } from "react";
import { Text, View } from "react-native";

export function tabScreenOptions({
  Icon,
  label,
  title,
  rightAction,
  badgeCount,
  showBack = true,
}: {
  Icon: any;
  label: string;
  title: string;
  rightAction?: () => JSX.Element;
  badgeCount?: number;
  showBack?: boolean;
}) {
  return {
    title,
    headerShown: true,

    // HEADER STYLING
    headerStyle: {
      height: 110,
      borderBottomWidth: 0,
      elevation: 0,
      shadowOpacity: 0,
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
      <Text className="text-xl text-center font-jost-semibold">{title}</Text>
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
