import { Link, useSearchParams } from "react-router-dom";
import PublicIcon from "@mui/icons-material/Public";
import { LocaleToggle } from "@shared/locale/LocaleToggle.tsx";
import { useText } from "@shared/locale/ui-text.ts";
import { STUDY_REGIONS } from "../../domain/types.ts";

export function AppHeader() {
  const text = useText();
  const [searchParams] = useSearchParams();
  const activeRegion = searchParams.get("region") ?? "";

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link
          to="/heritages"
          className="flex shrink-0 items-center gap-2 text-indigo-700 hover:text-indigo-900 transition-colors"
        >
          <PublicIcon fontSize="small" />
          <span className="text-lg font-extrabold tracking-tight">World Heritage</span>
        </Link>

        <nav
          aria-label={text.exploreRegions}
          className="hidden min-w-0 md:flex md:items-center md:gap-1 md:overflow-x-auto"
        >
          {STUDY_REGIONS.map((region) => {
            const isActive = activeRegion === region;
            return (
              <Link
                key={region}
                to={`/heritages/results?region=${encodeURIComponent(region)}`}
                className={`
                  shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors
                  ${
                    isActive
                      ? "bg-indigo-700 text-white"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }
                `}
              >
                {text.regionLabels[region]}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LocaleToggle />
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto px-4 pb-2 md:hidden">
        {STUDY_REGIONS.map((region) => {
          const isActive = activeRegion === region;
          return (
            <Link
              key={region}
              to={`/heritages/results?region=${encodeURIComponent(region)}`}
              className={`
                shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors
                ${
                  isActive
                    ? "bg-indigo-700 text-white"
                    : "border border-zinc-200 text-zinc-600 hover:border-zinc-400"
                }
              `}
            >
              {text.regionLabels[region]}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
