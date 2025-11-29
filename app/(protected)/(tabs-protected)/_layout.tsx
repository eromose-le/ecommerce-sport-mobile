import CartIcon from "@/assets/icons/cart.svg";
import HomeIcon from "@/assets/icons/home.svg";
import ProfileIcon from "@/assets/icons/profile.svg";
import ShopIcon from "@/assets/icons/shop.svg";
import AppLoader from "@/components/common/AppLoader";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { TabBarIcon } from "@/components/common/TabBarIcon";
import { showCartQtyValue } from "@/helpers/cart";
import { tabScreenOptions } from "@/helpers/tab-screen-options";
import { useTheme } from "@/providers/theme";
import { useCartStore } from "@/store/useCartStore";
import { Tabs } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

export default function ProtectedTabs() {
  const { theme: themeKey, isDark } = useTheme();
  const [hydrated, setHydrated] = useState(false);
  const cart = useCartStore((s) => s.cart);
  const badge = useMemo(() => showCartQtyValue(cart), [cart]);

  useEffect(() => {
    let isMounted = true;

    const unsub = useCartStore.persist.onFinishHydration(() => {
      if (isMounted) setHydrated(true);
    });

    if (useCartStore.persist.hasHydrated() && isMounted) {
      setHydrated(true);
    }

    return () => {
      isMounted = false;
      unsub?.();
    };
  }, []);

  if (!hydrated) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <AppLoader />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
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

        <Tabs.Screen
          name="notification"
          options={tabScreenOptions({
            Icon: ShopIcon,
            label: "Orders",
            title: "Orders",
            rightAction: () => <View className="w-10" />,
            showBack: false,
            isDark,
          })}
        />

        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                Icon={ProfileIcon}
                label="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </ErrorBoundary>
  );
}
