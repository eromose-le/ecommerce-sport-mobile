import AppPublicHeader from "@/components/common/AppPublicHeader";
import Product from "@/components/product/Product";
import { SEARCH_PUBLIC } from "@/constants/urls";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PublicHome() {
  const handleSearchPress = () => {
    router.push(SEARCH_PUBLIC);
  };

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-background"
    >
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        stickyHeaderIndices={[1]}
      >
        {/* Header Logo */}
        <AppPublicHeader />

        {/* Sticky Search Section */}
        <View className="z-50 pt-2 pb-3 bg-background">
          <Text className="mb-3 text-sm font-light text-secondary font-jost">
            What are you buying today?
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSearchPress}
            className="flex-row items-center px-3 py-3 bg-[#F0F0F0] gap-4 rounded-2xl"
          >
            <View className="flex-row items-center px-6 py-2 mr-2 bg-white rounded-xl">
              <Text className="mr-2 text-sm font-bold text-primary">
                Products
              </Text>
              {/* <Ionicons name="chevron-down" size={14} color="black" /> */}
            </View>

            <Text className="flex-1 text-secondary font-jost-medium">
              I am looking for...
            </Text>
            <Ionicons name="search-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <Product />
      </ScrollView>
    </SafeAreaView>
  );
}
