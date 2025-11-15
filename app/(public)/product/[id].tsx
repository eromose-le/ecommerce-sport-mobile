import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { products } from "@/lib/dummy-data";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const product = products.find((p) => p.id.toString() === id);
  if (!product)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <View className="flex-1 bg-white p-6">
      <Image source={product.image} className="w-full h-64 rounded-xl" />

      <Text className="mt-6 text-2xl font-jost-semibold">{product.name}</Text>
      <Text className="mt-2 text-lg text-gray-500">{product.brand}</Text>

      <Text className="mt-4 text-3xl font-jost-semibold">${product.price}</Text>

      <TouchableOpacity
        className="mt-6 p-4 bg-black rounded-xl"
        onPress={() => router.push("/(protected)/checkout")}
      >
        <Text className="text-center text-white text-lg">Buy Now</Text>
      </TouchableOpacity>
    </View>
  );
}
