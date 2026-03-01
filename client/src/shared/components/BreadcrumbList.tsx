import { Breadcrumbs, Link, Typography, Skeleton } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useBreadcrumbs } from "@shared/hooks/useBreadCrumb";
import { useBreadcrumbLabels } from "@features/breadcrumbs/BreadCrumbHooks.ts";

export const BreadcrumbList = () => {
  const segments = useBreadcrumbs();
  const dynamicLabels = useBreadcrumbLabels();

  if (segments.length === 0) return null;

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{
        my: 3,
        "& .MuiBreadcrumbs-separator": { color: "#a1a1aa" },
      }}
    >
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const resolvedLabel = segment.isDynamic ? dynamicLabels[segment.path] : segment.label;

        const labelContent =
          segment.isDynamic && !resolvedLabel ? (
            <Skeleton width={80} sx={{ bgcolor: "#e4e4e7" }} />
          ) : (
            resolvedLabel || segment.path
          );
        if (isLast) {
          return (
            <Typography
              key={segment.path}
              sx={{
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "#71717a",
              }}
            >
              {labelContent}
            </Typography>
          );
        }
        return (
          <Link
            key={segment.path}
            component={RouterLink}
            to={segment.path}
            underline="none"
            sx={{
              fontSize: "0.875rem",
              color: "#71717a",
              "&:hover": {
                color: "#4338ca",
                textDecoration: "underline",
              },
            }}
          >
            {labelContent}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};
