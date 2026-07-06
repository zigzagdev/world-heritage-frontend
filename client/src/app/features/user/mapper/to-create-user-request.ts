import type { CreateUserFormValues } from "../types";
import type { CreateUserRequest } from "../apis/user-api";

export const toCreateUserRequest = (values: CreateUserFormValues): CreateUserRequest => ({
  first_name: values.firstName.trim(),
  last_name: values.lastName.trim(),
  email: values.email.trim(),
  password: values.password,
  age_range: values.ageRange,
  subscription_tier: values.subscriptionTier,
  subscription_expires_at: values.subscriptionTier === "paid" ? values.subscriptionExpiresAt : null,
});
