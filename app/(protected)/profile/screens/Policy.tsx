import ScrollableForm from "@/components/common/ScrollableForm";
import { COMPANY_INFO } from "@/constants/company";
import React from "react";
import { Text, View } from "react-native";

const Policy = ({ type }: { type: "privacy" | "terms" }) => {
  return (
    <ScrollableForm>
      <Text className="mb-4 text-lg font-jost-bold text-primary">
        {type === "privacy" ? "Privacy policy" : "Terms & conditions"}
      </Text>
      {policySections[type].map((section) => (
        <View
          key={section.title}
          className="p-4 mb-4 bg-white border border-gray-100 shadow-sm rounded-2xl"
        >
          <Text className="mb-2 text-base font-jost-semibold text-primary">
            {section.title}
          </Text>
          <Text className="text-sm text-secondary">{section.description}</Text>
        </View>
      ))}
      <Text className="mt-6 text-xs text-secondary">
        For full legal documentation, contact us via {COMPANY_INFO.email}.
      </Text>
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
        "You can request updates or deletion of your data at any time by contacting support@sportygalaxy.com.",
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
