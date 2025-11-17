import CartCard from "@/components/cart/CartCard";
import CartEmpty from "@/components/cart/CartEmpty";
import { products } from "@/lib/dummy-data";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Cart() {
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  if (isEmpty) {
    return <CartEmpty />;
  }
  return (
    <View className="flex-1 px-5 pt-5 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {products?.map((item, idx) => (
          <CartCard key={idx} product={item} />
        ))}
      </ScrollView>

      {/* Bottom Checkout Bar */}
      <View
        className="absolute bottom-0 left-0 right-0 px-5 pt-4 pb-8 bg-white"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.01,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: -2 },
          elevation: 6,
        }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => {
              setIsEmpty(!isEmpty);
            }}
            className="px-8 py-4 bg-black"
          >
            <Text className="text-white rounded-md font-jost-semibold">
              Check out now
            </Text>
          </TouchableOpacity>

          <Text className="text-xl font-bold">$200</Text>
        </View>
      </View>
    </View>
  );
}
