import ScrollableForm from "@/components/common/ScrollableForm";
import { faqs } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { BodyText, Heading } from "@/components/ui";
import { useThemedStyles, useTheme } from "@/providers/theme";

const Faq = () => {
  const theme = useThemedStyles();
  const { isDark } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <ScrollableForm>
      <Heading level="h3" align="center" weight="bold" tone={theme.headingTone} className="mb-6">
        Frequently Asked Questions
      </Heading>
      {faqs.map((faq, index) => (
        <View
          key={faq.question}
          className="mb-3 rounded-2xl border shadow-sm"
          style={{
            borderColor: isDark ? "#1f2937" : "#e5e7eb",
            backgroundColor: isDark ? "#0f172a" : "#ffffff",
          }}
        >
          <TouchableOpacity
            onPress={() =>
              setOpenIndex((prev) => (prev === index ? null : index))
            }
            className="flex-row items-center justify-between px-4 py-3"
          >
            <BodyText size="md" weight="medium" tone={theme.headingTone} className="flex-1 pr-4">
              {faq.question}
            </BodyText>
            <Ionicons
              name={openIndex === index ? "chevron-up" : "chevron-down"}
              size={18}
              color={theme.iconMuted}
            />
          </TouchableOpacity>
          {openIndex === index && (
            <BodyText size="sm" tone={theme.labelTone} className="px-4 pb-4">
              {faq.answer}
            </BodyText>
          )}
        </View>
      ))}
    </ScrollableForm>
  );
};

export default Faq;
