import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, TouchableOpacity } from "react-native";
import LabeledInput from "./LabeledInput";

type IoniconName = keyof typeof Ionicons.glyphMap;

type TextFieldProps = Omit<
  React.ComponentProps<typeof LabeledInput>,
  "leftElement" | "rightElement" | "secureTextEntry"
> & {
  leftIconName?: IoniconName;
  rightIconName?: IoniconName;
  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;
  leftIconDisabled?: boolean;
  rightIconDisabled?: boolean;
};

const TextField = React.forwardRef<TextInput, TextFieldProps>(
  (
    {
      leftIconName,
      rightIconName,
      onLeftIconPress,
      onRightIconPress,
      leftIconDisabled,
      rightIconDisabled,
      ...props
    },
    ref
  ) => {
    const leftElement = leftIconName ? (
      <TouchableOpacity
        disabled={!onLeftIconPress || leftIconDisabled}
        onPress={onLeftIconPress}
        hitSlop={8}
        activeOpacity={0.7}
      >
        <Ionicons name={leftIconName} size={18} color="#6B7280" />
      </TouchableOpacity>
    ) : undefined;

    const rightElement = rightIconName ? (
      <TouchableOpacity
        disabled={!onRightIconPress || rightIconDisabled}
        onPress={onRightIconPress}
        hitSlop={8}
        activeOpacity={0.7}
      >
        <Ionicons name={rightIconName} size={18} color="#6B7280" />
      </TouchableOpacity>
    ) : undefined;

    return (
      <LabeledInput
        ref={ref}
        {...props}
        leftElement={leftElement}
        rightElement={rightElement}
      />
    );
  }
);

TextField.displayName = "TextField";

export default TextField;
