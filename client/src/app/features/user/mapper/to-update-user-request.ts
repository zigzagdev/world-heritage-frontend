import type { UserProfile } from "../types";
import type { UpdateUserRequest } from "../apis/user-api";

export type UpdateUserFormValues = Pick<UserProfile, "firstName" | "lastName" | "email">;

export const toUpdateUserRequest = (values: UpdateUserFormValues): UpdateUserRequest => ({
  first_name: values.firstName.trim(),
  last_name: values.lastName.trim(),
  email: values.email.trim(),
});
