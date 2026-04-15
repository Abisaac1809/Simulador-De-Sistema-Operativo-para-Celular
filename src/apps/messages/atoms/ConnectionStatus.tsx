import { useState, useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { socket } from '../../../lib/socket'
import { colors } from '../../../design/tokens'

// ── Constants ───────────────────────────────────────────────────
const DOT_SIZE_PX = 8
const PULSE_DURATION_MS = 1200
const CONNECTED_COLOR = 'rgba(80,220,120,0.85)'
const PULSE_KEYFRAMES = `
  @keyframes nova-connection-pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
`

type ConnectionState = 'connected' | 'connecting' | 'disconnected'

function getInitialState(): ConnectionState {
  return socket.connected ? 'connected' : 'connecting'
}

function dotStyle(state: ConnectionState): CSSProperties {
  switch (state) {
    case 'connected':
      return {
        width: DOT_SIZE_PX,
        height: DOT_SIZE_PX,
        borderRadius: '50%',
        background: CONNECTED_COLOR,
        flexShrink: 0,
      }
    case 'connecting':
      return {
        width: DOT_SIZE_PX,
        height: DOT_SIZE_PX,
        borderRadius: '50%',
        background: colors.textMuted,
        flexShrink: 0,
        animation: `nova-connection-pulse ${PULSE_DURATION_MS}ms ease-in-out infinite`,
      }
    case 'disconnected':
      return {
        width: DOT_SIZE_PX,
        height: DOT_SIZE_PX,
        borderRadius: '50%',
        background: 'transparent',
        border: `2px solid ${colors.danger}`,
        flexShrink: 0,
        boxSizing: 'border-box',
      }
  }
}

function ariaLabel(state: ConnectionState): string {
  switch (state) {
    case 'connected':     return 'Connected'
    case 'connecting':    return 'Connecting'
    case 'disconnected':  return 'Disconnected'
  }
}

export default function ConnectionStatus() {
  const [state, setState] = useState<ConnectionState>(getInitialState)
  const styleTagRef = useRef<HTMLStyleElement | null>(null)

  // Inject keyframe styles once
  useEffect(() => {
    if (!styleTagRef.current) {
      const tag = document.createElement('style')
      tag.textContent = PULSE_KEYFRAMES
      document.head.appendChild(tag)
      styleTagRef.current = tag
    }
    return () => {
      if (styleTagRef.current) {
        document.head.removeChild(styleTagRef.current)
        styleTagRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const onConnect    = () => setState('connected')
    const onDisconnect = () => setState('disconnected')
    const onReconnect  = () => setState('connecting')

    socket.on('connect',             onConnect)
    socket.on('disconnect',          onDisconnect)
    socket.on('reconnect_attempt',   onReconnect)
    socket.on('reconnect',           onConnect)

    return () => {
      socket.off('connect',           onConnect)
      socket.off('disconnect',        onDisconnect)
      socket.off('reconnect_attempt', onReconnect)
      socket.off('reconnect',         onConnect)
    }
  }, [])

  return (
    <span
      role="status"
      aria-label={ariaLabel(state)}
      style={dotStyle(state)}
    />
  )
}
