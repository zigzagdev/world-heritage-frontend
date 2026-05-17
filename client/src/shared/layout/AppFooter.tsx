import { Link } from "react-router-dom";
import PublicIcon from "@mui/icons-material/Public";
import { useText } from "@shared/locale/ui-text.ts";
import { STUDY_REGIONS } from "../../domain/types.ts";

export function AppFooter() {
  const text = useText();

  return (
    <footer className="bg-zinc-900 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-12 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Link
            to="/heritages"
            className="flex items-center gap-2 w-fit text-white hover:text-zinc-300 transition-colors"
          >
            <PublicIcon fontSize="small" className="text-indigo-400" />
            <span className="text-base font-bold tracking-tight">World Heritage Explorer</span>
          </Link>
          <p className="text-sm text-zinc-400">{text.footerTagline}</p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            {text.quickExplore}
          </p>
          <div className="flex flex-wrap gap-2">
            {STUDY_REGIONS.map((region) => (
              <Link
                key={region}
                to={`/heritages/results?region=${encodeURIComponent(region)}`}
                className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-medium text-zinc-300 hover:border-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {text.regionLabels[region]}
              </Link>
            ))}
          </div>
        </div>

        <hr className="border-zinc-800" />

        <div className="flex flex-col gap-1">
          <a
            href="https://whc.unesco.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors w-fit"
          >
            {text.dataSource}
          </a>
          <p className="text-xs text-zinc-600">© 2026 World Heritage Explorer</p>
        </div>
      </div>
    </footer>
  );
}
