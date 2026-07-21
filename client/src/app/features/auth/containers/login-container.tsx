import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/use-login";
import type { LoginFormValues } from "../types";
import { LoginForm } from "../components/LoginForm";

const DEFAULT_LOGIN_FORM_VALUES: LoginFormValues = { email: "", password: "" };

export function LoginContainer() {
  const [draft, setDraft] = useState<LoginFormValues>(DEFAULT_LOGIN_FORM_VALUES);
  const { submit, isLoading, error } = useLogin();
  const navigate = useNavigate();

  const handleChange = useCallback((next: LoginFormValues) => {
    setDraft(next);
  }, []);

  const handleSubmit = useCallback(() => {
    void submit(draft).then((ok) => {
      if (ok) navigate("/mypage");
    });
  }, [draft, submit, navigate]);

  return (
    <LoginForm
      value={draft}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
    />
  );
}
