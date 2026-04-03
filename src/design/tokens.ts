/**
 * NOVA OS Design Tokens
 *
 * JS mirror of the CSS custom properties in index.css.
 * Use these in inline styles and component logic.
 * CSS vars (--color-*, --radius-*, etc.) should be used in stylesheets.
 * Both must stay in sync — index.css is the source of truth for the browser,
 * this file is the source of truth for TypeScript components.
 */

// ── Colors ────────────────────────────────────────────────

export const colors = {
  bg: '#050506',
  bgGradient: 'linear-gradient(180deg, #0a0a0f 0%, #020203 100%)',

  glassBg: 'rgba(255, 255, 255, 0.05)',
  glassBgElevated: 'rgba(255, 255, 255, 0.07)',
  glassBgActive: 'rgba(255, 255, 255, 0.09)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  glassBorderActive: 'rgba(255, 255, 255, 0.14)',

  textPrimary: '#EDEDEF',
  textSecondary: 'rgba(237, 237, 239, 0.55)',
  textMuted: '#8A8F98',

  accent: '#5E6AD2',
  accentGlow: 'rgba(94, 106, 210, 0.20)',
  accentBlue: '#6090FF',
  accentPurple: '#A060FF',
  accentPink: '#FF60A0',
  accentCyan: '#60D0FF',

  btnPrimaryBg: 'rgba(94, 106, 210, 0.15)',
  btnPrimaryBorder: 'rgba(94, 106, 210, 0.35)',

  danger: 'rgba(255, 80, 80, 0.85)',
} as const

/**
 * Converts a hex color to an rgba string at given opacity.
 * Used for app icon tint backgrounds.
 *
 * @example iconTintColor('#6090FF') → 'rgba(96, 144, 255, 0.16)'
 */
export function iconTintColor(hex: string, opacity = 0.16): string {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

// ── Glass ─────────────────────────────────────────────────

export const glass = {
  backdropFilter: 'blur(24px)',
  backdropFilterLight: 'blur(14px)',
  WebkitBackdropFilter: 'blur(24px)',
  WebkitBackdropFilterLight: 'blur(14px)',
} as const

// ── Border Radius ─────────────────────────────────────────

export const radius = {
  card: 20,
  button: 14,
  pill: 100,
  icon: 16,
  small: 10,
} as const

// ── Shadow ────────────────────────────────────────────────

export const shadow = {
  card: '0 2px 20px rgba(0, 0, 0, 0.55), 0 1px 0px rgba(255, 255, 255, 0.05) inset',
  button: '0 2px 10px rgba(0, 0, 0, 0.35)',
} as const

// ── Typography ────────────────────────────────────────────

export const font = {
  sans: '"Inter", -apple-system, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
  mono: '"SF Mono", "Fira Code", ui-monospace, monospace',
  weight: {
    thin: 200,
    regular: 400,
    medium: 500,
    semibold: 600,
  },
} as const

// ── Spacing (4px base scale) ──────────────────────────────

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const

// ── Animation ─────────────────────────────────────────────

export const animation = {
  duration: {
    fast: 0.15,
    normal: 0.25,
    slow: 0.40,
  },
  ease: {
    /** Spring-feel — snappy enter, smooth settle */
    out:   [0.16, 1.0, 0.30, 1.0] as [number, number, number, number],
    in:    [0.40, 0.0, 1.00, 1.0] as [number, number, number, number],
    inOut: [0.40, 0.0, 0.20, 1.0] as [number, number, number, number],
  },
} as const
