import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { Typography, colors, spacing, fadeIn } from '../../design'
import { useUserProfile } from './hooks/useUserProfile'
import { useDeviceData } from './hooks/useDeviceData'
import SectionHeader from './atoms/SectionHeader'
import UserProfileSection from './molecules/UserProfileSection'
import DeviceDataSection from './molecules/DeviceDataSection'
import PreferencesSection from './molecules/PreferencesSection'

const ROOT_STYLE: CSSProperties = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}

const HEADER_STYLE: CSSProperties = {
  padding: `${spacing[4]}px ${spacing[4]}px ${spacing[2]}px`,
  flexShrink: 0,
}

const SCROLL_STYLE: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: `0 ${spacing[4]}px ${spacing[6]}px`,
}

export default function SettingsApp() {
  const { user, loading, error } = useUserProfile()
  const deviceData = useDeviceData()

  return (
    <motion.div variants={fadeIn} initial="initial" animate="animate" style={ROOT_STYLE}>
      <div style={HEADER_STYLE}>
        <Typography variant="title" style={{ fontSize: 28 }}>
          <i className="fi fi-rr-settings" style={{ marginRight: spacing[2], color: colors.textSecondary }} />
          Configuración
        </Typography>
      </div>

      <div style={SCROLL_STYLE}>
        <SectionHeader title="Perfil" />
        <UserProfileSection user={user} loading={loading} error={error} />

        <SectionHeader title="Dispositivo" />
        <DeviceDataSection {...deviceData} />

        <SectionHeader title="Preferencias" />
        <PreferencesSection />
      </div>
    </motion.div>
  )
}
