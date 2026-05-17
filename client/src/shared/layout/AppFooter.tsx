import { Link } from "react-router-dom";
import PublicIcon from "@mui/icons-material/Public";
import { useText } from "@shared/locale/ui-text.ts";

export function AppFooter() {
  const text = useText();

  return (
    <footer className="bg-zinc-900 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-12">
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
      </div>
    </footer>
  );
}
