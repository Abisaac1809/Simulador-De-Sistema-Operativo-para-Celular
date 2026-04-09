import { useState, useEffect, useCallback } from 'react'
import { messages } from '../../../kernel/storage'
import type { Message } from '../../../types'

export function useThread(contactId: string) {
  const [threadMessages, setThreadMessages] = useState<Message[]>([])
  const [text, setText] = useState('')

  const loadAndMarkRead = useCallback(async () => {
    const msgs = await messages.getByContact(contactId)
    const sorted = [...msgs].sort((a, b) => a.timestamp - b.timestamp)

    const unread = sorted.filter(m => !m.read && m.direction === 'received')
    await Promise.all(unread.map(m => messages.put({ ...m, read: true })))

    setThreadMessages(
      sorted.map(m =>
        !m.read && m.direction === 'received' ? { ...m, read: true } : m
      )
    )
  }, [contactId])

  const send = useCallback(async () => {
    const trimmed = text.trim()
    if (!trimmed) return

    const newMsg: Message = {
      id: crypto.randomUUID(),
      contactId,
      text: trimmed,
      timestamp: Date.now(),
      direction: 'sent',
      read: true,
    }

    await messages.put(newMsg)
    setText('')
    setThreadMessages(prev => [...prev, newMsg])
  }, [contactId, text])

  useEffect(() => {
    loadAndMarkRead()
  }, [loadAndMarkRead])

  return { threadMessages, text, setText, send }
}
