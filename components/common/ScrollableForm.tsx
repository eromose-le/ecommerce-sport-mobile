import React from "react";
import { ScrollView } from "react-native";

const ScrollableForm = ({ children }: { children: React.ReactNode }) => {
  return (
    <ScrollView
      className="flex-1 px-6 pt-6"
      contentInsetAdjustmentBehavior="automatic"
    >
      {children}
    </ScrollView>
  );
};

export default ScrollableForm;
