import { useState, useEffect, useCallback } from 'react'
import { socket, SERVER_BASE_URL } from '../../../lib/socket'
import type { BackendConversationSummary } from '../types'
import type { Message } from '../../../types'

export interface Conversation {
  contactId: string
  contactName: string
  lastMessage: Message
  unreadCount: number
}

function mapSummaryToConversation(
  summary: BackendConversationSummary,
  currentUserId: string
): Conversation {
  const { lastMessage: lm } = summary
  return {
    contactId: summary.peerId,
    contactName: summary.peerName,
    lastMessage: {
      id: lm.id,
      contactId: summary.peerId,
      text: lm.body,
      timestamp: Date.parse(lm.createdAt),
      direction: lm.fromId === currentUserId ? 'sent' : 'received',
      read: true,
    },
    unreadCount: 0,
  }
}

export function useConversations(currentUserId: string) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${SERVER_BASE_URL}/messages/conversations`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const summaries: BackendConversationSummary[] = await res.json()
      const mapped = summaries.map(s => mapSummaryToConversation(s, currentUserId))
      mapped.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp)
      setConversations(mapped)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }, [currentUserId])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    socket.on('new-message', load)
    return () => {
      socket.off('new-message', load)
    }
  }, [load])

  const filtered =
    search.trim() === ''
      ? conversations
      : conversations.filter(c =>
          c.contactName.toLowerCase().includes(search.toLowerCase())
        )

  return { filtered, search, setSearch, load, loading, error }
}
