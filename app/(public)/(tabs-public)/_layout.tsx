import { Tabs } from "expo-router";
import HomeIcon from "@/assets/icons/home.svg";
import CartIcon from "@/assets/icons/cart.svg";

export default function PublicTabs() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarShowLabel: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="cart" options={{ title: "Cart" }} />
    </Tabs>
  );
}
