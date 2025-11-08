import type { ButtonProps as MuiButtonProps } from "@mui/material";
import type { WithSx } from "./props";
import type { AppVariant, AppSize } from "./primitives";

export type AppButtonProps = Omit<MuiButtonProps, "variant" | "size" | "color"> &
  WithSx & {
    variant?: AppVariant;
    size?: AppSize;
    isLoading?: boolean;
    href?: string;
  };
