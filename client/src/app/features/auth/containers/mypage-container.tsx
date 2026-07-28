import { useAuth } from "@shared/auth/AuthHooks.ts";
import { Spinner } from "@shared/uis/Spinner.tsx";
import { UserProfileContainer } from "@features/user/containers/user-profile-container.tsx";

export function MyPageContainer() {
  const { user } = useAuth();

  if (!user) return <Spinner />;

  return <UserProfileContainer id={user.id} />;
}
