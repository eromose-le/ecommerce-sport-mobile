import CartIcon from "@/assets/icons/cart.svg";
import HomeIcon from "@/assets/icons/home.svg";
import { TabBarIcon } from "@/components/common/TabBarIcon";
import { showCartQtyValue } from "@/helpers/cart";
import { tabScreenOptions } from "@/helpers/tab-screen-options";
import { useTheme } from "@/providers/theme";
import { useCartStore } from "@/store/useCartStore";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function PublicTabs() {
  const { isDark } = useTheme();
  const cart = useCartStore((s) => s.cart);
  const badge = showCartQtyValue(cart);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        lazy: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#0B0B0F" : "#FFFFFF",
          borderTopColor: "transparent",
          height: 74,
          paddingTop: 10,
          paddingBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon Icon={HomeIcon} label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={tabScreenOptions({
          Icon: CartIcon,
          label: "Cart",
          title: "Cart",
          rightAction: () => <View className="w-10" />,
          badgeCount: badge.value,
          showBack: false,
          isDark,
        })}
      />
    </Tabs>
  );
}
