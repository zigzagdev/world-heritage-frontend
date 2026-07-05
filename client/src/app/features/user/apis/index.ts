import { createUserApi } from "./user-api.ts";

const apiBase = import.meta.env.VITE_API_BASE_URL;

if (!apiBase) {
  throw new Error("VITE_API_BASE_URL is not set");
}

const userApi = createUserApi({ apiBase });

export const createUser = userApi.createUser;
