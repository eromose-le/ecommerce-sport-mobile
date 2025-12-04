import React from "react";
import { Input, type InputProps } from "@/components/ui";
import { TextInput } from "react-native";

type LabeledInputProps = InputProps & { label: string };

const LabeledInput = React.forwardRef<TextInput, LabeledInputProps>(
  ({ label, ...props }, ref) => {
    return <Input ref={ref} label={label} {...props} />;
  }
);

LabeledInput.displayName = "LabeledInput";

export default LabeledInput;
