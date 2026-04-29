import * as React from "react";
import { Checkbox as MUICheckbox, FormControlLabel } from "@mui/material";
import type { CheckboxProps } from "@mui/material";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof MUICheckbox>,
  Omit<CheckboxProps, "ref"> & { label?: React.ReactNode }
>(function Checkbox({ label, ...props }, ref) {
  const control = <MUICheckbox ref={ref} {...props} />;
  return label ? <FormControlLabel control={control} label={label} /> : control;
});

export default Checkbox;
