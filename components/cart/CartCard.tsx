import { Product } from "@/services/product/product.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const CartCard: React.FC<{ product: Product & { quantity?: number } }> = ({
  product,
}) => {
  return (
    <View className="flex-1 mb-8">
      <View className="flex-row items-center gap-4">
        {/* Product Image */}
        <Image
          source={require("@/assets/images/dumbbell.png")}
          className="w-36 h-24 bg-[#E8EAEC]"
          resizeMode="contain"
        />

        {/* Details */}
        <View className="flex-1 ml-4">
          <Text className="text-lg font-jost-medium">{product.name}</Text>
          <Text className="mt-1 text-sm text-secondary font-jost">
            {product.description}
          </Text>

          <Text className="mt-2 text-base font-bold">${product.price}</Text>

          {/* Quantity Controls */}
          <View className="flex-row items-center mt-2">
            <TouchableOpacity className="px-2 py-1 border border-gray-300 rounded">
              <Ionicons name="remove" size={14} color="black" />
            </TouchableOpacity>

            <Text className="mx-3 font-jost">{product.quantity || 1}</Text>

            <TouchableOpacity className="px-2 py-1 border border-gray-300 rounded">
              <Ionicons name="add" size={14} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-between mt-2">
        {/* Save for later */}
        <TouchableOpacity className="px-4 py-2 border border-gray-300 rounded-xl w-fit">
          <Text className="text-sm font-jost">Save for later</Text>
        </TouchableOpacity>

        {/* Trash Icon */}
        <TouchableOpacity>
          <Ionicons name="trash-outline" size={22} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartCard;
