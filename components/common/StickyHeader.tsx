import LogoIcon from "@/assets/icons/logo.svg";
import { SvgIcon } from "@/components/common/SvgIcon";
import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const StickyHeader = () => {
  return (
    <View className="bg-background pt-3 pb-4">
      {/* Logo Row */}
      <View className="flex-row items-center justify-between mb-2">
        <SvgIcon Icon={LogoIcon} size={75} />
        <View className="items-center justify-center bg-black rounded-full w-9 h-9">
          <Text className="font-semibold text-white">E</Text>
        </View>
      </View>

      {/* Search Section */}
      <Text className="mb-3 text-sm font-light text-secondary font-jost">
        What are you buying today?
      </Text>

      <View className="flex-row items-center px-3 py-3 bg-[#F0F0F0] gap-4 rounded-2xl">
        <TouchableOpacity className="flex-row items-center px-6 py-2 mr-2 bg-white rounded-xl">
          <Text className="mr-2 text-sm font-bold text-primary">Products</Text>
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
  );
};

export default StickyHeader;
