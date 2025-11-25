import { useEffect, useState } from 'react'

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasRefreshToken, setHasRefreshToken] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetch('/api/auth/state', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (!active) return
        setIsAuthenticated(!!d?.isAuthenticated)
        setHasRefreshToken(!!d?.hasRefreshToken)
      })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return { isAuthenticated, hasRefreshToken, loading }
}

export default useAuth