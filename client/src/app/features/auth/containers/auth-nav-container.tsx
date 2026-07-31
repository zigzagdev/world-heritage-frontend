import { Link, useNavigate } from "react-router-dom";
import { useText } from "@shared/locale/ui-text.ts";
import { useAuth } from "@shared/auth/AuthHooks.ts";
import { useLogout } from "../hooks/use-logout";

export function AuthNavContainer() {
  const { user, isLoading } = useAuth();
  const { submit, isLoading: isLoggingOut } = useLogout();
  const navigate = useNavigate();
  const text = useText();

  if (isLoading) return null;

  if (!user) {
    return (
      <Link
        to="/login"
        className="rounded-full px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
      >
        {text.login}
      </Link>
    );
  }

  const handleLogout = async () => {
    await submit();
    navigate("/heritages");
  };

  return (
    <>
      <Link
        to="/mypage"
        className="rounded-full px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
      >
        {text.myPage}
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
      >
        {text.logout}
      </button>
    </>
  );
}
