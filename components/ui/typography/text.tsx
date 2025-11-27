import React from "react";
import { Text, type TextProps } from "react-native";
import { useThemedStyles } from "@/providers/theme";
import { textVariants, type TextVariants } from "./variants";

type BodyTextProps = TextProps & TextVariants & { children: React.ReactNode };

const BodyText: React.FC<BodyTextProps> = ({
  children,
  className,
  size,
  tone,
  weight,
  align,
  uppercase,
  ...rest
}) => {
  const themed = useThemedStyles();
  const resolvedTone = tone ?? themed.bodyTone;
  return (
    <Text
      className={textVariants({
        size,
        tone: resolvedTone,
        weight,
        align,
        uppercase,
        className,
      })}
      {...rest}
    >
      {children}
    </Text>
  );
};

export default BodyText;
