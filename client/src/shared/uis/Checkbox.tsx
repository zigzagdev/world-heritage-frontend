import * as React from "react";
import { Checkbox as MUICheckbox, FormControlLabel } from "@mui/material";
import type { CheckboxProps } from "@mui/material";

export type Props = Omit<CheckboxProps, "ref"> & {
  label?: React.ReactNode;
};

type CheckboxRef = React.ElementRef<typeof MUICheckbox>;

const Checkbox = React.forwardRef<CheckboxRef, Props>(function Checkbox({ label, ...props }, ref) {
  const control = <MUICheckbox ref={ref} {...props} />;
  return label ? <FormControlLabel control={control} label={label} /> : control;
});

export default Checkbox;
