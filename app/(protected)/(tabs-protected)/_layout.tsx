import { Tabs } from "expo-router";
import HomeIcon from "@/assets/icons/home.svg";
import CartIcon from "@/assets/icons/cart.svg";
import NotificationIcon from "@/assets/icons/notification.svg";
import ProfileIcon from "@/assets/icons/profile.svg";

export default function ProtectedTabs() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarShowLabel: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="cart" />
      <Tabs.Screen name="notification" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
