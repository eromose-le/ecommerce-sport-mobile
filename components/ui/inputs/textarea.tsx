import React from "react";
import Input from "./input";

type TextAreaProps = React.ComponentProps<typeof Input>;

const TextArea: React.FC<TextAreaProps> = (props) => {
  return (
    <Input
      multiline
      numberOfLines={props.numberOfLines ?? 4}
      textAlignVertical={props.textAlignVertical ?? "top"}
      {...props}
    />
  );
};

export default TextArea;
