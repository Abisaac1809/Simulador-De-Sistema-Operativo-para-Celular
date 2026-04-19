import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { GlassCard, IconWrapper, Typography, colors, spacing } from '../../../design'

interface Props {
  name: string
  phone: string
  onPress: () => void
}

const rowStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing[3],
}

const textColStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  flex: 1,
  minWidth: 0,
}

export default function ContactRow({ name, phone, onPress }: Props) {
  return (
    <motion.div whileTap={{ scale: 0.96 }} onClick={onPress} style={{ cursor: 'pointer' }}>
      <GlassCard padding={spacing[3]}>
        <div style={rowStyle}>
          <IconWrapper color={colors.accentBlue} size={40}>
            {name.charAt(0).toUpperCase()}
          </IconWrapper>
          <div style={textColStyle}>
            <Typography variant="body" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {name}
            </Typography>
            <Typography variant="caption" style={{ color: colors.textSecondary }}>
              {phone}
            </Typography>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
