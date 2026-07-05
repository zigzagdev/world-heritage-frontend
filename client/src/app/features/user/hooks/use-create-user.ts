import { useCallback, useEffect, useRef, useState } from "react";
import { createUser } from "../apis";
import { toCreateUserRequest } from "../mapper/to-create-user-request";
import type { ApiUserDto } from "../apis/user-api";
import type { CreateUserFormValues } from "../types";

const isAbortError = (e: unknown): boolean => {
  return e instanceof DOMException && e.name === "AbortError";
};

export function useCreateUser() {
  const [data, setData] = useState<ApiUserDto | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const submit = useCallback(async (values: CreateUserFormValues) => {
    abortRef.current?.abort();
    const abortController = new AbortController();
    abortRef.current = abortController;

    setLoading(true);
    setError(null);

    try {
      const created = await createUser(toCreateUserRequest(values), {
        signal: abortController.signal,
      });
      setData(created);
    } catch (e) {
      if (!isAbortError(e)) setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, data, isLoading, error };
}
