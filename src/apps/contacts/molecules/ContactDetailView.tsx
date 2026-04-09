import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { GlassButton, Typography, colors, font, radius, spacing, slideLeft } from '../../../design'
import type { Contact } from '../../../types'
import AvatarCircle from '../atoms/AvatarCircle'
import ContactDetail from '../atoms/ContactDetail'

const LARGE_AVATAR_SIZE = 80
const HEADER_FONT_SIZE = 22

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

const HERO_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: spacing[3],
  padding: `${spacing[6]}px ${spacing[4]}px ${spacing[4]}px`,
  flexShrink: 0,
}

const ACTION_ROW_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: spacing[3],
  justifyContent: 'center',
  padding: `0 ${spacing[4]}px`,
  flexShrink: 0,
}

const DETAILS_STYLE: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: `${spacing[2]}px ${spacing[4]}px`,
}

const DIVIDER_STYLE: CSSProperties = {
  height: 1,
  background: colors.glassBorder,
  margin: `0 ${spacing[4]}px`,
  flexShrink: 0,
}

const ACTION_BTN_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: spacing[1],
  background: colors.glassBg,
  border: `1px solid ${colors.glassBorder}`,
  borderRadius: radius.button,
  padding: `${spacing[3]}px ${spacing[5]}px`,
  cursor: 'pointer',
  color: colors.textPrimary,
  fontSize: 12,
  fontFamily: font.sans,
}

interface ContactDetailViewProps {
  contact: Contact
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function ContactDetailView({ contact, onBack, onEdit, onDelete }: ContactDetailViewProps) {
  return (
    <motion.div
      variants={slideLeft}
      initial="initial"
      animate="animate"
      exit="exit"
      style={ROOT_STYLE}
    >
      <div style={TOOLBAR_STYLE}>
        <GlassButton variant="ghost" onClick={onBack}>
          <i className="fi fi-rr-arrow-left" />
        </GlassButton>
        <div style={{ display: 'flex', gap: spacing[2] }}>
          <GlassButton variant="ghost" onClick={onEdit}>
            <i className="fi fi-rr-edit" />
          </GlassButton>
          <GlassButton variant="ghost" onClick={onDelete}>
            <i className="fi fi-rr-trash" style={{ color: colors.danger }} />
          </GlassButton>
        </div>
      </div>

      <div style={HERO_STYLE}>
        <AvatarCircle name={contact.name} size={LARGE_AVATAR_SIZE} />
        <Typography variant="title" style={{ fontSize: HEADER_FONT_SIZE }}>
          {contact.name}
        </Typography>
      </div>

      <div style={ACTION_ROW_STYLE}>
        <button style={ACTION_BTN_STYLE}>
          <i className="fi fi-rr-phone-call" />
          Call
        </button>
        <button style={ACTION_BTN_STYLE}>
          <i className="fi fi-rr-comment-alt" />
          Message
        </button>
      </div>

      <div style={DIVIDER_STYLE} />

      <div style={DETAILS_STYLE}>
        {contact.phone && (
          <ContactDetail icon="fi fi-rr-phone-call" label="Phone" value={contact.phone} />
        )}
        {contact.email && (
          <ContactDetail icon="fi fi-rr-envelope" label="Email" value={contact.email} />
        )}
      </div>
    </motion.div>
  )
}
