import { Breadcrumbs, Link, Typography, Skeleton } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useBreadcrumbs } from "@shared/hooks/useBreadCrumb";
import { useBreadcrumbLabels } from "@features/breadcrumbs/BreadCrumbHooks.ts";

export const BreadcrumbList = () => {
  const dynamicLabels = useBreadcrumbLabels();
  const segments = useBreadcrumbs(dynamicLabels);

  if (segments.length === 0) return null;

  return (
    <Breadcrumbs
      maxItems={3}
      itemsBeforeCollapse={1}
      itemsAfterCollapse={2}
      aria-label="breadcrumb"
      sx={{ marginTop: "4px", marginBottom: "28px" }}
    >
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const resolvedLabel = segment.isDynamic ? dynamicLabels[segment.pattern] : segment.label;

        // If it's a dynamic segment and the label hasn't resolved yet, show a skeleton
        const labelContent =
          segment.isDynamic && !resolvedLabel ? (
            <Skeleton width={80} sx={{ bgcolor: "#e4e4e7" }} />
          ) : (
            resolvedLabel || segment.label || segment.path
          );

        if (isLast) {
          return (
            <Typography key={segment.path} color="text.primary" noWrap sx={{ maxWidth: 200 }}>
              {labelContent}
            </Typography>
          );
        }

        return (
          <Link
            key={segment.path}
            component={RouterLink}
            to={segment.path}
            sx={{
              display: "block",
              maxWidth: 150,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {labelContent}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};
