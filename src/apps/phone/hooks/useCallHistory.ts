import { useState, useEffect, useCallback } from 'react'
import { SERVER_BASE_URL } from '../../../lib/socket'
import { contacts as contactsStore } from '../../../kernel/storage'

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
    Promise.all([
      fetch(`${SERVER_BASE_URL}/calls`, { credentials: 'include' }).then(r => {
        if (!r.ok) throw new Error('http-error')
        return r.json() as Promise<CallHistoryItem[]>
      }),
      contactsStore.getAll(),
    ])
      .then(([data, allContacts]) => {
        if (cancelled) return
        const enriched = data.map(item => {
          const contact = allContacts.find(c => c.phone === item.peer.phone)
          const name = contact?.name ?? item.peer.phone
          return { ...item, peer: { ...item.peer, name } }
        })
        setHistory(enriched)
      })
      .catch(() => {
        if (!cancelled) setError('fetch-failed')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [version])

  const refetch = useCallback(() => setVersion(v => v + 1), [])

  return { history, loading, error, refetch }
}
