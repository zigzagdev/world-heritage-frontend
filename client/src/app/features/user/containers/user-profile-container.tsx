import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUser } from "../hooks/use-get-user";
import { useUpdateUser } from "../hooks/use-update-user";
import { useDeleteUser } from "../hooks/use-delete-user";
import { UserProfileView } from "../components/UserProfileView";
import { ErrorPanel } from "@shared/uis/ErrorPanel.tsx";
import { Spinner } from "@shared/uis/Spinner.tsx";
import { useText } from "@shared/locale/ui-text.ts";
import type { UserProfile } from "../types";

type Props = {
  id: number;
};

export function UserProfileContainer({ id }: Props) {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetUser(id);
  const {
    submit: submitUpdate,
    data: updated,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateUser();
  const {
    submit: submitDelete,
    done: isDeleted,
    isLoading: isDeleting,
    error: deleteError,
  } = useDeleteUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const text = useText();

  useEffect(() => {
    if (data) setProfile(data);
  }, [data]);

  useEffect(() => {
    if (updated) setProfile(updated);
  }, [updated]);

  useEffect(() => {
    if (isDeleted) navigate("/heritages");
  }, [isDeleted, navigate]);

  if (isLoading) return <Spinner />;
  if (error || !profile) return <ErrorPanel message={text.userGetError} />;

  return (
    <UserProfileView
      profile={profile}
      onUpdate={(values) => submitUpdate(id, values)}
      isUpdating={isUpdating}
      updateError={updateError}
      onDelete={() => submitDelete(id)}
      isDeleting={isDeleting}
      deleteError={deleteError}
    />
  );
}
