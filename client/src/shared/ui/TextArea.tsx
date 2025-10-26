import * as React from "react";
import { TextField as MUITextField } from "@mui/material";
import type { TextFieldProps as MUITextFieldProps } from "@mui/material";

export type Props = Omit<MUITextFieldProps, "multiline"> & {
  minRows?: number;
  maxRows?: number;
};

const TextArea = React.forwardRef<HTMLInputElement, Props>(function TextArea(
  { minRows = 4, maxRows, ...props },
  ref,
) {
  return <MUITextField ref={ref} multiline minRows={minRows} maxRows={maxRows} {...props} />;
});

export default TextArea;
