import * as React from "react";
import { IconButton as MUIIconButton, type IconButtonProps } from "@mui/material";

export type Props = IconButtonProps;

const IconButton = React.forwardRef<HTMLButtonElement, Props>(function IconButton(props, ref) {
  return <MUIIconButton ref={ref} {...props} />;
});

export default IconButton;
