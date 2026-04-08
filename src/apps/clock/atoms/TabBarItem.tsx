import { motion } from 'framer-motion'
import { colors, spacing } from '../../../design'
import Typography from '../../../design/Typography'
import { pressScale } from '../../../design'

interface TabBarItemProps {
  icon: string
  label: string
  active: boolean
  onClick: () => void
}

export default function TabBarItem({ icon, label, active, onClick }: TabBarItemProps) {
  const iconColor = active ? colors.accentBlue : colors.textMuted

  return (
    <motion.button
      variants={pressScale}
      initial="rest"
      whileTap="pressed"
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: spacing[1],
        padding: spacing[2],
        minWidth: 60,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      <i className={icon} style={{ fontSize: 20, color: iconColor }} />
      <Typography variant="caption" style={{ color: iconColor }}>
        {label}
      </Typography>
    </motion.button>
  )
}
