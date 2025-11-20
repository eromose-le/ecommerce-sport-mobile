import CartIcon from "@/assets/icons/cart.svg";
import HomeIcon from "@/assets/icons/home.svg";
import NotificationIcon from "@/assets/icons/notification.svg";
import ProfileIcon from "@/assets/icons/profile.svg";
import { TabBarIcon } from "@/components/common/TabBarIcon";
import { tabScreenOptions } from "@/helpers/tab-screen-options";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function ProtectedTabs() {
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
          badgeCount: 100,
          showBack: false,
        })}
      />
      <Tabs.Screen
        name="notification"
        options={tabScreenOptions({
          Icon: NotificationIcon,
          label: "Notifications",
          title: "Notifications",
          rightAction: () => <View className="w-10" />,
          showBack: false,
        })}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon Icon={ProfileIcon} label="Me" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
