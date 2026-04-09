import { useEffect, useRef, type CSSProperties } from 'react'
import { useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useDrag } from '@use-gesture/react'
import { kernelBus } from '../kernel/events'
import { useOSStore } from '../kernel/store'
import { getApp } from '../kernel/registry'
import { GlassCard, IconWrapper, Typography, toastIn, colors, spacing, font } from '../design'
import type { Notification } from '../types'

// ── Constants ────────────────────────────────────────────────
const MAX_VISIBLE_TOASTS = 3
const AUTO_DISMISS_MS    = 4_000
const SWIPE_THRESHOLD    = 60    // px rightward

// ── Styles ───────────────────────────────────────────────────
const containerStyle: CSSProperties = {
  position:      'absolute',
  top:           spacing[12],
  left:          spacing[4],
  right:         spacing[4],
  display:       'flex',
  flexDirection: 'column',
  gap:           spacing[2],
  zIndex:        40,
  pointerEvents: 'none',
}

const toastRowStyle: CSSProperties = {
  display:    'flex',
  alignItems: 'center',
  gap:        spacing[3],
}

const toastTextColStyle: CSSProperties = {
  display:       'flex',
  flexDirection: 'column',
  gap:           2,
  flex:          1,
  minWidth:      0,
}

const truncateStyle: CSSProperties = {
  overflow:     'hidden',
  textOverflow: 'ellipsis',
  whiteSpace:   'nowrap',
}

// ── ToastItem (molecule) ──────────────────────────────────────

interface ToastItemProps {
  notification: Notification
  onDismiss:    (id: string) => void
  onOpen:       (appId: string) => void
}

function ToastItem({ notification, onDismiss, onOpen }: ToastItemProps) {
  const app = getApp(notification.appId)
  const x   = useMotionValue(0)
  const springX = useSpring(x, { damping: 25, stiffness: 300 })

  // Auto-dismiss after 4 s
  useEffect(() => {
    const handle = setTimeout(() => onDismiss(notification.id), AUTO_DISMISS_MS)
    return () => clearTimeout(handle)
  }, [notification.id, onDismiss])

  const bind = useDrag(
    ({ movement: [mx], last, velocity: [vx] }) => {
      if (!last) {
        x.set(Math.max(0, mx))          // only allow rightward drag
        return
      }
      if (mx > SWIPE_THRESHOLD || vx > 0.5) {
        onDismiss(notification.id)
      } else {
        x.set(0)                         // snap back
      }
    },
    { axis: 'x', filterTaps: true, threshold: 8 },
  )

  function handleTap() {
    onOpen(notification.appId)
    onDismiss(notification.id)
  }

  return (
    <motion.div
      key={notification.id}
      variants={toastIn}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ x: springX, pointerEvents: 'auto', touchAction: 'none' }}
      {...(bind() as object)}
    >
      <GlassCard elevated padding={spacing[3]} onClick={handleTap}>
        <div style={toastRowStyle}>
          <IconWrapper color={app?.color ?? colors.accent} size={36}>
            {app?.icon ?? '🔔'}
          </IconWrapper>
          <div style={toastTextColStyle}>
            <Typography variant="label" style={{ color: colors.textSecondary }}>
              {app?.name ?? notification.appId}
            </Typography>
            <Typography
              variant="caption"
              style={{ fontWeight: font.weight.semibold, ...truncateStyle }}
            >
              {notification.title}
            </Typography>
            <Typography variant="muted" style={truncateStyle}>
              {notification.body}
            </Typography>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

// ── NotificationToasts (organism) ────────────────────────────

export default function NotificationToasts() {
  const [queue, setQueue] = useState<Notification[]>([])
  const openApp = useOSStore(s => s.openApp)

  // Stable ref so the kernelBus handler never captures a stale queue
  const queueRef = useRef(queue)
  useEffect(() => { queueRef.current = queue }, [queue])

  useEffect(() => {
    function handlePush(notification: Notification) {
      // Read DND at emit time to avoid stale closure
      if (useOSStore.getState().doNotDisturb) return

      setQueue(prev => {
        const next = prev.length >= MAX_VISIBLE_TOASTS
          ? prev.slice(1)     // evict oldest
          : prev
        return [...next, notification]
      })
    }

    kernelBus.on('notification:push', handlePush)
    return () => kernelBus.off('notification:push', handlePush)
  }, [])

  function dismiss(id: string) {
    setQueue(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div style={containerStyle} aria-live="polite" aria-label="Notifications">
      <AnimatePresence mode="sync">
        {queue.map(n => (
          <ToastItem
            key={n.id}
            notification={n}
            onDismiss={dismiss}
            onOpen={openApp}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
