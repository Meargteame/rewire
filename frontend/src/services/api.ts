// 🎯 Rewire API Service Layer

import { API_ENDPOINTS } from "../constants";
import type {
  User,
  Challenge,
  ChallengeHistoryItem,
  Stats,
  Insight,
  Achievement,
  ChallengeCompletionRequest,
  AuthResponse,
  HistoryResponse,
  StatsResponse,
  InsightsResponse,
  AchievementsResponse,
  ChallengesResponse,
  ChallengeCompletionResponse,
} from "../types";

// ============================================================================
// Base Fetch Wrapper
// ============================================================================

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.error || data.message || "Request failed",
      response.status,
      data
    );
  }

  return data;
}

// ============================================================================
// Authentication API
// ============================================================================

export const authApi = {
  /**
   * Get current authenticated user
   */
  async me(): Promise<User> {
    const data = await fetchApi<{ user: User }>(API_ENDPOINTS.AUTH.ME);
    return data.user;
  },

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<User> {
    const data = await fetchApi<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return data.user;
  },

  /**
   * Sign up new user
   */
  async signup(email: string, password: string, name: string): Promise<User> {
    const data = await fetchApi<AuthResponse>(API_ENDPOINTS.AUTH.SIGNUP, {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
    return data.user;
  },

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    await fetchApi(API_ENDPOINTS.AUTH.LOGOUT, {
      method: "POST",
    });
  },
};

// ============================================================================
// Challenges API
// ============================================================================

export const challengesApi = {
  /**
   * Get a random challenge
   */
  async getRandom(): Promise<Challenge> {
    const data = await fetchApi<{ challenge: Challenge }>(
      API_ENDPOINTS.CHALLENGES.RANDOM
    );
    return data.challenge;
  },

  /**
   * Get all available challenges
   */
  async getAll(): Promise<Challenge[]> {
    const data = await fetchApi<ChallengesResponse>(
      API_ENDPOINTS.CHALLENGES.ALL
    );
    return data.challenges;
  },

  /**
   * Get batch of random challenges
   */
  async getBatch(count: number = 5): Promise<Challenge[]> {
    const data = await fetchApi<ChallengesResponse>(
      `${API_ENDPOINTS.CHALLENGES.BATCH}?count=${count}`
    );
    return data.challenges;
  },

  /**
   * Mark challenge as completed
   */
  async complete(
    request: ChallengeCompletionRequest
  ): Promise<ChallengeCompletionResponse> {
    return await fetchApi<ChallengeCompletionResponse>(
      API_ENDPOINTS.CHALLENGES.COMPLETE,
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );
  },
};

// ============================================================================
// Progress API
// ============================================================================

export const progressApi = {
  /**
   * Get user's challenge history
   */
  async getHistory(): Promise<ChallengeHistoryItem[]> {
    const data = await fetchApi<HistoryResponse>(
      API_ENDPOINTS.PROGRESS.HISTORY
    );
    return data.history;
  },

  /**
   * Get user statistics
   */
  async getStats(): Promise<Stats> {
    const data = await fetchApi<StatsResponse>(API_ENDPOINTS.PROGRESS.STATS);
    return data.stats;
  },

  /**
   * Get personalized insights
   */
  async getInsights(): Promise<Insight[]> {
    const data = await fetchApi<InsightsResponse>(
      API_ENDPOINTS.PROGRESS.INSIGHTS
    );
    return data.insights;
  },

  /**
   * Get user achievements
   */
  async getAchievements(): Promise<Achievement[]> {
    const data = await fetchApi<AchievementsResponse>(
      API_ENDPOINTS.PROGRESS.ACHIEVEMENTS
    );
    return data.achievements;
  },
};

// ============================================================================
// Combined API Export
// ============================================================================

export const api = {
  auth: authApi,
  challenges: challengesApi,
  progress: progressApi,
};

export default api;

// Export error class for error handling
export { ApiError };
