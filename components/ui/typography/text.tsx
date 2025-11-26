import React from "react";
import { Text, type TextProps } from "react-native";
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
  return (
    <Text
      className={textVariants({
        size,
        tone,
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
