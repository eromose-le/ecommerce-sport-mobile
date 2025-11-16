import LogoIcon from "@/assets/icons/logo.svg";
import { BackButton } from "@/components/common/BackButton";
import { SvgIcon } from "@/components/common/SvgIcon";
import { Title } from "@/components/common/Title";
import { ProductGrid } from "@/components/product/ProductGrid";
import { products } from "@/helpers/data";
import { useAuth } from "@/providers/auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PublicHome() {
  const { user, loading, skippedLogin, unSkipLogin } = useAuth();
  console.log("(PUBLIC home) ==::", { user, loading, skippedLogin });

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
        <View className="flex-row items-center justify-between mb-2">
          <SvgIcon Icon={LogoIcon} size={75} />
          <BackButton
            onPress={() => {
              unSkipLogin();
              router.push("/(auth)/sign-in");
            }}
          />
        </View>

        {/* Sticky Search Section */}
        <View className="z-50 pt-2 pb-3 bg-background">
          <Text className="mb-3 text-sm font-light text-secondary font-jost">
            What are you buying today?
          </Text>

          <View className="flex-row items-center px-3 py-3 bg-[#F0F0F0] gap-4 rounded-2xl">
            <TouchableOpacity className="flex-row items-center px-6 py-2 mr-2 bg-white rounded-xl">
              <Text className="mr-2 text-sm font-bold text-primary">
                Products
              </Text>
              <Ionicons name="chevron-down" size={14} color="black" />
            </TouchableOpacity>

            <TextInput
              // onPress={() => console.log("search")}
              // value=""
              // onChangeText={() => {}}
              placeholder="Search..."
              placeholderTextColor="#aaa"
              className="flex-1 text-secondary font-jost-semibold"
            />
            <Ionicons name="search-outline" size={20} color="black" />
          </View>
        </View>

        {/* Categories */}
        <View className="mt-5 mb-7">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {[
              { name: "All", icon: "bag-handle-outline" },
              { name: "Equipment", icon: "barbell-outline" },
              { name: "Apparels", icon: "shirt-outline" },
              { name: "Sports", icon: "game-controller-outline" },
            ].map((item, idx) => (
              <TouchableOpacity
                key={idx}
                className="flex-row items-center px-4 py-3 mr-3 bg-transparent h-12 border border-[#0000001A] rounded-3xl"
              >
                <Ionicons name={item.icon as any} size={18} color="black" />
                <Text className="ml-2 text-gray-700">{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Best Selling Section */}
        <View className="mb-8">
          <Title
            title="Best selling"
            actionText="See all"
            onActionPress={() => {}}
          />

          <View className="flex items-center justify-center w-full">
            <ProductGrid
              data={products}
              loading={true}
              loadingMore={true}
              onEndReached={() => {}}
              numColumns={2}
              skeletonCount={2}
              gap={12}
              scrollEnabled={false}
            />

            <ProductGrid
              data={products}
              numColumns={2}
              gap={12}
              scrollEnabled={false}
            />
          </View>
        </View>

        {/* Recently Viewed Section */}
        <View className="mb-0">
          <Title
            title="Recently viewed"
            actionText="See all"
            onActionPress={() => {}}
          />

          <ProductGrid
            data={products}
            horizontal
            scrollEnabled
            loading={true}
            skeletonCount={3}
          />

          <ProductGrid data={products} horizontal gap={12} scrollEnabled />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
