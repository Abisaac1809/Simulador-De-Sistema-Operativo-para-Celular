import type { CSSProperties } from 'react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GlassButton, Typography, colors, spacing, fadeIn } from '../../design'
import { contacts } from '../../kernel/storage'
import type { Contact } from '../../types'
import { useContacts } from './hooks/useContacts'
import ContactsList from './molecules/ContactsList'
import ContactDetailView from './molecules/ContactDetailView'
import ContactForm from './molecules/ContactForm'
import SearchInput from './atoms/SearchInput'

const VIEW_LIST   = 'list'   as const
const VIEW_DETAIL = 'detail' as const
const VIEW_FORM   = 'form'   as const

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

type View = 'list' | 'detail' | 'form'

export default function ContactsApp() {
  const [view, setView] = useState<View>(VIEW_LIST)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { filtered, contactList, search, setSearch, refresh } = useContacts()

  const selectedContact = selectedId
    ? (contactList.find(c => c.id === selectedId) ?? null)
    : null

  const handleSelect = (id: string) => {
    setSelectedId(id)
    setView(VIEW_DETAIL)
  }

  const handleCreate = () => {
    setSelectedId(null)
    setView(VIEW_FORM)
  }

  const handleEdit = () => {
    setView(VIEW_FORM)
  }

  const handleDelete = async () => {
    if (selectedId) {
      await contacts.delete(selectedId)
      await refresh()
      setSelectedId(null)
      setView(VIEW_LIST)
    }
  }

  const handleSaved = async (saved: Contact) => {
    await refresh()
    setSelectedId(saved.id)
    setView(VIEW_DETAIL)
  }

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
              <Typography variant="title">Contacts</Typography>
              <GlassButton variant="primary" onClick={handleCreate}>
                <i className="fi fi-rr-plus" />
              </GlassButton>
            </div>
            <div style={SEARCH_WRAPPER_STYLE}>
              <SearchInput value={search} onChange={setSearch} />
            </div>
            <ContactsList contacts={filtered} onSelect={handleSelect} />
          </motion.div>
        )}

        {view === VIEW_DETAIL && selectedContact && (
          <motion.div
            key={VIEW_DETAIL}
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            style={VIEW_WRAPPER_STYLE}
          >
            <ContactDetailView
              contact={selectedContact}
              onBack={() => setView(VIEW_LIST)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </motion.div>
        )}

        {view === VIEW_FORM && (
          <motion.div
            key={VIEW_FORM}
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            style={VIEW_WRAPPER_STYLE}
          >
            <ContactForm
              initial={selectedContact}
              onSaved={handleSaved}
              onCancel={() => setView(selectedContact ? VIEW_DETAIL : VIEW_LIST)}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
