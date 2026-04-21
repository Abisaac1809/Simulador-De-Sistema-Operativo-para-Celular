import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { colors, radius, spacing } from '../../../design'
import DialKey from '../atoms/DialKey'

interface Props {
  onDigit: (d: string) => void
  onBackspace: () => void
  onCall: () => void
  canCall: boolean
}

const KEYS = [
  { d: '1', s: '' },      { d: '2', s: 'ABC' },  { d: '3', s: 'DEF' },
  { d: '4', s: 'GHI' },   { d: '5', s: 'JKL' },  { d: '6', s: 'MNO' },
  { d: '7', s: 'PQRS' },  { d: '8', s: 'TUV' },  { d: '9', s: 'WXYZ' },
  { d: '*', s: '' },      { d: '0', s: '+' },    { d: '#', s: '' },
] as const

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[3],
  paddingInline: spacing[4],
}

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 64px)',
  gap: spacing[3],
  justifyContent: 'center',
}

const actionRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 64px)',
  gap: spacing[3],
  justifyContent: 'center',
  alignItems: 'center',
}

const callBtnStyle = (canCall: boolean): CSSProperties => ({
  width: 64,
  height: 64,
  borderRadius: radius.pill,
  background: colors.accent,
  opacity: canCall ? 1 : 0.35,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: canCall ? 'pointer' : 'not-allowed',
  border: 'none',
  color: '#fff',
  fontSize: 22,
})

const backspaceBtnStyle: CSSProperties = {
  width: 64,
  height: 64,
  borderRadius: radius.pill,
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  border: 'none',
  color: colors.textPrimary,
  fontSize: 22,
}

export default function Numpad({ onDigit, onBackspace, onCall, canCall }: Props) {
  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        {KEYS.map(({ d, s }) => (
          <DialKey key={d} digit={d} subLabel={s || undefined} onPress={onDigit} />
        ))}
      </div>
      <div style={actionRowStyle}>
        {/* left spacer */}
        <div />
        {/* Call button */}
        <motion.button
          style={callBtnStyle(canCall)}
          aria-label="Llamar"
          onClick={canCall ? onCall : undefined}
          whileTap={canCall ? { scale: 0.92 } : {}}
        >
          <i className="fi fi-rr-phone-call" />
        </motion.button>
        {/* Backspace button */}
        <motion.button
          style={backspaceBtnStyle}
          aria-label="Borrar"
          onClick={onBackspace}
          whileTap={{ scale: 0.92 }}
        >
          <i className="fi fi-rr-delete" />
        </motion.button>
      </div>
    </div>
  )
}
