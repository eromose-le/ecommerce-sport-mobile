import { View, ActivityIndicator } from "react-native";

export default function SplashScreen() {
  console.log("SPLASH ==::");

  // This is purely a UI placeholder now.
  // Navigation is handled by RootLayout + PublicLayout.
  return (
    <View className="items-center justify-center flex-1 bg-white">
      <ActivityIndicator size="small" />
    </View>
  );
}
