import { useCallback, useEffect, useRef, useState } from "react";
import { updateUser } from "../apis";
import { toUpdateUserRequest } from "../mapper/to-update-user-request";
import { toUserProfile } from "../mapper/to-user-profile";
import type { UpdateUserFormValues } from "../mapper/to-update-user-request";
import type { UserProfile } from "../types";

const isAbortError = (element: unknown): boolean => {
  return element instanceof DOMException && element.name === "AbortError";
};

export function useUpdateUser() {
  const [data, setData] = useState<UserProfile | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const submit = useCallback(async (id: number, values: UpdateUserFormValues) => {
    abortRef.current?.abort();
    const abortController = new AbortController();
    abortRef.current = abortController;

    setLoading(true);
    setError(null);

    try {
      const updated = await updateUser(id, toUpdateUserRequest(values), {
        signal: abortController.signal,
      });
      setData(toUserProfile(updated));
    } catch (error) {
      if (!isAbortError(error)) setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, data, isLoading, error };
}
