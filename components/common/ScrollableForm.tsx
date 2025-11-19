import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

const ScrollableForm = ({ children }: { children: React.ReactNode }) => {
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.select({ ios: 80, android: 0 })}
    >
      <ScrollView
        className="flex-1 px-6 pt-6"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 52 }}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ScrollableForm;
