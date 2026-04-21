import { useState, useEffect } from 'react'
import { SERVER_BASE_URL } from '../../../lib/socket'
import { contacts as contactsStore } from '../../../kernel/storage'

export interface PhoneLookupResult { id: string; name: string; phone: string }

const VENEZUELAN_PHONE_REGEX = /^0?4\d{9}$/

export function usePhoneLookup(phone: string) {
  const [result, setResult] = useState<PhoneLookupResult | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const trimmed = phone.trim()
    if (!VENEZUELAN_PHONE_REGEX.test(trimmed)) { setResult(null); setNotFound(false); return }
    let cancelled = false
    setLoading(true); setNotFound(false)
    const handle = setTimeout(() => {
      fetch(`${SERVER_BASE_URL}/users/phone/${encodeURIComponent(trimmed)}`, { credentials: 'include' })
        .then(r => {
          if (r.status === 404) { if (!cancelled) { setResult(null); setNotFound(true) } return null }
          if (!r.ok) throw new Error('http-error')
          return r.json() as Promise<{ userId: string; name: string; phone: string }>
        })
        .then(async data => {
          if (!data || cancelled) return
          const allContacts = await contactsStore.getAll()
          const contact = allContacts.find(c => c.phone === data.phone)
          if (!cancelled) setResult({ id: data.userId, name: contact?.name ?? data.phone, phone: data.phone })
        })
        .catch(() => { if (!cancelled) setResult(null) })
        .finally(() => { if (!cancelled) setLoading(false) })
    }, 250)
    return () => { cancelled = true; clearTimeout(handle) }
  }, [phone])

  return { result, notFound, loading }
}

