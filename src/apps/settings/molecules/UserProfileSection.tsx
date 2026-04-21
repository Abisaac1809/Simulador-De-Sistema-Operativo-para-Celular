import type { CSSProperties } from 'react'
import { GlassCard, Typography, Spinner, colors, spacing } from '../../../design'
import type { UserProfile } from '../hooks/useUserProfile'
import ProfileAvatar from '../atoms/ProfileAvatar'
import SettingsRow from '../atoms/SettingsRow'

const CENTER_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: spacing[2],
  paddingBottom: spacing[3],
}

const DIVIDER_STYLE: CSSProperties = {
  width: '100%',
  height: 1,
  background: colors.glassBorder,
  margin: `${spacing[1]}px 0`,
}

interface UserProfileSectionProps {
  user: UserProfile | null
  loading: boolean
  error: string | null
}

export default function UserProfileSection({ user, loading, error }: UserProfileSectionProps) {
  return (
    <GlassCard padding={spacing[4]}>
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: spacing[4] }}>
          <Spinner />
        </div>
      )}

      {!loading && error && (
        <Typography variant="caption" style={{ color: colors.textMuted, textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      {!loading && user && (
        <>
          <div style={CENTER_STYLE}>
            <ProfileAvatar name={user.name} size={72} />
            <Typography variant="title">{user.name}</Typography>
          </div>
          <div style={DIVIDER_STYLE} />
          <SettingsRow icon="fi fi-rr-phone-call" label="Teléfono" value={user.phone} />
          <SettingsRow icon="fi fi-rr-envelope" label="Correo" value={user.email} />
        </>
      )}
    </GlassCard>
  )
}
