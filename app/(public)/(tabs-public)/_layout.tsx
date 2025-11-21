import CartIcon from "@/assets/icons/cart.svg";
import HomeIcon from "@/assets/icons/home.svg";
import { TabBarIcon } from "@/components/common/TabBarIcon";
import { showCartQtyValue } from "@/helpers/cart";
import { tabScreenOptions } from "@/helpers/tab-screen-options";
import { useCartStore } from "@/store/useCartStore";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function PublicTabs() {
  const cart = useCartStore((state) => state.cart);
  const badge = showCartQtyValue(cart);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "transparent",
          height: 74,
          paddingTop: 10,
          paddingBottom: 5,
        },
        lazy: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
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
        })}
      />
    </Tabs>
  );
}
