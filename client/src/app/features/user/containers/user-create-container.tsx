import { useCallback, useState } from "react";
import { useCreateUser } from "../hooks/use-create-user";
import { DEFAULT_CREATE_USER_FORM_VALUES } from "../mapper/user.types";
import type { CreateUserFormValues } from "../types";
import { UserCreateForm } from "../components/UserCreateForm";

export function UserCreateContainer() {
  const [draft, setDraft] = useState<CreateUserFormValues>(DEFAULT_CREATE_USER_FORM_VALUES);
  const { submit, data, isLoading, error } = useCreateUser();

  const handleChange = useCallback((next: CreateUserFormValues) => {
    setDraft(next);
  }, []);

  const handleSubmit = useCallback(() => {
    void submit(draft);
  }, [draft, submit]);

  return (
    <UserCreateForm
      value={draft}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      createdUser={data}
    />
  );
}
