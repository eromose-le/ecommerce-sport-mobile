import ScrollableForm from "@/components/common/ScrollableForm";
import { faqs } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <ScrollableForm>
      <Text className="mb-6 text-lg text-center font-jost-bold text-primary">
        Frequently Asked Questions
      </Text>
      {faqs.map((faq, index) => (
        <View
          key={faq.question}
          className="mb-3 bg-white border border-gray-100 shadow-sm rounded-2xl"
        >
          <TouchableOpacity
            onPress={() =>
              setOpenIndex((prev) => (prev === index ? null : index))
            }
            className="flex-row items-center justify-between px-4 py-3"
          >
            <Text className="flex-1 pr-4 text-base font-jost-medium text-primary">
              {faq.question}
            </Text>
            <Ionicons
              name={openIndex === index ? "chevron-up" : "chevron-down"}
              size={18}
              color="#4B5563"
            />
          </TouchableOpacity>
          {openIndex === index && (
            <Text className="px-4 pb-4 text-sm text-secondary">
              {faq.answer}
            </Text>
          )}
        </View>
      ))}
    </ScrollableForm>
  );
};

export default Faq;
