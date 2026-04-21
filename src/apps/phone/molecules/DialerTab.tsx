import { useState } from 'react'
import type { CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Typography, colors, font, fadeIn, spacing } from '../../../design'
import { kernelBus } from '../../../kernel/events'
import { SERVER_BASE_URL } from '../../../lib/socket'
import * as callsService from '../../../kernel/services/calls'
import type { Contact } from '../../../types'
import { useContacts } from '../hooks/useContacts'
import { usePhoneLookup } from '../hooks/usePhoneLookup'
import ContactRow from '../atoms/ContactRow'
import Numpad from './Numpad'

const VENEZUELAN_PHONE_REGEX = /^0?4\d{9}$/

// ── Styles ────────────────────────────────────────────────

const ROOT_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
}

const HEADER_STYLE: CSSProperties = {
  padding: `${spacing[4]}px ${spacing[4]}px ${spacing[2]}px`,
  flexShrink: 0,
}

const SEARCH_WRAPPER_STYLE: CSSProperties = {
  padding: `0 ${spacing[4]}px ${spacing[2]}px`,
  flexShrink: 0,
}

const SEARCH_INPUT_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing[2],
  background: colors.glassBg,
  border: `1px solid ${colors.glassBorder}`,
  borderRadius: 14,
  padding: `${spacing[2]}px ${spacing[3]}px`,
}

const SEARCH_ICON_STYLE: CSSProperties = {
  color: colors.textMuted,
  fontSize: 14,
  flexShrink: 0,
}

const INPUT_STYLE: CSSProperties = {
  flex: 1,
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: colors.textPrimary,
  fontSize: 14,
  fontFamily: font.sans,
}

const DIGIT_DISPLAY_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingBlock: spacing[3],
  gap: spacing[1],
  flexShrink: 0,
}

const CONTACT_LIST_STYLE: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[2],
  padding: `0 ${spacing[4]}px`,
}

const EMPTY_STATE_STYLE: CSSProperties = {
  textAlign: 'center',
  padding: `${spacing[8]}px ${spacing[4]}px`,
  color: colors.textMuted,
}

const NUMPAD_WRAPPER_STYLE: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  paddingBottom: spacing[4],
}

// ── Component ─────────────────────────────────────────────

export default function DialerTab() {
  const [search, setSearch] = useState('')
  const [digits, setDigits] = useState('')

  const { filtered } = useContacts(search)
  const { result, notFound, loading } = usePhoneLookup(digits)

  const isValidFormat = VENEZUELAN_PHONE_REGEX.test(digits)

  const handleContactCall = async (c: Contact) => {
    const resp = await fetch(
      `${SERVER_BASE_URL}/users/phone/${encodeURIComponent(c.phone)}`,
      { credentials: 'include' }
    )
    if (!resp.ok) {
      kernelBus.emit('notification:push', {
        id: crypto.randomUUID(),
        appId: 'phone',
        title: 'Contacto no localizable',
        body: `${c.name} no está registrado como usuario de NOVA OS.`,
        timestamp: Date.now(),
        read: false,
      })
      return
    }
    const data = await resp.json() as { userId: string }
    callsService.startCall(data.userId, c.name)
  }

  const handleNumpadCall = () => {
    if (!result) return
    callsService.startCall(result.id, result.name)
    setDigits('')
  }

  return (
    <div style={ROOT_STYLE}>
      <div style={HEADER_STYLE}>
        <Typography variant="body" style={{ fontWeight: font.weight.semibold }}>Teclado</Typography>
      </div>

      <div style={SEARCH_WRAPPER_STYLE}>
        <div style={SEARCH_INPUT_STYLE}>
          <i className="fi fi-rr-search" style={SEARCH_ICON_STYLE} />
          <input
            style={INPUT_STYLE}
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar contactos…"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {search.length > 0 ? (
          <motion.div
            key="contact-list"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            style={CONTACT_LIST_STYLE}
          >
            {filtered.length === 0 ? (
              <div style={EMPTY_STATE_STYLE}>
                <Typography variant="caption">No se encontraron contactos</Typography>
              </div>
            ) : (
              filtered.map(c => (
                <ContactRow
                  key={c.id}
                  name={c.name}
                  phone={c.phone}
                  onPress={() => handleContactCall(c)}
                />
              ))
            )}
          </motion.div>
        ) : (
          <motion.div
            key="numpad-view"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}
          >
            {digits.length > 0 && (
              <div style={DIGIT_DISPLAY_STYLE}>
                <Typography variant="title" style={{ fontSize: 28, lineHeight: 1 }}>
                  {digits}
                </Typography>
                {result && (
                  <Typography variant="caption" style={{ color: colors.accentBlue }}>
                    {result.name}
                  </Typography>
                )}
                {isValidFormat && notFound && !loading && (
                  <Typography variant="caption" style={{ color: colors.textMuted }}>
                    Número no registrado
                  </Typography>
                )}
                {!isValidFormat && digits.length > 0 && (
                  <Typography variant="caption" style={{ color: colors.textMuted }}>
                    04XXXXXXXXX ó 4XXXXXXXXX
                  </Typography>
                )}
                {loading && (
                  <Typography variant="caption" style={{ color: colors.textMuted }}>
                    …
                  </Typography>
                )}
              </div>
            )}
            <div style={NUMPAD_WRAPPER_STYLE}>
              <Numpad
                onDigit={(d) => setDigits(prev => prev + d)}
                onBackspace={() => setDigits(prev => prev.slice(0, -1))}
                onCall={handleNumpadCall}
                canCall={!!result}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
