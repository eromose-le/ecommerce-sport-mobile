import React, { useState } from "react";
import { Text, TextInput, type TextInputProps, View } from "react-native";
import {
  inputFieldVariants,
  inputHelperVariants,
  inputLabelVariants,
  inputWrapperVariants,
  type InputFieldVariants,
  type InputHelperVariants,
  type InputLabelVariants,
  type InputWrapperVariants,
} from "./variants";

export type InputProps = Omit<TextInputProps, "value" | "onChangeText"> &
  Pick<InputWrapperVariants, "spacing"> &
  Pick<InputFieldVariants, "size" | "rounded"> & {
    label?: string;
    value?: string | number | null;
    onChangeText?: (text: string) => void;
    error?: boolean | string;
    helperText?: string;
    helperTone?: InputHelperVariants["tone"];
    hideLabel?: boolean;
    containerClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    helperClassName?: string;
    leftElement?: React.ReactNode;
    rightElement?: React.ReactNode;
    required?: boolean;
    disabled?: boolean;
    labelTone?: InputLabelVariants["tone"];
    labelUppercase?: boolean;
  };

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  error,
  helperText,
  helperTone,
  hideLabel,
  containerClassName,
  labelClassName,
  inputClassName,
  helperClassName,
  leftElement,
  rightElement,
  required,
  disabled,
  labelTone,
  labelUppercase,
  spacing,
  size,
  rounded,
  editable = true,
  placeholder,
  placeholderTextColor,
  multiline,
  numberOfLines,
  onFocus,
  onBlur,
  textAlignVertical,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const isEditable = disabled ? false : editable;
  const hasError = typeof error === "string" ? error.length > 0 : !!error;
  const helper =
    helperText ?? (typeof error === "string" ? (error as string) : undefined);
  const resolvedValue =
    value === undefined || value === null ? "" : String(value);
  const resolvedPlaceholder = placeholder ?? label;
  const resolvedPlaceholderColor = placeholderTextColor ?? "#9CA3AF";

  const hasLeft = !!leftElement;
  const hasRight = !!rightElement;

  const state: NonNullable<InputFieldVariants["state"]> = !isEditable
    ? "disabled"
    : hasError
      ? "error"
      : isFocused
        ? "focused"
        : "default";

  const wrapperClass = inputWrapperVariants({
    spacing,
    className: containerClassName,
  });

  const labelClass = inputLabelVariants({
    tone: labelTone,
    uppercase: labelUppercase,
    className: labelClassName,
  });

  const inputClass = inputFieldVariants({
    state,
    size,
    rounded,
    multiline,
    hasLeft,
    hasRight,
    className: inputClassName,
  });

  const helperClass = inputHelperVariants({
    tone: hasError ? "error" : helperTone,
    className: helperClassName,
  });

  const handleFocus: TextInputProps["onFocus"] = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur: TextInputProps["onBlur"] = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View className={wrapperClass}>
      {!hideLabel && label ? (
        <Text className={labelClass}>
          {label}
          {required ? <Text className="text-red-500"> *</Text> : null}
        </Text>
      ) : null}

      <View className="relative">
        <TextInput
          value={resolvedValue}
          editable={isEditable}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={numberOfLines}
          placeholder={resolvedPlaceholder}
          placeholderTextColor={resolvedPlaceholderColor}
          onFocus={handleFocus}
          onBlur={handleBlur}
          textAlignVertical={textAlignVertical ?? (multiline ? "top" : "auto")}
          className={inputClass}
          {...rest}
        />

        {leftElement ? (
          <View className="absolute -translate-y-1/2 left-3 top-1/2">
            {leftElement}
          </View>
        ) : null}

        {rightElement ? (
          <View className="absolute -translate-y-1/2 right-4 top-1/2">
            {rightElement}
          </View>
        ) : null}
      </View>

      {helper ? <Text className={helperClass}>{helper}</Text> : null}
    </View>
  );
};

export default Input;
