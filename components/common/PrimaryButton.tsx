import React from "react";
import { PrimaryButton as UIButton } from "@/components/ui";

type Props = React.ComponentProps<typeof UIButton>;

const PrimaryButton: React.FC<Props> = (props) => {
  return <UIButton {...props} />;
};

export default PrimaryButton;
