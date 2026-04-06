import { useState } from 'react'
import type { CSSProperties } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useDrag } from '@use-gesture/react'
import { useOSStore } from './kernel/store'
import LockScreen from './shell/LockScreen'
import HomeScreen from './shell/HomeScreen'
import AppContainer from './shell/AppContainer'
import AppSwitcher from './shell/AppSwitcher'
import NotificationToasts from './shell/NotificationToasts'
import NotificationCenter from './shell/NotificationCenter'
import StatusBar from './shell/StatusBar'

// ── Constants ─────────────────────────────────────────────────
const SWITCHER_SWIPE_THRESHOLD  = 60   // px upward to open the switcher
const SWITCHER_MAX_VELOCITY     = 1.5  // max vy — distinguishes "slow" from fast swipes
const GESTURE_ZONE_HEIGHT       = 40   // px, bottom-edge strip that listens for swipe-up
const NOTIF_CENTER_OPEN_THRESHOLD = 60 // px downward to open notification center
const TOP_ZONE_HEIGHT           = 44   // px, top-edge strip that listens for swipe-down

// ── Styles ────────────────────────────────────────────────────
const statusBarOverlayStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 30,
  pointerEvents: 'none',
}

const gestureZoneStyle: CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: GESTURE_ZONE_HEIGHT,
  zIndex: 25,
  touchAction: 'none',
}

const topGestureZoneStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: TOP_ZONE_HEIGHT,
  zIndex: 31,
  touchAction: 'none',
}

export default function App() {
  const isLocked     = useOSStore(s => s.isLocked)
  const focusedAppId = useOSStore(s => s.focusedAppId)

  const [isSwitcherOpen,    setIsSwitcherOpen]    = useState(false)
  const [isNotifCenterOpen, setIsNotifCenterOpen] = useState(false)

  const bindTopZone = useDrag(
    ({ movement: [, my], last }) => {
      if (!last) return
      if (my > NOTIF_CENTER_OPEN_THRESHOLD) setIsNotifCenterOpen(true)
    },
    { axis: 'y', filterTaps: true, threshold: 10 },
  )

  const bindGestureZone = useDrag(
    ({ movement: [, my], last, velocity: [, vy] }) => {
      if (!last) return
      // Upward swipe (my is negative) at low velocity = "slow swipe up"
      if (my < -SWITCHER_SWIPE_THRESHOLD && Math.abs(vy) < SWITCHER_MAX_VELOCITY) {
        setIsSwitcherOpen(true)
      }
    },
    { axis: 'y', filterTaps: true, threshold: 10 },
  )

  const screen = (
    <div className="os-screen">
      {/* Lock / Home transition */}
      <AnimatePresence mode="wait">
        {isLocked
          ? <LockScreen key="lock" />
          : <HomeScreen key="home" />
        }
      </AnimatePresence>

      {/* App overlay — z-index 10 */}
      {!isLocked && <AppContainer />}

      {/* Task manager — z-index 20 */}
      {!isLocked && (
        <AppSwitcher
          isOpen={isSwitcherOpen}
          onClose={() => setIsSwitcherOpen(false)}
        />
      )}

      {/* Swipe-up zone at the bottom edge — z-index 25 */}
      {!isLocked && (
        <div style={gestureZoneStyle} {...bindGestureZone()} />
      )}

      {/* StatusBar overlay when an app is open — z-index 30
          (HomeScreen renders its own StatusBar; this one covers apps) */}
      {!isLocked && focusedAppId && (
        <div style={statusBarOverlayStyle}>
          <StatusBar />
        </div>
      )}

      {/* Swipe-down zone at the top edge — z-index 31 */}
      {!isLocked && (
        <div style={topGestureZoneStyle} {...bindTopZone()} />
      )}

      {/* Notification center panel — z-index 35 */}
      {!isLocked && (
        <NotificationCenter
          isOpen={isNotifCenterOpen}
          onClose={() => setIsNotifCenterOpen(false)}
        />
      )}

      {/* Toast notifications — z-index 40 */}
      {!isLocked && <NotificationToasts />}
    </div>
  )

  return (
    <>
      <div className="desktop-stage">
        <div className="phone-shell">
          <div className="phone-side-btn phone-side-btn--power" />
          <div className="phone-side-btn phone-side-btn--vol-up" />
          <div className="phone-side-btn phone-side-btn--vol-down" />
          <div className="phone-notch" />
          <div className="phone-screen">
            {screen}
          </div>
          <div className="phone-home-bar" />
        </div>
      </div>

      <div className="mobile-stage">
        {screen}
      </div>
    </>
  )
}
