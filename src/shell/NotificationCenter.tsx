import { useMemo, useState, useRef, useLayoutEffect, useEffect, type CSSProperties } from 'react'
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useDrag } from '@use-gesture/react'
import { useOSStore } from '../kernel/store'
import { getApp } from '../kernel/registry'
import {
  GlassCard, GlassButton, IconWrapper, Typography,
  slideLeft,
  colors, glass, radius, spacing, font,
} from '../design'
import type { Notification } from '../types'

// ── Constants ────────────────────────────────────────────────
const TOP_ZONE_HEIGHT        = 44   // px — matches status bar height
const PANEL_CLOSE_THRESHOLD  = -60  // px upward swipe on panel to close
const ROW_DISMISS_THRESHOLD  = -80  // px leftward swipe on a row

const SPRING = { type: 'spring', damping: 28, stiffness: 250 } as const

// ── Helpers ──────────────────────────────────────────────────
function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60_000)        return 'Just now'
  if (diff < 3_600_000)     return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000)    return `${Math.floor(diff / 3_600_000)}h ago`
  return `${Math.floor(diff / 86_400_000)}d ago`
}

function formatClockTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

function formatClockDate(date: Date): string {
  return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
}

// ── Styles ───────────────────────────────────────────────────
const overlayStyle: CSSProperties = {
  position:      'absolute',
  inset:         0,
  zIndex:        35,
  display:       'flex',
  flexDirection: 'column',
  alignItems:    'stretch',
}

const topZoneStyle: CSSProperties = {
  position:     'absolute',
  top:          0,
  left:         0,
  right:        0,
  height:       TOP_ZONE_HEIGHT,
  zIndex:       10,       // above panel content, within overlay stacking context
  touchAction:  'none',
  pointerEvents: 'auto',
}

const backdropStyle: CSSProperties = {
  position: 'absolute',
  inset:    0,
}

const panelStyle: CSSProperties = {
  position:        'relative',
  display:         'flex',
  flexDirection:   'column',
  height:          '70%',
  background:      'rgba(12, 12, 18, 0.82)',
  backdropFilter:  glass.backdropFilter,
  WebkitBackdropFilter: glass.backdropFilter,
  borderBottomLeftRadius:  radius.card,
  borderBottomRightRadius: radius.card,
  borderBottom: `0.5px solid ${colors.glassBorder}`,
  borderLeft:   `0.5px solid ${colors.glassBorder}`,
  borderRight:  `0.5px solid ${colors.glassBorder}`,
  touchAction:  'none',
  flexShrink:   0,
}

const dragHandleStyle: CSSProperties = {
  width:        40,
  height:       4,
  borderRadius: radius.pill,
  background:   colors.glassBorderActive,
  margin:       `${spacing[3]}px auto ${spacing[2]}px`,
  flexShrink:   0,
}

const scrollListStyle: CSSProperties = {
  overflowY:    'auto',
  flex:         1,
  paddingLeft:  spacing[4],
  paddingRight: spacing[4],
  paddingBottom: spacing[2],
}

const groupHeaderStyle: CSSProperties = {
  display:    'flex',
  alignItems: 'center',
  gap:        spacing[2],
  paddingTop:    spacing[4],
  paddingBottom: spacing[2],
}

const rowInnerStyle: CSSProperties = {
  display:    'flex',
  alignItems: 'flex-start',
  gap:        spacing[3],
}

const rowTextColStyle: CSSProperties = {
  flex:          1,
  minWidth:      0,
  display:       'flex',
  flexDirection: 'column',
  gap:           2,
}

const rowMetaStyle: CSSProperties = {
  display:       'flex',
  flexDirection: 'column',
  alignItems:    'flex-end',
  gap:           2,
  flexShrink:    0,
}

const truncateStyle: CSSProperties = {
  overflow:     'hidden',
  textOverflow: 'ellipsis',
  whiteSpace:   'nowrap',
}

const footerStyle: CSSProperties = {
  padding:   `${spacing[3]}px ${spacing[4]}px ${spacing[5]}px`,
  flexShrink: 0,
}

const emptyStyle: CSSProperties = {
  display:        'flex',
  justifyContent: 'center',
  alignItems:     'center',
  paddingTop:     spacing[8],
  paddingBottom:  spacing[8],
}

const clockHeaderStyle: CSSProperties = {
  display:        'flex',
  flexDirection:  'column',
  alignItems:     'center',
  paddingTop:     spacing[5],
  paddingBottom:  spacing[5],
  flexShrink:     0,
}

const clockTimeStyle: CSSProperties = {
  fontFamily:    font.sans,
  fontSize:      68,
  fontWeight:    font.weight.thin,
  color:         colors.textPrimary,
  letterSpacing: -2,
  lineHeight:    1,
}

const clockDateStyle: CSSProperties = {
  fontFamily:  font.sans,
  fontSize:    14,
  fontWeight:  font.weight.regular,
  color:       colors.textSecondary,
  marginTop:   spacing[1],
  letterSpacing: 0.1,
}

// ── ClockHeader (atom) ────────────────────────────────────────

function ClockHeader() {
  const time = useOSStore(s => s.time)
  return (
    <div style={clockHeaderStyle}>
      <span style={clockTimeStyle}>{formatClockTime(time)}</span>
      <span style={clockDateStyle}>{formatClockDate(time)}</span>
    </div>
  )
}

// ── NotificationRow (atom) ────────────────────────────────────

interface NotificationRowProps {
  notification: Notification
  onDismiss:    (id: string) => void
}

function NotificationRow({ notification, onDismiss }: NotificationRowProps) {
  const app     = getApp(notification.appId)
  const x       = useMotionValue(0)
  const [dismissed, setDismissed] = useState(false)

  const bind = useDrag(
    ({ movement: [mx], last, velocity: [vx] }) => {
      if (!last) {
        x.set(Math.min(0, mx))          // only leftward drag
        return
      }
      if (mx < ROW_DISMISS_THRESHOLD || vx < -0.5) {
        setDismissed(true)
        onDismiss(notification.id)
      } else {
        animate(x, 0, SPRING)
      }
    },
    { axis: 'x', filterTaps: true, threshold: 8 },
  )

  if (dismissed) return null

  return (
    <motion.div
      variants={slideLeft}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ x, touchAction: 'none', marginBottom: spacing[2] }}
      {...(bind() as object)}
    >
      <GlassCard padding={spacing[3]}>
        <div style={rowInnerStyle}>
          <IconWrapper color={app?.color ?? colors.accent} size={32}>
            {app?.icon ?? '🔔'}
          </IconWrapper>
          <div style={rowTextColStyle}>
            <Typography
              variant="caption"
              style={{ fontWeight: font.weight.semibold, ...truncateStyle }}
            >
              {notification.title}
            </Typography>
            <Typography variant="muted" style={{ ...truncateStyle, whiteSpace: 'normal', WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' as const }}>
              {notification.body}
            </Typography>
          </div>
          <div style={rowMetaStyle}>
            <Typography variant="muted" style={{ fontSize: 10 }}>
              {formatRelativeTime(notification.timestamp)}
            </Typography>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

// ── NotificationGroup (molecule) ──────────────────────────────

interface NotificationGroupProps {
  appId:         string
  notifications: Notification[]
  onDismiss:     (id: string) => void
}

function NotificationGroup({ appId, notifications, onDismiss }: NotificationGroupProps) {
  const app = getApp(appId)

  return (
    <div>
      <div style={groupHeaderStyle}>
        <span style={{ fontSize: 14 }}>{app?.icon ?? '🔔'}</span>
        <Typography
          variant="label"
          style={{ color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: 11 }}
        >
          {app?.name ?? appId}
        </Typography>
      </div>
      <AnimatePresence>
        {notifications.map(n => (
          <NotificationRow key={n.id} notification={n} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}

// ── NotificationCenter (organism) ────────────────────────────

interface NotificationCenterProps {
  isOpen:  boolean
  onClose: () => void
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const notifications         = useOSStore(s => s.notifications)
  const clearNotification     = useOSStore(s => s.clearNotification)
  const clearAllNotifications = useOSStore(s => s.clearAllNotifications)

  // Group notifications by appId, preserving insertion order
  const groups = useMemo<Array<[string, Notification[]]>>(() => {
    const map = new Map<string, Notification[]>()
    for (const n of notifications) {
      if (!map.has(n.appId)) map.set(n.appId, [])
      map.get(n.appId)!.push(n)
    }
    return Array.from(map.entries())
  }, [notifications])

  // ── Panel position state ──────────────────────────────────
  const panelRef        = useRef<HTMLDivElement>(null)
  const panelHeightRef  = useRef(0)
  const [measured,      setMeasured]     = useState(false)
  const [internalOpen,  setInternalOpen] = useState(false)

  // y = 0 → fully visible; y = -panelHeight → fully hidden above viewport
  const y = useMotionValue(0)

  // Derive backdrop opacity from panel position (0 = hidden, 0.45 = fully open)
  const backdropOpacity = useTransform(y, (yVal) => {
    const h = panelHeightRef.current
    if (h === 0) return 0
    return Math.max(0, Math.min(0.45, 0.45 * (yVal + h) / h))
  })

  // Measure panel height after first render and push it off-screen
  useLayoutEffect(() => {
    const h = panelRef.current?.offsetHeight ?? 0
    panelHeightRef.current = h
    y.set(-h)
    setMeasured(true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync external isOpen → snap open (e.g. AssistiveTouch tap)
  useEffect(() => {
    if (isOpen && !internalOpen && panelHeightRef.current > 0) {
      animate(y, 0, SPRING)
      setInternalOpen(true)
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Helpers ───────────────────────────────────────────────
  function snapOpen() {
    animate(y, 0, SPRING)
    setInternalOpen(true)
  }

  function snapClose() {
    animate(y, -panelHeightRef.current, SPRING)
    setInternalOpen(false)
    onClose()
  }

  // ── Open gesture: drag down from top strip ────────────────
  const bindOpenZone = useDrag(
    ({ movement: [, my], last, velocity: [, vy] }) => {
      if (internalOpen) return
      const h      = panelHeightRef.current
      const rawY   = -h + my                            // starts fully hidden
      const capped = Math.max(-h, Math.min(0, rawY))   // clamp to [-h, 0]

      if (!last) {
        y.set(capped)
        return
      }

      const progress = (capped + h) / h  // 0 = closed, 1 = fully open
      // Fast swipe OR drag beyond 30% opens it
      if (progress >= 0.3 || vy > 0.5) snapOpen()
      else                             snapClose()
    },
    { axis: 'y', filterTaps: true, threshold: 10 },
  )

  // ── Close gesture: swipe up on panel ─────────────────────
  const bindPanel = useDrag(
    ({ movement: [, my], last }) => {
      if (!internalOpen) return
      const capped = Math.min(0, my)   // only upward (negative)

      if (!last) {
        y.set(capped)
        return
      }

      if (my < PANEL_CLOSE_THRESHOLD) snapClose()
      else                             animate(y, 0, SPRING)
    },
    { axis: 'y', filterTaps: true, threshold: 8 },
  )

  function handleClearAll() {
    clearAllNotifications()
    snapClose()
  }

  return (
    // Overlay: pointer-events none when closed so content below stays interactive,
    // except the top drag zone which is always active.
    <div style={{ ...overlayStyle, pointerEvents: internalOpen ? 'auto' : 'none' }}>

      {/* Always-active top strip — captures the open drag gesture */}
      {!internalOpen && (
        <div
          style={{ ...topZoneStyle, pointerEvents: 'auto' }}
          {...(bindOpenZone() as object)}
        />
      )}

      {/* Backdrop — fades in as panel slides down */}
      <motion.div
        style={{ ...backdropStyle, background: 'rgba(0, 0, 0, 1)', opacity: backdropOpacity }}
        onClick={internalOpen ? snapClose : undefined}
      />

      {/* Panel — always in DOM, positioned by y motionValue */}
      <motion.div
        ref={panelRef}
        style={{
          ...panelStyle,
          y,
          visibility: measured ? 'visible' : 'hidden',
        }}
        {...(bindPanel() as object)}
      >
        {/* Drag handle */}
        <div style={dragHandleStyle} />

        {/* Clock */}
        <ClockHeader />

        {/* Scrollable notification list */}
        <div style={scrollListStyle}>
          {groups.length === 0 ? (
            <div style={emptyStyle}>
              <Typography variant="muted">No notifications</Typography>
            </div>
          ) : (
            groups.map(([appId, notifs]) => (
              <NotificationGroup
                key={appId}
                appId={appId}
                notifications={notifs}
                onDismiss={clearNotification}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {groups.length > 0 && (
          <div style={footerStyle}>
            <GlassButton variant="ghost" fullWidth onClick={handleClearAll}>
              Clear All
            </GlassButton>
          </div>
        )}
      </motion.div>
    </div>
  )
}
