import LogoIcon from "@/assets/icons/logo.svg";
import { BackButton } from "@/components/common/BackButton";
import { SvgIcon } from "@/components/common/SvgIcon";
import Product from "@/components/product/Product";

import { useAuth } from "@/providers/auth";
import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PublicHome() {
  const { unSkipLogin } = useAuth();

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
          <View className="items-center">
            <BackButton onPress={unSkipLogin} />
            <Text className="mb-3 text-xs font-light text-secondary font-jost">
              Sign in
            </Text>
          </View>
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
              placeholder="Search..."
              placeholderTextColor="#aaa"
              className="flex-1 text-secondary font-jost-semibold"
            />
            <Ionicons name="search-outline" size={20} color="black" />
          </View>
        </View>

        <Product />
      </ScrollView>
    </SafeAreaView>
  );
}
