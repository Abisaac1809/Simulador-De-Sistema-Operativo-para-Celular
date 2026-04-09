import { useState, useEffect, useCallback } from 'react'
import { contacts } from '../../../kernel/storage'
import type { Contact } from '../../../types'

export function useContacts() {
  const [contactList, setContactList] = useState<Contact[]>([])
  const [search, setSearch] = useState('')

  const refresh = useCallback(async () => {
    const all = await contacts.getAll()
    const sorted = [...all].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    )
    setContactList(sorted)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const filtered = search.trim() === ''
    ? contactList
    : contactList.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
      )

  return { filtered, contactList, search, setSearch, refresh }
}
