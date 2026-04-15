import type { CSSProperties } from 'react'
import { GlassCard } from '../../design'
import { colors, spacing, font } from '../../design/tokens'
import SetupField from '../atoms/SetupField'
import SetupSubmitButton from '../atoms/SetupSubmitButton'

// ── Copy ──────────────────────────────────────────────────────────────────────

const COPY = {
  nameLabel: 'Your Name',
  phoneLabel: 'Phone Number',
  emailLabel: 'Email',
  ctaIdle: 'Create Account',
  ctaLoading: 'Creating account…',
} as const

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SetupFormProps {
  name: string
  phone: string
  email: string
  phoneError?: string
  onNameChange: (v: string) => void
  onPhoneChange: (v: string) => void
  onEmailChange: (v: string) => void
  loading: boolean
  formError?: string
  onSubmit: () => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SetupForm({
  name,
  phone,
  email,
  phoneError,
  onNameChange,
  onPhoneChange,
  onEmailChange,
  loading,
  formError,
  onSubmit,
}: SetupFormProps) {
  const allFilled = name.trim().length > 0 && phone.trim().length > 0 && email.trim().length > 0

  const fieldGroupStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  }

  const formErrorStyle: CSSProperties = {
    marginTop: spacing[2],
    fontSize: 12,
    color: colors.danger,
    fontFamily: font.sans,
    textAlign: 'center',
  }

  return (
    <GlassCard padding={spacing[6]}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[5] }}>
        <div style={fieldGroupStyle}>
          <SetupField
            id="setup-name"
            label={COPY.nameLabel}
            type="text"
            value={name}
            onChange={onNameChange}
            placeholder="John Appleseed"
            autoComplete="name"
          />
          <SetupField
            id="setup-phone"
            label={COPY.phoneLabel}
            type="tel"
            value={phone}
            onChange={onPhoneChange}
            placeholder="+1 555 000 0000"
            autoComplete="tel"
            error={phoneError}
          />
          <SetupField
            id="setup-email"
            label={COPY.emailLabel}
            type="email"
            value={email}
            onChange={onEmailChange}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div>
          <SetupSubmitButton
            loading={loading}
            disabled={!allFilled}
            onClick={onSubmit}
            labelIdle={COPY.ctaIdle}
            labelLoading={COPY.ctaLoading}
          />
          {formError && (
            <p style={formErrorStyle}>{formError}</p>
          )}
        </div>
      </div>
    </GlassCard>
  )
}
