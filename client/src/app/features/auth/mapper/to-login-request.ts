import type { LoginFormValues } from "../types";
import type { LoginRequest } from "../apis/auth-api";

export const toLoginRequest = (values: LoginFormValues): LoginRequest => ({
  email: values.email.trim(),
  password: values.password,
});