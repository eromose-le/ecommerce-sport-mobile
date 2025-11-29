import ScrollableForm from "@/components/common/ScrollableForm";
import { COMPANY_INFO } from "@/constants/company";
import React from "react";
import { View } from "react-native";
import { BodyText, Heading } from "@/components/ui";
import { useThemedStyles, useTheme } from "@/providers/theme";

const Policy = ({ type }: { type: "privacy" | "terms" }) => {
  const theme = useThemedStyles();
  const { isDark } = useTheme();
  return (
    <ScrollableForm>
      <Heading level="h3" weight="bold" tone={theme.headingTone} className="mb-4">
        {type === "privacy" ? "Privacy policy" : "Terms & conditions"}
      </Heading>
      {policySections[type].map((section) => (
        <View
          key={section.title}
          className="p-4 mb-4 border shadow-sm rounded-2xl"
          style={{
            borderColor: isDark ? "#1f2937" : "#e5e7eb",
            backgroundColor: isDark ? "#0f172a" : "#ffffff",
          }}
        >
          <BodyText size="md" weight="semibold" tone={theme.headingTone} className="mb-2">
            {section.title}
          </BodyText>
          <BodyText size="sm" tone={theme.labelTone}>
            {section.description}
          </BodyText>
        </View>
      ))}
      <BodyText size="xs" tone={theme.labelTone} className="mt-6">
        For full legal documentation, contact us via {COMPANY_INFO.email}.
      </BodyText>
    </ScrollableForm>
  );
};

export default Policy;

const policySections = {
  privacy: [
    {
      title: "Data usage",
      description:
        "We only collect the information required to process orders, provide support, and enhance your experience.",
    },
    {
      title: "Data sharing",
      description:
        "We never sell personal data. Information is only shared with trusted logistics and payment partners when necessary.",
    },
    {
      title: "Your controls",
      description:
        `You can request updates or deletion of your data at any time by contacting ${COMPANY_INFO.email}`,
    },
  ],
  terms: [
    {
      title: "Purchases & returns",
      description:
        "All sales are subject to our warranty and return policy. Items can be returned within 14 days in original condition.",
    },
    {
      title: "Warranties",
      description:
        "Select products include manufacturer warranties. Otherwise, Sporty Galaxy provides a limited 6-month warranty on defects.",
    },
    {
      title: "Customer rights",
      description:
        "You are entitled to transparent pricing, fair treatment, and safe products as stipulated by the FCCPC.",
    },
  ],
};
