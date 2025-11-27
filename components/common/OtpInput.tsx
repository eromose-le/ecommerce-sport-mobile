import React, { useMemo } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type OtpInputProps = {
  length: number;
  value: string;
  onChange: (value: string) => void;
  inputRef?: React.Ref<TextInput>;
  editable?: boolean;
  onPress?: () => void;
  containerClassName?: string;
  boxClassName?: string;
  textClassName?: string;
};

const OtpInput: React.FC<OtpInputProps> = ({
  length,
  value,
  onChange,
  inputRef,
  editable = true,
  onPress,
  containerClassName = "",
  boxClassName = "",
  textClassName = "",
}) => {
  const digits = useMemo(() => {
    return Array.from({ length }).map((_, idx) => value[idx] ?? "");
  }, [length, value]);

  const handlePress = (idx: number) => {
    if (!editable) return;
    if (onPress) onPress();
  };

  const handleChange = (text: string) => {
    const clean = text.replace(/[^0-9]/g, "").slice(0, length);
    onChange(clean);
  };

  return (
    <View
      className={`flex-row items-center justify-between gap-3 ${containerClassName}`}
    >
      {digits.map((digit, idx) => (
        <TouchableOpacity
          key={`otp-digit-${idx}`}
          className={`flex-1 items-center justify-center rounded border h-14 bg-white ${
            digit.length ? "border-primary" : "border-[#DEE2E6]"
          } ${boxClassName}`}
          activeOpacity={0.8}
          onPress={() => handlePress(idx)}
          disabled={!editable}
        >
          <Text
            className={`text-xl font-jost-medium text-primary ${textClassName}`}
          >
            {digit}
          </Text>
        </TouchableOpacity>
      ))}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        maxLength={length}
        autoFocus
        editable={editable}
        style={{ position: "absolute", opacity: 0, height: 1, width: 1 }}
      />
    </View>
  );
};

export default OtpInput;
