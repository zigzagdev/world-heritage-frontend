import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUser } from "../hooks/use-get-user";
import { useUpdateUser } from "../hooks/use-update-user";
import { useDeleteUser } from "../hooks/use-delete-user";
import { UserProfileView } from "../components/UserProfileView";
import { ErrorPanel } from "@shared/uis/ErrorPanel.tsx";
import { Spinner } from "@shared/uis/Spinner.tsx";
import { useText } from "@shared/locale/ui-text.ts";
import type { UserProfile } from "../types";

export function UserGetContainer() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetUser(numericId);
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
      onUpdate={(values) => submitUpdate(numericId, values)}
      isUpdating={isUpdating}
      updateError={updateError}
      onDelete={() => submitDelete(numericId)}
      isDeleting={isDeleting}
      deleteError={deleteError}
    />
  );
}
