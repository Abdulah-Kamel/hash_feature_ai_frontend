export async function apiClient(url, options = {}) {
  let res = await fetch(url, options);

  if (res.status === 401) {
    // Attempt refresh
    try {
      const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });
      if (refreshRes.ok) {
        // Retry original request
        res = await fetch(url, options);
      } else {
        window.location.href = "/login";
        // window.location.href = "/login"; // Optional: Force redirect
      }
    } catch (error) {
      console.error("Token refresh failed", error);
    }
  }

  return res;
}
