import React from "react";
import { SecondaryButton as UIButton } from "@/components/ui";

type Props = React.ComponentProps<typeof UIButton>;

const SecondaryButton: React.FC<Props> = (props) => {
  return <UIButton {...props} />;
};

export default SecondaryButton;
