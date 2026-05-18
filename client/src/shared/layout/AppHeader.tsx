import { Link } from "react-router-dom";
import PublicIcon from "@mui/icons-material/Public";
import { LocaleToggle } from "@shared/locale/LocaleToggle.tsx";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          to="/heritages"
          className="flex items-center gap-2 text-indigo-700 hover:text-indigo-900 transition-colors"
        >
          <PublicIcon fontSize="small" />
          <span className="text-lg font-extrabold tracking-tight">World Heritage</span>
        </Link>

        <LocaleToggle />
      </div>
    </header>
  );
}
