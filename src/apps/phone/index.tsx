import { useState } from 'react'
import type { CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { colors, fadeIn } from '../../design'
import TabBar from './molecules/TabBar'
import RecentsTab from './molecules/RecentsTab'
import { usePhoneCurrentUser } from './context'

// ── Styles ────────────────────────────────────────────────────

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

// ── Components ────────────────────────────────────────────────

type Tab = 'recents' | 'dialer'

function PhoneAppInner() {
  const [tab, setTab] = useState<Tab>('recents')

  // NOTE: activeCall branch + DialerTab added in Plan 27-03. For now always show tab content.
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
              {/* TODO(27-03): DialerTab */}
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
