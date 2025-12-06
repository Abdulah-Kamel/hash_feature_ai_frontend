import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function apiBase() {
  return process.env.baseApi;
}

export async function serverApiClient(endpoint, options = {}) {
  const base = apiBase();
  if (!base) {
    console.error("API base URL not configured");
    throw new Error("API base URL not configured");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  // Initial request headers
  const headers = {
    ...options.headers,
  };

  // Set default Content-Type to application/json only if not present and body is not FormData
  if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith("http") ? endpoint : `${base}${endpoint}`;

  let res = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized
  if (res.status === 401) {
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      redirect("/login");
    }

    try {
      // Attempt to refresh token
      const refreshRes = await fetch(`${base}/api/v1/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-refresh-token": refreshToken,
        },
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        const newToken = refreshData?.token || refreshData?.accessToken;
        const newRefreshToken = refreshData?.refreshToken;

        if (newToken) {
          // Update cookies
          cookieStore.set("authToken", newToken, {
            httpOnly: true,
            sameSite: "strict",
            path: "/",
            expires: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
          });

          // Update refresh token if rotated
          if (newRefreshToken) {
            cookieStore.set("refreshToken", newRefreshToken, {
              httpOnly: true,
              sameSite: "strict",
              path: "/",
            });
          }

          // Retry original request with new token
          headers["Authorization"] = `Bearer ${newToken}`;
          res = await fetch(url, {
            ...options,
            headers,
          });
        } else {
          redirect("/login");
        }
      } else {
        // Refresh failed
        redirect("/login");
      }
    } catch (error) {
      console.error("Token refresh failed", error);
      redirect("/login");
    }
  }

  return res;
}
