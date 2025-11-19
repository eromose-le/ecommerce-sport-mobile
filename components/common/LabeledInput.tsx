import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

const LabeledInput = ({
  label,
  value,
  onChangeText,
  multiline,
  editable = true,
  disabled,
  keyboardType,
  onBlur,
  error,
  helperText,
}: {
  label: string;
  value?: string | number | null;
  onChangeText?: TextInputProps["onChangeText"];
  multiline?: boolean;
  editable?: boolean;
  disabled?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  onBlur?: TextInputProps["onBlur"];
  error?: boolean | string;
  helperText?: string;
}) => {
  const isStringError = typeof error === "string" && error.length > 0;
  const hasError = typeof error === "boolean" ? error : isStringError;
  const helper =
    helperText ?? (isStringError ? (error as string) : undefined);
  const inputValue =
    value === undefined || value === null ? "" : String(value);
  const isEditable = disabled ? false : editable;

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-jost-medium text-primary">
        {label}
      </Text>
      <TextInput
        value={inputValue}
        editable={isEditable}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        onBlur={onBlur}
        placeholder={label}
        className={`rounded-2xl border ${
          hasError ? "border-red-500" : "border-gray-200"
        } bg-white px-4 py-3 text-sm font-jost text-primary ${
          multiline ? "min-h-[90px]" : ""
        } ${isEditable ? "" : "bg-white text-secondary"}`}
      />
      {helper ? (
        <Text
          className={`mt-1 text-xs font-jost ${
            hasError ? "text-red-500" : "text-secondary"
          }`}
        >
          {helper}
        </Text>
      ) : null}
    </View>
  );
};

export default LabeledInput;
