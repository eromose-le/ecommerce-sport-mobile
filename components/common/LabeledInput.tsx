import React from "react";
import { Text, TextInput, View } from "react-native";

const LabeledInput = ({
  label,
  value,
  onChangeText,
  multiline,
  editable = true,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  multiline?: boolean;
  editable?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}) => {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-jost-medium text-primary">
        {label}
      </Text>
      <TextInput
        value={value}
        editable={editable}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        placeholder={label}
        className={`rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-jost text-secondary ${
          multiline ? "min-h-[90px]" : ""
        } ${editable ? "" : "bg-gray-50"}`}
      />
    </View>
  );
};

export default LabeledInput;
