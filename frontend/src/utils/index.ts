// 🎯 Rewire Utility Functions

import { CATEGORY_COLORS, DAYS_OF_WEEK } from "../constants";
import type { ChallengeHistoryItem, WeeklyDataPoint, CategoryDataPoint } from "../types";

// ============================================================================
// Category Utilities
// ============================================================================

/**
 * Get Tailwind background color class for a challenge category
 */
export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || "bg-gray-500";
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeCategory(category: string): string {
  return category
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ============================================================================
// Time & Date Utilities
// ============================================================================

/**
 * Format seconds to MM:SS
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/**
 * Get date string in YYYY-MM-DD format
 */
export function getDateString(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}

/**
 * Get date N days ago
 */
export function getDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

/**
 * Check if date is today
 */
export function isToday(dateString: string): boolean {
  return dateString === getDateString();
}

/**
 * Check if date is within last N days
 */
export function isWithinDays(dateString: string, days: number): boolean {
  const date = new Date(dateString);
  const cutoff = getDaysAgo(days);
  return date >= cutoff;
}

// ============================================================================
// Data Processing
// ============================================================================

/**
 * Generate weekly challenge data for charts
 */
export function getWeeklyData(history: ChallengeHistoryItem[]): WeeklyDataPoint[] {
  const weekData = DAYS_OF_WEEK.map((day) => ({ day, challenges: 0 }));

  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay() + 1));

  history.forEach((item) => {
    const date = new Date(item.completedAt);
    if (date >= weekStart) {
      const dayIndex = (date.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
      if (dayIndex < 7) {
        weekData[dayIndex].challenges++;
      }
    }
  });

  return weekData;
}

/**
 * Generate category distribution data for pie charts
 */
export function getCategoryData(
  categoriesBreakdown: Record<string, number>
): CategoryDataPoint[] {
  return Object.entries(categoriesBreakdown).map(([name, value]) => ({
    name: capitalizeCategory(name),
    value,
    color: getCategoryColor(name),
  }));
}

/**
 * Count challenges completed today
 */
export function countCompletedToday(history: ChallengeHistoryItem[]): number {
  const today = getDateString();
  return history.filter((h) => h.completedAt.split("T")[0] === today).length;
}

/**
 * Count challenges completed this week
 */
export function countCompletedThisWeek(history: ChallengeHistoryItem[]): number {
  const weekAgo = getDateString(getDaysAgo(7));
  const today = getDateString();
  return history.filter((h) => {
    const date = h.completedAt.split("T")[0];
    return date >= weekAgo && date <= today;
  }).length;
}

/**
 * Get unique activity dates from history
 */
export function getActivityDates(history: ChallengeHistoryItem[]): Set<string> {
  return new Set(history.map((h) => h.completedAt.split("T")[0]));
}

/**
 * Generate calendar data for activity visualization
 */
export function getCalendarData(
  history: ChallengeHistoryItem[],
  days: number = 28
): Array<{ dateStr: string; isActive: boolean }> {
  const activityDates = getActivityDates(history);

  return Array.from({ length: days }).map((_, i) => {
    const date = getDaysAgo(days - 1 - i);
    const dateStr = getDateString(date);
    return {
      dateStr,
      isActive: activityDates.has(dateStr),
    };
  });
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

// ============================================================================
// Number Formatting
// ============================================================================

/**
 * Format large numbers with K, M suffixes
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.min((value / total) * 100, 100);
}

// ============================================================================
// Local Storage
// ============================================================================

/**
 * Safely get item from localStorage
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Safely set item in localStorage
 */
export function setLocalStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

/**
 * Remove item from localStorage
 */
export function removeLocalStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to remove from localStorage:", error);
  }
}
