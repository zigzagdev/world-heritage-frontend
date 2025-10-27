import * as React from "react";
import {
  FormControl,
  InputLabel,
  Select as MUISelect,
  MenuItem,
  type SelectChangeEvent,
  type SelectProps,
} from "@mui/material";

export type Option<T extends string | number> = { value: T; label: React.ReactNode };

export type Props<T extends string | number> = Omit<SelectProps, "value" | "onChange"> & {
  label?: string;
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
};

export default function Select<T extends string | number>({
  label,
  value,
  onChange,
  options,
  id,
  labelId,
  fullWidth = true,
  ...rest
}: Props<T>) {
  const _labelId = labelId ?? (id ? `${id}-label` : undefined);

  const map = React.useMemo(
    () => new Map<string, T>(options.map((o) => [String(o.value), o.value as T])),
    [options],
  );

  const handleChange = (e: SelectChangeEvent<unknown>) => {
    const next = map.get(String(e.target.value));
    if (next !== undefined) onChange(next);
  };

  return (
    <FormControl fullWidth={fullWidth}>
      {label && _labelId && <InputLabel id={_labelId}>{label}</InputLabel>}
      <MUISelect
        labelId={_labelId}
        id={id}
        value={String(value)}
        label={label}
        onChange={handleChange}
        {...rest}
      >
        {options.map((opt) => (
          <MenuItem key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </MenuItem>
        ))}
      </MUISelect>
    </FormControl>
  );
}
