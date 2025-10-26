import type { SxProps, Theme } from "@mui/system";

export interface WithSx {
  sx?: SxProps<Theme>;
}
export interface WithDataTestId {
  "data-testid"?: string;
}
