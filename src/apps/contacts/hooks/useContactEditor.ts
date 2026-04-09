import { useState, useEffect, useCallback } from 'react'
import { contacts } from '../../../kernel/storage'
import type { Contact } from '../../../types'

export function useContactEditor(initial: Contact | null) {
  const [name, setName] = useState(initial?.name ?? '')
  const [phone, setPhone] = useState(initial?.phone ?? '')
  const [email, setEmail] = useState(initial?.email ?? '')

  useEffect(() => {
    setName(initial?.name ?? '')
    setPhone(initial?.phone ?? '')
    setEmail(initial?.email ?? '')
  }, [initial?.id])

  const save = useCallback(async (): Promise<Contact> => {
    const contact: Contact = {
      id: initial?.id ?? crypto.randomUUID(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
    }
    await contacts.put(contact)
    return contact
  }, [initial, name, phone, email])

  const remove = useCallback(async () => {
    if (initial?.id) await contacts.delete(initial.id)
  }, [initial])

  return { name, phone, email, setName, setPhone, setEmail, save, remove }
}
