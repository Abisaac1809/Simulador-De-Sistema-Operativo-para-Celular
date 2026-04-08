import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { colors, font, animation } from '../../../design'

// ── Constants ─────────────────────────────────────────────

const BUTTON_SIZE = 72

const transitionOut = { duration: animation.duration.normal, ease: animation.ease.out }
const transitionIn  = { duration: animation.duration.fast,   ease: animation.ease.in  }

const menuItemVariant: Variants = {
  hidden:  { opacity: 0, scale: 0.6, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.04, ...transitionOut },
  }),
  exit: { opacity: 0, scale: 0.7, y: 4, transition: transitionIn },
}

const BUTTON_BASE_STYLE: CSSProperties = {
  width:          BUTTON_SIZE,
  height:         BUTTON_SIZE,
  borderRadius:   20, // slightly squircle inside
  display:        'flex',
  flexDirection:  'column',
  alignItems:     'center',
  justifyContent: 'center',
  gap:            6,
  border:         'none',
  outline:        'none',
  padding:        0,
  fontFamily:     font.sans,
}



// ── Component ─────────────────────────────────────────────

interface MenuActionProps {
  icon: string
  label: string
  disabled: boolean
  isDanger: boolean
  onPress: () => void
  index: number
}

/**
 * MenuAction — ATOM
 *
 * Single stagger-animated action button inside the AssistiveTouch menu.
 * Transparent background to blend into the frosted glass popup layout.
 */
export default function MenuAction({
  icon,
  label,
  disabled,
  isDanger,
  onPress,
  index,
}: MenuActionProps) {
  const background = isDanger ? 'rgba(255, 80, 80, 0.15)' : 'rgba(30, 30, 32, 0.75)'
  const filter = isDanger ? ' drop-shadow(0 0 4px rgba(255, 80, 80, 0.5))' : 'none'
  const textClr = isDanger ? colors.danger : 'rgba(255, 255, 255, 0.95)'

  const buttonStyle: CSSProperties = {
    ...BUTTON_BASE_STYLE,
    background,
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
    opacity:  disabled ? 0.35 : 1,
    cursor:   disabled ? 'not-allowed' : 'pointer',
    filter,
  }

  const labelStyle: CSSProperties = {
    fontSize:   11,
    color:      textClr,
    fontFamily: font.sans,
    fontWeight: font.weight.medium,
    userSelect: 'none',
    lineHeight: 1,
  }

  return (
    <motion.button
      variants={menuItemVariant}
      custom={index}
      whileTap={!disabled ? { scale: 0.88, backgroundColor: 'rgba(255, 255, 255, 0.15)' } : undefined}
      style={buttonStyle}
      onClick={() => { if (!disabled) onPress() }}
    >
      <i className={icon} style={{ fontSize: 24, color: textClr, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 28 }} />
      <span style={labelStyle}>{label}</span>
    </motion.button>
  )
}
