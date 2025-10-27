import * as React from "react";
import { TextField as MUITextField } from "@mui/material";
import type { TextFieldProps as MUITextFieldProps } from "@mui/material";

export type Props = MUITextFieldProps;

const TextField = React.forwardRef<HTMLInputElement, Props>(function TextField(
  { helperText, id: idProp, ...props },
  ref,
) {
  const reactId = React.useId();
  const id = idProp ?? `tf_${reactId}`;
  const helperId = helperText ? `${id}-help` : undefined;

  return (
    <MUITextField
      ref={ref}
      id={id}
      helperText={helperText}
      FormHelperTextProps={helperId ? { id: helperId } : undefined}
      inputProps={helperId ? { "aria-describedby": helperId } : undefined}
      {...props}
    />
  );
});

export default TextField;
