import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "@/providers/auth";

export default function SignIn() {
  const { login } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Text className="text-2xl mb-6">Sign In</Text>

      <TouchableOpacity
        onPress={() => login("demo@email.com", "password")}
        className="px-6 py-3 bg-black rounded-lg"
      >
        <Text className="text-white">Log In</Text>
      </TouchableOpacity>
    </View>
  );
}
