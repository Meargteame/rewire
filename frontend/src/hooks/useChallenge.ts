import { useState, useEffect, useCallback } from "react";

export interface Challenge {
  title: string;
  description: string;
  category: string;
  durationSeconds: number;
}

export function useChallenge(category?: string) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = category ? `/api/challenge?category=${encodeURIComponent(category)}` : "/api/challenge";
      const res = await window.fetch(url);
      const data = await res.json();
      if (data.success) setChallenge(data.challenge);
      else throw new Error("API error");
    } catch {
      setError("Could not load challenge");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => { fetch(); }, [fetch]);

  return { challenge, loading, error, refresh: fetch };
}

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    window.fetch("/api/challenges")
      .then((r) => r.json())
      .then((d) => { if (d.success) setChallenges(d.challenges); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { challenges, loading };
}
