import { useState, useEffect, useCallback } from 'react'
import { contacts } from '../../../kernel/storage'
import type { Contact } from '../../../types'

export function useContactPicker() {
  const [contactList, setContactList] = useState<Contact[]>([])
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    const all = await contacts.getAll()
    setContactList(
      [...all].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
      )
    )
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered =
    search.trim() === ''
      ? contactList
      : contactList.filter(c =>
          c.name.toLowerCase().includes(search.toLowerCase())
        )

  return { filtered, search, setSearch }
}
