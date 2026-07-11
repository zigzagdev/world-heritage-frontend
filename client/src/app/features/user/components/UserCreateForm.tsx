import type { FormEvent } from "react";
import TextField from "@shared/uis/TextField.tsx";
import { Button } from "@shared/uis/Button.tsx";
import { ErrorPanel } from "@shared/uis/ErrorPanel.tsx";
import { useText } from "@shared/locale/ui-text.ts";
import type { CreateUserFormValues } from "../types";
import type { ApiUserDto } from "../apis/user-api";

type Props = {
  value: CreateUserFormValues;
  onChange: (next: CreateUserFormValues) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: unknown;
  createdUser: ApiUserDto | null;
};

export function UserCreateForm({
  value,
  onChange,
  onSubmit,
  isLoading,
  error,
  createdUser,
}: Props) {
  const text = useText();

  const handleField = <K extends keyof CreateUserFormValues>(
    key: K,
    next: CreateUserFormValues[K],
  ) => {
    onChange({ ...value, [key]: next });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-8">
      <h1 className="text-xl font-bold">{text.userCreateTitle}</h1>

      {createdUser && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {text.userCreateSuccess}
        </p>
      )}

      {error != null && <ErrorPanel message={text.userCreateError} />}

      <TextField
        label={text.userFirstName}
        value={value.firstName}
        onChange={(e) => handleField("firstName", e.target.value)}
        required
      />
      <TextField
        label={text.userLastName}
        value={value.lastName}
        onChange={(e) => handleField("lastName", e.target.value)}
        required
      />
      <TextField
        label={text.userEmail}
        type="email"
        value={value.email}
        onChange={(e) => handleField("email", e.target.value)}
        required
      />
      <TextField
        label={text.userPassword}
        type="password"
        value={value.password}
        onChange={(e) => handleField("password", e.target.value)}
        required
      />

      <Button type="submit" variant="primary" isLoading={isLoading}>
        {text.userCreateSubmit}
      </Button>
    </form>
  );
}
