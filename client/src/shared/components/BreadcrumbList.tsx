import { Breadcrumbs, Link, Typography, Skeleton } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useBreadcrumbs } from "@shared/hooks/useBreadCrumb";
import { useBreadcrumbLabels } from "@features/breadcrumbs/BreadCrumbContext.tsx";

export const BreadcrumbList = () => {
  const segments = useBreadcrumbs();
  const dynamicLabels = useBreadcrumbLabels();

  if (segments.length === 0) return null;

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ my: 2 }}>
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;

        // check if this segment is dynamic and if we have a label for it in the context
        const resolvedLabel = segment.isDynamic ? dynamicLabels[segment.path] : segment.label;

        // Fallback to skeleton if it's a dynamic segment and we don't have a label yet, otherwise show the label or path
        const labelContent =
          segment.isDynamic && !resolvedLabel ? (
            <Skeleton width={80} data-testid="breadcrumb-skeleton" />
          ) : (
            resolvedLabel || segment.path
          );

        if (isLast) {
          return (
            <Typography key={segment.path} color="text.primary" sx={{ fontWeight: "bold" }}>
              {labelContent}
            </Typography>
          );
        }

        return (
          <Link
            key={segment.path}
            component={RouterLink}
            to={segment.path}
            underline="hover"
            color="inherit"
          >
            {labelContent}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};
