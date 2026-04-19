import { useState, useEffect } from 'react'
import { SERVER_BASE_URL } from '../../../lib/socket'

export interface PhoneLookupResult { id: string; name: string; phone: string }

export function usePhoneLookup(phone: string) {
  const [result, setResult] = useState<PhoneLookupResult | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const trimmed = phone.trim()
    if (trimmed.length < 3) { setResult(null); setNotFound(false); return }
    let cancelled = false
    setLoading(true); setNotFound(false)
    const handle = setTimeout(() => {
      fetch(`${SERVER_BASE_URL}/users/phone/${encodeURIComponent(trimmed)}`, { credentials: 'include' })
        .then(r => {
          if (r.status === 404) { if (!cancelled) { setResult(null); setNotFound(true) } return null }
          if (!r.ok) throw new Error('http-error')
          return r.json() as Promise<PhoneLookupResult>
        })
        .then(data => { if (data && !cancelled) setResult(data) })
        .catch(() => { if (!cancelled) setResult(null) })
        .finally(() => { if (!cancelled) setLoading(false) })
    }, 250)  // 250ms debounce
    return () => { cancelled = true; clearTimeout(handle) }
  }, [phone])

  return { result, notFound, loading }
}
