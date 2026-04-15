import { useState, useEffect, useCallback } from 'react'
import { socket, SERVER_BASE_URL } from '../../../lib/socket'
import { kernelBus } from '../../../kernel/events'
import type { BackendMessage } from '../types'
import type { Message } from '../../../types'

function mapToUIMessage(msg: BackendMessage, currentUserId: string): Message {
  return {
    id: msg.id,
    contactId: msg.fromId === currentUserId ? msg.toId : msg.fromId,
    text: msg.body,
    timestamp: Date.parse(msg.createdAt),
    direction: msg.fromId === currentUserId ? 'sent' : 'received',
    read: true,
  }
}

export function useThread(peerUserId: string, currentUserId: string) {
  const [threadMessages, setThreadMessages] = useState<Message[]>([])
  const [text, setText] = useState('')

  useEffect(() => {
    let cancelled = false

    fetch(`${SERVER_BASE_URL}/messages/thread/${peerUserId}`, {
      credentials: 'include',
    })
      .then(r => r.json())
      .then((msgs: BackendMessage[]) => {
        if (!cancelled) {
          setThreadMessages(msgs.map(m => mapToUIMessage(m, currentUserId)))
        }
      })
      .catch(() => {
        // silently ignore load errors — UI will show empty
      })

    const onNewMessage = (msg: BackendMessage) => {
      if (msg.fromId === peerUserId || msg.toId === peerUserId) {
        setThreadMessages(prev => [...prev, mapToUIMessage(msg, currentUserId)])
      }
    }

    socket.on('new-message', onNewMessage)

    return () => {
      cancelled = true
      socket.off('new-message', onNewMessage)
    }
  }, [peerUserId, currentUserId])

  useEffect(() => {
    const onError = (err: { message: string }) => {
      kernelBus.emit('notification:push', {
        id: crypto.randomUUID(),
        appId: 'messages',
        title: 'Message error',
        body: `Message not delivered: ${err.message}`,
        timestamp: Date.now(),
        read: false,
      })
    }
    socket.on('message-error', onError)
    return () => {
      socket.off('message-error', onError)
    }
  }, [])

  const send = useCallback(
    (body: string) => {
      const trimmed = body.trim()
      if (!trimmed) return
      socket.emit('send-message', { toId: peerUserId, body: trimmed })
    },
    [peerUserId]
  )

  return { threadMessages, text, setText, send }
}
