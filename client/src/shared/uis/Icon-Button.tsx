import * as React from "react";
import { IconButton as MUIIconButton, type IconButtonProps } from "@mui/material";

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(props, ref) {
    return <MUIIconButton ref={ref} {...props} />;
  },
);

export default IconButton;
