import React, { useState } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

type LabeledInputProps = Omit<TextInputProps, "value" | "onChangeText"> & {
  label: string;
  value?: string | number | null;
  onChangeText?: (text: string) => void;
  error?: boolean | string;
  helperText?: string;
  disabled?: boolean;
  hideLabel?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
};

const LabeledInput = ({
  label,
  value,
  onChangeText,
  error,
  helperText,
  disabled,
  hideLabel = false,
  containerClassName = "",
  labelClassName = "",
  inputClassName = "",
  editable = true,
  placeholder,
  multiline,
  leftElement,
  rightElement,
  ...rest
}: LabeledInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  // pull out onFocus/onBlur/placeholderTextColor so we can wrap them
  const {
    onFocus: onFocusProp,
    onBlur: onBlurProp,
    placeholderTextColor,
    ...textInputProps
  } = rest;

  const isStringError = typeof error === "string" && error.length > 0;
  const hasError = typeof error === "boolean" ? error : isStringError;
  const helper = helperText ?? (isStringError ? (error as string) : undefined);
  const inputValue = value === undefined || value === null ? "" : String(value);
  const isEditable = disabled ? false : editable;
  const resolvedPlaceholder = placeholder ?? label;
  const resolvedPlaceholderColor = placeholderTextColor ?? "#9CA3AF";

  const hasLeft = !!leftElement;
  const hasRight = !!rightElement;

  // Border color priority: error > focus > default
  let borderColorClass = "border-gray-200";
  if (hasError) {
    borderColorClass = "border-red-500";
  } else if (isFocused) {
    borderColorClass = "border-black";
  }

  // use the same types as TextInputProps so RN/RN-web are both happy
  const handleFocus: TextInputProps["onFocus"] = (e) => {
    setIsFocused(true);
    onFocusProp?.(e);
  };

  const handleBlur: TextInputProps["onBlur"] = (e) => {
    setIsFocused(false);
    onBlurProp?.(e);
  };

  return (
    <View className={containerClassName}>
      {!hideLabel && (
        <Text
          className={`mb-2 text-sm font-jost-medium text-primary ${labelClassName}`}
        >
          {label}
        </Text>
      )}

      {/* Wrapper so icons align with the input only, not the error text */}
      <View className="relative">
        <TextInput
          value={inputValue}
          editable={isEditable}
          onChangeText={onChangeText}
          multiline={multiline}
          placeholder={resolvedPlaceholder}
          placeholderTextColor={resolvedPlaceholderColor}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`rounded-2xl border ${borderColorClass} bg-white h-fit py-4 text-sm font-jost text-primary ${
            multiline ? "min-h-[90px]" : ""
          } ${isEditable ? "" : "bg-white text-secondary"} ${
            hasLeft ? "pl-10" : "pl-4"
          } ${hasRight ? "pr-10" : "pr-4"} ${inputClassName}`}
          {...textInputProps}
        />

        {leftElement && (
          <View className="absolute -translate-y-1/2 left-3 top-1/2">
            {leftElement}
          </View>
        )}

        {rightElement && (
          <View className="absolute -translate-y-1/2 right-4 top-1/2">
            {rightElement}
          </View>
        )}
      </View>

      {helper && (
        <Text
          className={`mt-1 text-xs font-jost ${
            hasError ? "text-red-500" : "text-secondary"
          }`}
        >
          {helper}
        </Text>
      )}
    </View>
  );
};

export default LabeledInput;
