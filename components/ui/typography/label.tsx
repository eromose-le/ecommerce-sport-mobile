import React from "react";
import { Text, type TextProps } from "react-native";
import { useThemedStyles } from "@/providers/theme";
import { labelVariants, type LabelVariants } from "./variants";

type LabelProps = TextProps &
  LabelVariants & { children: React.ReactNode; required?: boolean };

const Label: React.FC<LabelProps> = ({
  children,
  className,
  tone,
  weight,
  uppercase,
  required,
  ...rest
}) => {
  const themed = useThemedStyles();
  const resolvedTone = tone ?? themed.labelTone;
  return (
    <Text
      className={labelVariants({
        tone: resolvedTone,
        weight,
        uppercase,
        className,
      })}
      {...rest}
    >
      {children}
      {required ? <Text className="text-red-500"> *</Text> : null}
    </Text>
  );
};

export default Label;
