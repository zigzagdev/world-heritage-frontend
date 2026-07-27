import { useAuth } from "@shared/auth/AuthHooks.ts";
import { Button } from "@shared/uis/Button.tsx";
import { useText } from "@shared/locale/ui-text.ts";
import { useLogout } from "../hooks/use-logout";

export function MyPageContainer() {
  const { user } = useAuth();
  const { submit, isLoading } = useLogout();
  const text = useText();

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-12">
      <p className="text-sm text-zinc-500">{user?.email}</p>
      <Button type="button" variant="secondary" onClick={() => submit()} isLoading={isLoading}>
        {text.logout}
      </Button>
    </div>
  );
}
