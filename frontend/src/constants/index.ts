// 🎯 Rewire Constants

// ============================================================================
// Goals & Milestones
// ============================================================================

export const DAILY_GOAL = 3;
export const WEEKLY_GOAL = 21;
export const MILESTONE_STREAK = 30;
export const WEEK_WARRIOR_STREAK = 7;
export const GETTING_STARTED_CHALLENGES = 10;

// ============================================================================
// Challenge Categories
// ============================================================================

export const CATEGORIES = [
  "All",
  "creative sketching",
  "language learning",
  "mindfulness",
  "physical movement",
  "gratitude reflection",
  "trivia",
  "music",
  "coding puzzle",
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  "creative sketching": "bg-purple-500",
  "language learning": "bg-blue-500",
  "mindfulness": "bg-green-500",
  "physical movement": "bg-red-500",
  "gratitude reflection": "bg-yellow-500",
  "trivia": "bg-indigo-500",
  "music": "bg-pink-500",
  "coding puzzle": "bg-orange-500",
};

export const CATEGORY_ICON_COLORS: Record<string, string> = {
  "creative sketching": "text-purple-600",
  "language learning": "text-blue-600",
  "mindfulness": "text-green-600",
  "physical movement": "text-red-600",
  "gratitude reflection": "text-yellow-600",
  "trivia": "text-indigo-600",
  "music": "text-pink-600",
  "coding puzzle": "text-orange-600",
};

// ============================================================================
// Time & Calendar
// ============================================================================

export const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const CALENDAR_DAYS_DISPLAY = 28; // 4 weeks
export const DEFAULT_CHALLENGE_DURATION = 60; // seconds

// ============================================================================
// UI & Animation
// ============================================================================

export const ANIMATION_DELAYS = {
  FAST: 0.1,
  NORMAL: 0.2,
  SLOW: 0.3,
  STAGGER: 0.05,
} as const;

export const TOAST_DURATION = {
  SHORT: 2000,
  NORMAL: 3000,
  LONG: 5000,
} as const;

// ============================================================================
// API Endpoints
// ============================================================================

export const API_ENDPOINTS = {
  AUTH: {
    ME: "/api/auth/me",
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
    LOGOUT: "/api/auth/logout",
  },
  CHALLENGES: {
    RANDOM: "/api/challenge",
    ALL: "/api/challenges/all",
    BATCH: "/api/challenges/batch",
    COMPLETE: "/api/challenge/complete",
  },
  PROGRESS: {
    HISTORY: "/api/history",
    STATS: "/api/stats",
    INSIGHTS: "/api/insights",
    ACHIEVEMENTS: "/api/achievements",
  },
} as const;

// ============================================================================
// Validation
// ============================================================================

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// ============================================================================
// Feature Flags (for future use)
// ============================================================================

export const FEATURES = {
  ACHIEVEMENTS_ENABLED: true,
  INSIGHTS_ENABLED: true,
  SOCIAL_SHARING: false,
  PREMIUM_FEATURES: false,
} as const;
