import { useState, useEffect, useMemo } from 'react'
import { contacts as contactsStore } from '../../../kernel/storage'
import type { Contact } from '../../../types'

export function useContacts(query: string) {
  const [all, setAll] = useState<Contact[]>([])
  useEffect(() => {
    let cancelled = false
    contactsStore.getAll().then(list => { if (!cancelled) setAll(list) })
    return () => { cancelled = true }
  }, [])
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return all
    return all.filter(c =>
      c.name.toLowerCase().includes(q) || c.phone.replace(/\s/g, '').includes(q.replace(/\s/g, ''))
    )
  }, [all, query])
  return { all, filtered }
}
