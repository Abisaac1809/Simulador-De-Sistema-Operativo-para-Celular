import type { CSSProperties } from 'react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GlassButton, Typography, colors, spacing, fadeIn } from '../../design'
import { useConversations } from './hooks/useConversations'
import ConversationList from './molecules/ConversationList'
import ThreadView from './molecules/ThreadView'
import ContactPicker from './molecules/ContactPicker'
import SearchInput from './atoms/SearchInput'

const VIEW_LIST   = 'list'   as const
const VIEW_THREAD = 'thread' as const
const VIEW_PICKER = 'picker' as const

const ROOT_STYLE: CSSProperties = {
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: colors.bg,
}

const HEADER_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${spacing[4]}px ${spacing[4]}px ${spacing[2]}px`,
  flexShrink: 0,
}

const SEARCH_WRAPPER_STYLE: CSSProperties = {
  padding: `0 ${spacing[4]}px ${spacing[3]}px`,
  flexShrink: 0,
}

const VIEW_WRAPPER_STYLE: CSSProperties = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  overflow: 'hidden',
}

type View = 'list' | 'thread' | 'picker'

export default function MessagesApp() {
  const [view, setView] = useState<View>(VIEW_LIST)
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const [selectedContactName, setSelectedContactName] = useState<string>('')

  const { filtered, search, setSearch, load } = useConversations()

  const handleSelectConversation = (contactId: string) => {
    const conv = filtered.find(c => c.contactId === contactId)
    setSelectedContactId(contactId)
    setSelectedContactName(conv?.contactName ?? '')
    setView(VIEW_THREAD)
  }

  const handlePickContact = (contactId: string, contactName: string) => {
    setSelectedContactId(contactId)
    setSelectedContactName(contactName)
    setView(VIEW_THREAD)
  }

  const handleBackFromThread = async () => {
    await load()
    setView(VIEW_LIST)
  }

  const handleOpenPicker = () => setView(VIEW_PICKER)
  const handleClosePicker = () => setView(VIEW_LIST)

  return (
    <div style={ROOT_STYLE}>
      <AnimatePresence mode="wait">

        {view === VIEW_LIST && (
          <motion.div
            key={VIEW_LIST}
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            style={VIEW_WRAPPER_STYLE}
          >
            <div style={HEADER_STYLE}>
              <Typography variant="title">Messages</Typography>
              <GlassButton variant="primary" onClick={handleOpenPicker}>
                <i className="fi fi-rr-edit" />
              </GlassButton>
            </div>
            <div style={SEARCH_WRAPPER_STYLE}>
              <SearchInput value={search} onChange={setSearch} />
            </div>
            <ConversationList conversations={filtered} onSelect={handleSelectConversation} />
          </motion.div>
        )}

        {view === VIEW_THREAD && selectedContactId && (
          <motion.div
            key={VIEW_THREAD}
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            style={VIEW_WRAPPER_STYLE}
          >
            <ThreadView
              contactId={selectedContactId}
              contactName={selectedContactName}
              onBack={handleBackFromThread}
            />
          </motion.div>
        )}

        {view === VIEW_PICKER && (
          <motion.div
            key={VIEW_PICKER}
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            style={VIEW_WRAPPER_STYLE}
          >
            <ContactPicker
              onSelect={handlePickContact}
              onClose={handleClosePicker}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
