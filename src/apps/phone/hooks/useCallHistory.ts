import { useState, useEffect, useCallback } from 'react'
import { SERVER_BASE_URL } from '../../../lib/socket'

export interface CallHistoryItem {
  id: string
  status: 'calling' | 'answered' | 'rejected' | 'missed' | 'ended'
  duration: number
  startedAt: string
  peer: { id: string; name: string; phone: string }
  direction: 'incoming' | 'outgoing' | 'missed'
}

export function useCallHistory() {
  const [history, setHistory] = useState<CallHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch(`${SERVER_BASE_URL}/calls`, { credentials: 'include' })
      .then(r => {
        if (!r.ok) throw new Error('http-error')
        return r.json()
      })
      .then((data: CallHistoryItem[]) => {
        if (!cancelled) setHistory(data)
      })
      .catch(() => {
        if (!cancelled) setError('fetch-failed')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [version])

  const refetch = useCallback(() => setVersion(v => v + 1), [])

  return { history, loading, error, refetch }
}
