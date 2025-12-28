import { useEffect, useState } from 'react'
import { apiClient } from "@/lib/api-client";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasRefreshToken, setHasRefreshToken] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    let active = true
    apiClient("/api/auth/state")
      .then((r) => r.json())
      .then((d) => {
        if (!active) return;
        setIsAuthenticated(!!d?.isAuthenticated);
        setHasRefreshToken(!!d?.hasRefreshToken);
        setUser(d?.user || null);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false }
  }, [])

  return { isAuthenticated, hasRefreshToken, loading, user }
}

export default useAuth
