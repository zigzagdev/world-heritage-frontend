import { useParams } from "react-router-dom";
import { useGetUser } from "../hooks/use-get-user";
import { UserProfileView } from "../components/UserProfileView";
import { ErrorPanel } from "@shared/uis/ErrorPanel.tsx";
import { Spinner } from "@shared/uis/Spinner.tsx";
import { useText } from "@shared/locale/ui-text.ts";

export function UserGetContainer() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetUser(Number(id));
  const text = useText();

  if (isLoading) return <Spinner />;
  if (error || !data) return <ErrorPanel message={text.userGetError} />;

  return <UserProfileView profile={data} />;
}
