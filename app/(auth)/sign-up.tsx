import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function SignUp() {
  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Text className="text-2xl mb-6">Sign Up</Text>

      <TouchableOpacity
        onPress={() => router.push("../sign-in")}
        className="px-6 py-3 bg-black rounded-lg"
      >
        <Text className="text-white">Back to Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}
