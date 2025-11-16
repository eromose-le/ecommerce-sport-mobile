import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import CartButton from "@/components/cart/CartButton";
import { BackButton } from "@/components/common/BackButton";
import ProductAttributes from "@/components/product/ProductAttributes";
import ProductDetailActions from "@/components/product/ProductDetailActions";
import ProductGallery from "@/components/product/ProductGallery";
import ProductReviews from "@/components/product/ProductReviews";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductDetail() {
  const { id, product } = useLocalSearchParams() as any;
  const item = JSON.parse(product);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 bg-white">
        <ScrollView
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-4 bg-background">
            <BackButton className="" />

            <Text className="text-xl font-jost-medium text-primary">
              Product detail {id}
            </Text>

            <CartButton />
          </View>

          <ProductGallery images={item.images} />

          {/* TITLE / DESCRIPTION */}
          <View className="px-4 mt-5">
            <Text className="text-2xl font-jost-medium">{item.name}</Text>

            <Text className="mt-1 text-sm leading-4 font-jost text-secondary">
              {item.description}
            </Text>

            {/* Variations */}
            <View className="mt-5">
              <Text className="text-sm text-primary font-jost-bold">
                Variations
              </Text>
              <Text className="text-[10px] text-primary">
                Total options: {item.variations?.length ?? 1}
              </Text>

              <View className="flex-row items-center gap-2 mt-5">
                {item.variations?.map((color: string, i: number) => (
                  <View
                    key={i}
                    className="w-6 h-6 border rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </View>
            </View>

            {/* Pricing & Quantity */}
            <View className="mt-4">
              <Text className="text-2xl font-jost-medium">${item.price}</Text>

              <View className="flex-row items-center gap-3 mt-4">
                <TouchableOpacity className="flex-row items-center">
                  <Ionicons
                    name="remove-circle-outline"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
                <Text className="text-base font-jost-medium">1</Text>
                <TouchableOpacity className="bg-black rounded-full ">
                  <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* ACTION BUTTONS */}
            <ProductDetailActions />
          </View>

          {/* KEY ATTRIBUTES */}
          <ProductAttributes attributes={item.attributes} />

          {/* REVIEWS */}
          <ProductReviews reviews={item.reviews} />

          <View className="h-20" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
