import { colors } from './tokens'

/**
 * Spinner — Atom
 *
 * Centered full-screen loading indicator used as Suspense fallback
 * while a lazy app component is being loaded.
 */
export default function Spinner() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.bg,
      }}
    >
      <span className="app-spinner" />
    </div>
  )
}
