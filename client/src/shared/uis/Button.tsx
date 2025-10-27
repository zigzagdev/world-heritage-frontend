import * as React from "react";
import { Button as MuiButton, CircularProgress } from "@mui/material";
import type { ButtonProps as MuiButtonProps } from "@mui/material";
import type { SxProps, Theme, SystemStyleObject } from "@mui/system";

import type { AppVariant, AppSize } from "../types/primitives";
import type { AppButtonProps } from "../types/button";
import { mergeSx } from "../ui/sx/mergeSx";

const sizeMap: Record<AppSize, NonNullable<MuiButtonProps["size"]>> = {
  sm: "small",
  md: "medium",
  lg: "large",
};

const mapVariant = (v: AppVariant): Pick<MuiButtonProps, "variant" | "color"> => {
  switch (v) {
    case "primary":
      return { variant: "contained", color: "primary" };
    case "secondary":
      return { variant: "outlined", color: "primary" };
    case "ghost":
      return { variant: "text", color: "inherit" };
    case "destructive":
      return { variant: "contained", color: "error" };
    default:
      return { variant: "contained", color: "primary" };
  }
};

const styleOf =
  (v: AppVariant, s: AppSize) =>
  (theme: Theme): SystemStyleObject<Theme> => ({
    borderRadius: 14,
    textTransform: "none",
    fontWeight: 700,
    letterSpacing: 0.1,
    minHeight: s === "lg" ? 44 : s === "md" ? 40 : 36,
    "&:focus-visible": {
      outline: `3px solid ${theme.palette.primary.main}33`,
      outlineOffset: 2,
    },
    "& .MuiButton-startIcon, & .MuiButton-endIcon": {
      "> *:nth-of-type(1)": { fontSize: s === "lg" ? 22 : 20 },
    },
    ...(v === "primary" && { boxShadow: "none", "&:hover": { boxShadow: "none" } }),
    ...(v === "secondary" && {
      borderWidth: 1.5,
      "&:hover": { borderWidth: 1.5, backgroundColor: theme.palette.action.hover },
    }),
    ...(v === "ghost" && { "&:hover": { backgroundColor: theme.palette.action.hover } }),
    ...(v === "destructive" && { boxShadow: "none", "&:hover": { boxShadow: "none" } }),
  });

export const Button = React.forwardRef<HTMLButtonElement, AppButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    isLoading = false,
    href,
    disabled,
    startIcon,
    endIcon,
    children,
    sx,
    component,
    ...rest
  },
  ref,
) {
  const { variant: muiVariant, color } = mapVariant(variant);

  const start = isLoading ? <CircularProgress size={18} thickness={4} /> : startIcon;
  const aria = isLoading ? ({ "aria-busy": true, "aria-disabled": true } as const) : undefined;

  const baseSx = styleOf(variant, size);
  const mergedSx: SxProps<Theme> = mergeSx(baseSx, sx);

  const finalComponent: MuiButtonProps["component"] = component ?? (href ? "a" : undefined);

  const commonProps: MuiButtonProps = {
    ref,
    ...aria,
    ...rest,
    color,
    variant: muiVariant,
    size: sizeMap[size],
    startIcon: start,
    endIcon: isLoading ? undefined : endIcon,
    disabled: disabled || isLoading,
    disableElevation: true,
    sx: mergedSx,
    component: finalComponent,
    href,
  };

  return <MuiButton {...commonProps}>{children}</MuiButton>;
});
