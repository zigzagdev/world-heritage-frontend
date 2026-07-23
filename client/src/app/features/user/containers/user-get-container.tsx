import { useParams } from "react-router-dom";
import { useGetUser } from "../hooks/use-get-user";
import { ErrorPanel } from "@shared/uis/ErrorPanel.tsx";
import { useText } from "@shared/locale/ui-text.ts";

export function UserGetContainer() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetUser(Number(id));
  const text = useText();

  if (isLoading) return null;
  if (error || !data) return <ErrorPanel message={text.userGetError} />;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-2 px-4 py-8">
      <h1 className="text-xl font-bold">{text.userProfileTitle}</h1>
      <p className="text-sm text-zinc-700">
        {data.firstName} {data.lastName}
      </p>
      <p className="text-sm text-zinc-500">{data.email}</p>
    </div>
  );
}
