import React from "react";
import { HeaderHeightContext } from "@react-navigation/elements";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ScrollableForm = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets();
  const headerHeight = React.useContext(HeaderHeightContext) ?? 0;
  const keyboardVerticalOffset = Platform.select({
    ios: headerHeight || insets.top,
    android: headerHeight || insets.top,
    default: 0,
  });

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <ScrollView
        className="flex-1 px-6 pt-6"
        automaticallyAdjustKeyboardInsets
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 52 + insets.bottom }}
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
