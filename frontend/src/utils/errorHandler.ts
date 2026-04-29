// 🎯 Rewire Error Handling Utilities

import { showToast } from "../components/premium/PremiumToast";
import { ApiError } from "../services/api";

// ============================================================================
// Error Handler
// ============================================================================

/**
 * Centralized error handler for API calls
 * Logs error to console and shows user-friendly toast
 */
export function handleApiError(error: unknown, userMessage: string): void {
  console.error("API Error:", error);

  // Handle ApiError instances
  if (error instanceof ApiError) {
    // Show specific error message if available
    const message = error.data?.message || error.message || userMessage;
    showToast.error(message);

    // Log to error tracking service (Sentry, etc.) in production
    if (import.meta.env.PROD) {
      // trackError(error);
    }

    return;
  }

  // Handle network errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    showToast.error("Network error. Please check your connection.");
    return;
  }

  // Handle generic errors
  if (error instanceof Error) {
    showToast.error(userMessage);

    if (import.meta.env.PROD) {
      // trackError(error);
    }

    return;
  }

  // Fallback for unknown errors
  showToast.error(userMessage);
}

/**
 * Handle authentication errors specifically
 */
export function handleAuthError(error: unknown): void {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      showToast.error("Session expired. Please login again.");
      // Optionally redirect to login
      // window.location.href = '/login';
      return;
    }

    if (error.status === 403) {
      showToast.error("Access denied.");
      return;
    }
  }

  handleApiError(error, "Authentication failed");
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Check if user is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Setup offline/online event listeners
 */
export function setupNetworkListeners(): () => void {
  const handleOffline = () => {
    showToast.error("You're offline. Some features may not work.");
  };

  const handleOnline = () => {
    showToast.success("Back online!");
  };

  window.addEventListener("offline", handleOffline);
  window.addEventListener("online", handleOnline);

  // Return cleanup function
  return () => {
    window.removeEventListener("offline", handleOffline);
    window.removeEventListener("online", handleOnline);
  };
}
