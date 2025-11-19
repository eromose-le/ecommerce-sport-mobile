import ScrollableForm from "@/components/common/ScrollableForm";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

const PaymentMethods = () => {
  return (
    <ScrollableForm>
      <Text className="mb-6 text-sm text-secondary">
        Manage your saved payment methods. Support for in-app payment management
        is coming soon.
      </Text>
      <View className="items-center p-6 border border-gray-300 border-dashed rounded-2xl">
        <Ionicons name="card-outline" size={36} color="#9CA3AF" />
        <Text className="mt-3 text-base font-jost-medium text-secondary">
          No saved cards yet
        </Text>
        <Text className="mt-1 text-xs text-center text-secondary">
          Our team is working on secure card storage so you can checkout even
          faster.
        </Text>
      </View>
    </ScrollableForm>
  );
};

export default PaymentMethods;
