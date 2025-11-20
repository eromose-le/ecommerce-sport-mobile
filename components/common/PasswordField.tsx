import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import LabeledInput from "./LabeledInput";

type PasswordFieldProps = Omit<
  React.ComponentProps<typeof LabeledInput>,
  "secureTextEntry" | "rightElement"
> & {
  initiallyVisible?: boolean;
};

const PasswordField: React.FC<PasswordFieldProps> = ({
  initiallyVisible = false,
  ...props
}) => {
  const [visible, setVisible] = useState(initiallyVisible);

  return (
    <LabeledInput
      {...props}
      secureTextEntry={!visible}
      rightElement={
        <TouchableOpacity
          onPress={() => setVisible((prev) => !prev)}
          activeOpacity={0.7}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={visible ? "Hide password" : "Show password"}
        >
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}
            size={18}
            color="#6B7280"
          />
        </TouchableOpacity>
      }
    />
  );
};

export default PasswordField;
