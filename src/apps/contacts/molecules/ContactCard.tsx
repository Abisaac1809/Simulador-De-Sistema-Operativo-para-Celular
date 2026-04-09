import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { GlassCard, Typography, colors, spacing, pressScale } from '../../../design'
import type { Contact } from '../../../types'
import AvatarCircle from '../atoms/AvatarCircle'
import ContactName from '../atoms/ContactName'

const CARD_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: `${spacing[3]}px ${spacing[4]}px`,
  gap: spacing[3],
  cursor: 'pointer',
  width: '100%',
}

const INFO_STYLE: CSSProperties = {
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[1],
}

interface ContactCardProps {
  contact: Contact
  onSelect: (id: string) => void
}

export default function ContactCard({ contact, onSelect }: ContactCardProps) {
  return (
    <motion.div
      variants={pressScale}
      initial="rest"
      whileTap="pressed"
      onClick={() => onSelect(contact.id)}
    >
      <GlassCard style={CARD_STYLE}>
        <AvatarCircle name={contact.name} />
        <div style={INFO_STYLE}>
          <ContactName name={contact.name} />
          <Typography variant="caption" style={{ color: colors.textMuted }}>
            {contact.phone}
          </Typography>
        </div>
        <i className="fi fi-rr-angle-right" style={{ color: colors.textMuted, fontSize: 12 }} />
      </GlassCard>
    </motion.div>
  )
}
