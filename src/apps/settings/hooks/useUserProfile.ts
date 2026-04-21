import { useState, useEffect, useCallback } from 'react'
import { useOSStore } from '../../../kernel/store'
import { SERVER_BASE_URL } from '../../../lib/socket'

export interface UserProfile {
  id: string
  name: string
  phone: string
  email: string
}

export function useUserProfile() {
  const currentUserId = useOSStore(s => s.currentUserId)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!currentUserId) {
      setUser(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${SERVER_BASE_URL}/users/${currentUserId}`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch user')
      const data = (await res.json()) as UserProfile
      setUser(data)
    } catch {
      setError('Could not load profile')
    } finally {
      setLoading(false)
    }
  }, [currentUserId])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { user, loading, error, refresh }
}
