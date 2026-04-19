import { useState } from 'react'
import type { CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { colors, fadeIn } from '../../design'
import { useOSStore } from '../../kernel/store'
import TabBar from './molecules/TabBar'
import RecentsTab from './molecules/RecentsTab'
import DialerTab from './molecules/DialerTab'
import ActiveCallScreen from './molecules/ActiveCallScreen'
import { usePhoneCurrentUser } from './context'

// ── Styles ────────────────────────────────────────────────

const ROOT_STYLE: CSSProperties = {
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: colors.bg,
}

const BODY_STYLE: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}

// ── Components ────────────────────────────────────────────

type Tab = 'recents' | 'dialer'

function PhoneAppInner() {
  const [tab, setTab] = useState<Tab>('recents')
  const activeCall = useOSStore(s => s.activeCall)

  // Active call overrides all tabs — show ActiveCallScreen without tab bar
  if (activeCall) {
    return (
      <div style={ROOT_STYLE}>
        <ActiveCallScreen />
      </div>
    )
  }

  return (
    <div style={ROOT_STYLE}>
      <div style={BODY_STYLE}>
        <AnimatePresence mode="wait">
          {tab === 'recents' && (
            <motion.div
              key="recents"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              style={BODY_STYLE}
            >
              <RecentsTab />
            </motion.div>
          )}
          {tab === 'dialer' && (
            <motion.div
              key="dialer"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              style={BODY_STYLE}
            >
              <DialerTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <TabBar activeTab={tab} onChange={setTab} />
    </div>
  )
}

export default function PhoneApp() {
  const currentUserId = usePhoneCurrentUser()
  if (!currentUserId) return null
  return <PhoneAppInner />
}
