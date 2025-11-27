import React from "react";
import { Input, type InputProps } from "@/components/ui";

type LabeledInputProps = InputProps & { label: string };

const LabeledInput: React.FC<LabeledInputProps> = ({ label, ...props }) => {
  return <Input label={label} {...props} />;
};

export default LabeledInput;
