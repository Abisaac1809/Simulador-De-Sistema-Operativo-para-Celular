import { useState, useEffect, useCallback } from 'react'
import { messages, contacts } from '../../../kernel/storage'
import type { Message } from '../../../types'

export interface Conversation {
  contactId: string
  contactName: string
  lastMessage: Message
  unreadCount: number
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    const [allMessages, allContacts] = await Promise.all([
      messages.getAll(),
      contacts.getAll(),
    ])

    const contactMap = new Map(allContacts.map(c => [c.id, c]))

    const grouped = new Map<string, Message[]>()
    for (const msg of allMessages) {
      const group = grouped.get(msg.contactId) ?? []
      group.push(msg)
      grouped.set(msg.contactId, group)
    }

    const result: Conversation[] = []
    for (const [contactId, msgs] of grouped.entries()) {
      const contact = contactMap.get(contactId)
      if (!contact) continue
      const sorted = [...msgs].sort((a, b) => b.timestamp - a.timestamp)
      result.push({
        contactId,
        contactName: contact.name,
        lastMessage: sorted[0],
        unreadCount: msgs.filter(m => !m.read && m.direction === 'received').length,
      })
    }

    result.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp)
    setConversations(result)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered =
    search.trim() === ''
      ? conversations
      : conversations.filter(c =>
          c.contactName.toLowerCase().includes(search.toLowerCase())
        )

  return { filtered, search, setSearch, load }
}
