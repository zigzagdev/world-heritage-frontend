import type { FormEvent } from "react";
import TextField from "@shared/uis/TextField.tsx";
import { Button } from "@shared/uis/Button.tsx";
import { ErrorPanel } from "@shared/uis/ErrorPanel.tsx";
import { useText } from "@shared/locale/ui-text.ts";
import type { LoginFormValues } from "../types";

type Props = {
  value: LoginFormValues;
  onChange: (next: LoginFormValues) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: unknown;
};

export function LoginForm({ value, onChange, onSubmit, isLoading, error }: Props) {
  const text = useText();

  const handleField = <K extends keyof LoginFormValues>(key: K, next: LoginFormValues[K]) => {
    onChange({ ...value, [key]: next });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-8">
      <h1 className="text-xl font-bold">{text.login}</h1>

      {error != null && <ErrorPanel message={text.loginError} />}

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
        {text.login}
      </Button>
    </form>
  );
}
