import { useState } from 'react'
import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { Typography } from '../design'
import { colors, spacing } from '../design/tokens'
import { fadeIn } from '../design/animations'
import { useOSStore } from '../kernel/store'
import { socket, SERVER_BASE_URL } from '../lib/socket'
import SetupForm from './molecules/SetupForm'

// ── Constants ─────────────────────────────────────────────────────────────────

const REGISTER_PATH = '/auth/register'
const COPY_PHONE_CONFLICT = 'Este número ya está registrado en otro dispositivo'
const COPY_NETWORK_ERROR = 'No se pudo conectar con el servidor. Intenta de nuevo.'
const COPY_GENERIC_ERROR = 'Algo salió mal. Intenta de nuevo.'
const MAX_WIDTH_PX = 320

// ── Styles ────────────────────────────────────────────────────────────────────

const screenStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: colors.bgGradient,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  padding: spacing[6],
}

const contentStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: MAX_WIDTH_PX,
}

const titleBlockStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: spacing[2],
  marginBottom: spacing[6],
  textAlign: 'center',
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SetupScreen() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [phoneError, setPhoneError] = useState<string | undefined>(undefined)
  const [formError, setFormError] = useState<string | undefined>(undefined)

  const handleSubmit = async () => {
    setLoading(true)
    setPhoneError(undefined)
    setFormError(undefined)
    try {
      const res = await fetch(`${SERVER_BASE_URL}${REGISTER_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, phone, email }),
      })
      if (res.status === 409) {
        setPhoneError(COPY_PHONE_CONFLICT)
        return
      }
      if (!res.ok) {
        setFormError(COPY_GENERIC_ERROR)
        return
      }
      const data = await res.json() as { userId: string }
      useOSStore.getState().setCurrentUser(data.userId)
      socket.connect()
    } catch {
      setFormError(COPY_NETWORK_ERROR)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={screenStyle}>
      {/* Ambient blobs matching LockScreen style */}
      <div
        className="ambient-blob"
        style={{
          width: 300,
          height: 300,
          background: colors.accent,
          top: -80,
          right: -60,
          // @ts-expect-error CSS custom property
          '--blob-duration': '22s',
          '--blob-tx': '20px',
          '--blob-ty': '15px',
        }}
      />
      <div
        className="ambient-blob"
        style={{
          width: 220,
          height: 220,
          background: colors.accentPurple,
          bottom: 120,
          left: -50,
          // @ts-expect-error CSS custom property
          '--blob-duration': '28s',
          '--blob-tx': '-15px',
          '--blob-ty': '20px',
        }}
      />

      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        exit="exit"
        style={contentStyle}
      >
        <div style={titleBlockStyle}>
          <Typography variant="title">Welcome to NOVA OS</Typography>
          <Typography variant="label">Create your account to continue</Typography>
        </div>

        <SetupForm
          name={name}
          phone={phone}
          email={email}
          phoneError={phoneError}
          onNameChange={setName}
          onPhoneChange={setPhone}
          onEmailChange={setEmail}
          loading={loading}
          formError={formError}
          onSubmit={handleSubmit}
        />
      </motion.div>
    </div>
  )
}
