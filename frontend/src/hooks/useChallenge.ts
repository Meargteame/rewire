import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { handleApiError } from "../utils/errorHandler";
import type { Challenge } from "../types";

export function useChallenge(category?: string) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenge = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.challenges.getRandom();
      setChallenge(data);
    } catch (err) {
      setError("Could not load challenge");
      handleApiError(err, "Failed to load challenge");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  return { challenge, loading, error, refresh: fetchChallenge };
}

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      try {
        const data = await api.challenges.getAll();
        setChallenges(data);
      } catch (err) {
        setError("Could not load challenges");
        handleApiError(err, "Failed to load challenges");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  return { challenges, loading, error };
}

// Re-export Challenge type for backward compatibility
export type { Challenge };
