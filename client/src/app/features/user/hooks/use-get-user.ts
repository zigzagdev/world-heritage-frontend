import { useEffect, useRef, useState } from "react";
import { getUser } from "../apis";
import { toUserProfile } from "../mapper/to-user-profile";
import type { UserProfile } from "../types";

const isAbortError = (e: unknown): boolean => {
  return e instanceof DOMException && e.name === "AbortError";
};

export function useGetUser(id: number) {
  const [data, setData] = useState<UserProfile | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const abortController = new AbortController();
    abortRef.current = abortController;

    setLoading(true);
    setError(null);

    getUser(id, { signal: abortController.signal })
      .then((dto) => setData(toUserProfile(dto)))
      .catch((e) => {
        if (!isAbortError(e)) setError(e);
      })
      .finally(() => setLoading(false));

    return () => abortController.abort();
  }, [id]);

  return { data, isLoading, error };
}