import { View, ActivityIndicator } from "react-native";

export default function SplashScreen() {
  console.log("SPLASH ==::");

  // This is purely a UI placeholder now.
  // Navigation is handled by RootLayout + PublicLayout.
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" />
    </View>
  );
}
