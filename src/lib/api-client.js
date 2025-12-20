// Track refresh state to prevent multiple simultaneous refreshes
let isRefreshing = false;
let refreshPromise = null;

// Key for session storage to track if we've already tried refreshing and failed
const REFRESH_FAILED_KEY = "auth_refresh_failed";

// Check if refresh has already failed in this session
function hasRefreshFailed() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(REFRESH_FAILED_KEY) === "true";
}

// Mark refresh as failed - stops all future refresh attempts until page reload or login
function markRefreshFailed() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(REFRESH_FAILED_KEY, "true");
  }
}

// Clear the failed flag (call this on successful login)
export function clearRefreshFailed() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(REFRESH_FAILED_KEY);
  }
}

async function doRefresh() {
  // If refresh has already failed, don't try again - just redirect
  if (hasRefreshFailed()) {
    console.warn("Refresh already failed, redirecting to login");
    window.location.href = "/login";
    return { ok: false };
  }

  // If already refreshing, wait for the existing refresh to complete
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = fetch("/api/auth/refresh", { method: "POST" })
    .then(async (res) => {
      isRefreshing = false;
      refreshPromise = null;

      // If refresh returns 401, the token is invalid - mark as failed and redirect
      if (res.status === 401) {
        console.warn("Refresh token is invalid, redirecting to login");
        markRefreshFailed();
        window.location.href = "/login";
        return { ok: false };
      }

      return res;
    })
    .catch((error) => {
      isRefreshing = false;
      refreshPromise = null;
      console.error("Token refresh failed", error);
      markRefreshFailed();
      return { ok: false };
    });

  return refreshPromise;
}

export async function apiClient(url, options = {}) {
  // Skip refresh logic for auth-related endpoints to prevent loops
  const isAuthEndpoint = url.includes("/api/auth/");

  let res = await fetch(url, options);

  if (res.status === 401 && !isAuthEndpoint && !options._isRetry) {
    // If refresh has already failed, just redirect immediately
    if (hasRefreshFailed()) {
      window.location.href = "/login";
      return res;
    }

    // Attempt refresh
    try {
      const refreshRes = await doRefresh();
      if (refreshRes.ok) {
        // Retry original request with retry flag
        res = await fetch(url, { ...options, _isRetry: true });
      } else {
        // Refresh failed, redirect to login (already marked as failed in doRefresh)
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Token refresh failed", error);
      markRefreshFailed();
      window.location.href = "/login";
    }
  }

  return res;
}
