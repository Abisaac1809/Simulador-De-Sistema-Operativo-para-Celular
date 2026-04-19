import { useState } from 'react'
import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { GlassButton, Typography, colors, font, radius, spacing, slideLeft } from '../../../design'
import type { Contact } from '../../../types'
import { useContactEditor } from '../hooks/useContactEditor'

const ROOT_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
}

const TOOLBAR_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: spacing[4],
  flexShrink: 0,
}

const FORM_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[1],
  padding: spacing[4],
  flex: 1,
  overflowY: 'auto',
}

const FIELD_WRAPPER_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[1],
}

const LABEL_STYLE: CSSProperties = {
  fontSize: 11,
  fontFamily: font.sans,
  color: colors.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const INPUT_STYLE: CSSProperties = {
  background: colors.glassBg,
  border: `1px solid ${colors.glassBorder}`,
  borderRadius: radius.button,
  padding: `${spacing[3]}px ${spacing[3]}px`,
  color: colors.textPrimary,
  fontSize: 15,
  fontFamily: font.sans,
  outline: 'none',
  width: '100%',
}

interface ContactFormProps {
  initial: Contact | null
  onSaved: (contact: Contact) => void
  onCancel: () => void
}

export default function ContactForm({ initial, onSaved, onCancel }: ContactFormProps) {
  const { name, phone, email, setName, setPhone, setEmail, save } = useContactEditor(initial)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSave = async () => {
    if (isSaving) return
    setSaveError(null)
    setIsSaving(true)
    try {
      const saved = await save()
      onSaved(saved)
    } catch (err) {
      console.error('[ContactForm] save failed:', err)
      const detail = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
      setSaveError(`Error: ${detail}`)
    } finally {
      setIsSaving(false)
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
      <div style={TOOLBAR_STYLE}>
        <GlassButton variant="ghost" onClick={onCancel}>
          <i className="fi fi-rr-cross" />
        </GlassButton>
        <Typography variant="title">
          {initial ? 'Edit Contact' : 'New Contact'}
        </Typography>
        <GlassButton variant="primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save'}
        </GlassButton>
      </div>

      <div style={FORM_STYLE}>
        <div style={FIELD_WRAPPER_STYLE}>
          <label style={LABEL_STYLE}>Name</label>
          <input
            style={INPUT_STYLE}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Full name"
            autoFocus
          />
        </div>
        <div style={FIELD_WRAPPER_STYLE}>
          <label style={LABEL_STYLE}>Phone</label>
          <input
            style={INPUT_STYLE}
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+1 555 000 0000"
          />
        </div>
        <div style={FIELD_WRAPPER_STYLE}>
          <label style={LABEL_STYLE}>Email</label>
          <input
            style={INPUT_STYLE}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="email@example.com"
          />
        </div>

        {saveError && (
          <p style={{ color: 'rgba(255,80,80,0.9)', fontSize: 13, textAlign: 'center', marginTop: spacing[2] }}>
            {saveError}
          </p>
        )}
        <GlassButton variant="primary" fullWidth onClick={handleSave} disabled={isSaving} style={{ marginTop: spacing[3] }}>
          {isSaving ? 'Saving…' : 'Save'}
        </GlassButton>
      </div>
    </motion.div>
  )
}
