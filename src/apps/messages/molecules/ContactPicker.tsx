import type { CSSProperties } from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  GlassButton,
  GlassCard,
  Typography,
  colors,
  spacing,
  slideLeft,
  pressScale,
} from '../../../design'
import ConversationAvatar from '../atoms/ConversationAvatar'
import EmptyState from '../atoms/EmptyState'
import SearchInput from '../atoms/SearchInput'
import { useContactPicker } from '../hooks/useContactPicker'
import { SERVER_BASE_URL } from '../../../lib/socket'

// ── Styles ─────────────────────────────────────────────────────

const ROOT_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
  background: colors.bg,
}

const HEADER_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: spacing[4],
  flexShrink: 0,
}

const SEARCH_WRAPPER_STYLE: CSSProperties = {
  padding: `0 ${spacing[4]}px ${spacing[3]}px`,
  flexShrink: 0,
}

const LIST_STYLE: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: `0 ${spacing[4]}px`,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[2],
}

const CONTACT_ROW_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing[3],
  padding: `${spacing[3]}px ${spacing[4]}px`,
  cursor: 'pointer',
}

const ROW_ERROR_STYLE: CSSProperties = {
  fontSize: 12,
  color: colors.danger,
  paddingLeft: spacing[4],
  paddingBottom: spacing[1],
}

// ── Types ───────────────────────────────────────────────────────

interface ContactPickerProps {
  onSelect: (userId: string, userName: string) => void
  onClose: () => void
}

// ── Component ───────────────────────────────────────────────────

export default function ContactPicker({ onSelect, onClose }: ContactPickerProps) {
  const { filtered, search, setSearch } = useContactPicker()
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({})
  const [resolving, setResolving] = useState<Record<string, boolean>>({})

  const handleContactClick = async (contactId: string, _contactName: string, phone: string) => {
    setRowErrors(prev => ({ ...prev, [contactId]: '' }))
    setResolving(prev => ({ ...prev, [contactId]: true }))

    try {
      const res = await fetch(
        `${SERVER_BASE_URL}/users/phone/${encodeURIComponent(phone)}`,
        { credentials: 'include' }
      )

      if (res.ok) {
        const data = await res.json()
        onSelect(data.userId, data.name)
      } else if (res.status === 404) {
        setRowErrors(prev => ({
          ...prev,
          [contactId]: 'Este contacto aún no está registrado',
        }))
      } else {
        setRowErrors(prev => ({
          ...prev,
          [contactId]: 'No se pudo conectar con el servidor. Intenta de nuevo.',
        }))
      }
    } catch {
      setRowErrors(prev => ({
        ...prev,
        [contactId]: 'No se pudo conectar con el servidor. Intenta de nuevo.',
      }))
    } finally {
      setResolving(prev => ({ ...prev, [contactId]: false }))
    }
  }

  return (
    <motion.div
      variants={slideLeft}
      initial="initial"
      animate="animate"
      exit="exit"
      style={ROOT_STYLE}
    >
      <div style={HEADER_STYLE}>
        <Typography variant="title">Nuevo Mensaje</Typography>
        <GlassButton variant="ghost" onClick={onClose}>
          <i className="fi fi-rr-cross" />
        </GlassButton>
      </div>

      <div style={SEARCH_WRAPPER_STYLE}>
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar contactos…" />
      </div>

      <div style={LIST_STYLE}>
        {filtered.length === 0 ? (
          <EmptyState message="No se encontraron contactos" />
        ) : (
          filtered.map(c => (
            <div key={c.id}>
              <motion.div
                variants={pressScale}
                initial="rest"
                whileTap="pressed"
                onClick={() => handleContactClick(c.id, c.name, c.phone)}
                style={{ opacity: resolving[c.id] ? 0.5 : 1 }}
              >
                <GlassCard style={CONTACT_ROW_STYLE}>
                  <ConversationAvatar name={c.name} />
                  <Typography variant="body">{c.name}</Typography>
                </GlassCard>
              </motion.div>
              {rowErrors[c.id] ? (
                <p style={ROW_ERROR_STYLE}>{rowErrors[c.id]}</p>
              ) : null}
            </div>
          ))
        )}
      </div>
    </motion.div>
  )
}
