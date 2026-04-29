// 🎯 Rewire Type Definitions

// ============================================================================
// User & Authentication
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  currentStreak: number;
  longestStreak: number;
  totalChallenges: number;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  error?: string;
}

// ============================================================================
// Challenges
// ============================================================================

export interface Challenge {
  title: string;
  description: string;
  category: ChallengeCategory;
  durationSeconds: number;
}

export type ChallengeCategory =
  | "creative sketching"
  | "language learning"
  | "mindfulness"
  | "physical movement"
  | "gratitude reflection"
  | "trivia"
  | "music"
  | "coding puzzle";

export interface ChallengeHistoryItem {
  id: string;
  challengeTitle: string;
  category: ChallengeCategory;
  completedAt: string;
  durationSeconds: number;
}

export interface ChallengeCompletionRequest {
  challengeTitle: string;
  category: ChallengeCategory;
  durationSeconds: number;
}

export interface ChallengeCompletionResponse {
  success: boolean;
  newAchievements?: Achievement[];
  error?: string;
}

// ============================================================================
// Progress & Stats
// ============================================================================

export interface Stats {
  totalCompleted: number;
  categoriesBreakdown: Record<ChallengeCategory, number>;
  recentChallenges: ChallengeHistoryItem[];
}

export interface WeeklyDataPoint {
  day: string;
  challenges: number;
}

export interface CategoryDataPoint {
  name: string;
  value: number;
  color: string;
}

// ============================================================================
// Insights
// ============================================================================

export interface Insight {
  type: "trend" | "milestone" | "recommendation" | "warning";
  title: string;
  description: string;
  metric: number;
  change: number | null;
}

// ============================================================================
// Achievements
// ============================================================================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  progress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  secret?: boolean;
}

export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface HistoryResponse {
  success: boolean;
  history: ChallengeHistoryItem[];
}

export interface StatsResponse {
  success: boolean;
  stats: Stats;
}

export interface InsightsResponse {
  success: boolean;
  insights: Insight[];
}

export interface AchievementsResponse {
  success: boolean;
  achievements: Achievement[];
}

export interface ChallengesResponse {
  success: boolean;
  challenges: Challenge[];
}
