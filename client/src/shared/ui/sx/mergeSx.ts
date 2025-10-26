import type { SxProps, Theme } from "@mui/system";

export const mergeSx = (
  ...items: Array<SxProps<Theme> | false | null | undefined>
): SxProps<Theme> => items.filter(Boolean) as SxProps<Theme>;
