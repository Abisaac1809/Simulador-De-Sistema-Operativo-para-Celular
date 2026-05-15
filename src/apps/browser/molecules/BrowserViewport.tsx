import type { CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { colors, font, fadeIn } from '../../../design'

interface BrowserViewportProps {
  src: string
  isLoading: boolean
  onLoad: () => void
  iframeRef: React.RefObject<HTMLIFrameElement | null>
}

const WRAPPER_STYLE: CSSProperties = {
  flex: 1,
  position: 'relative',
  overflow: 'hidden',
  background: '#fff',
}

const IFRAME_STYLE: CSSProperties = {
  width: '100%',
  height: '100%',
  border: 'none',
  display: 'block',
}

const LOADING_OVERLAY_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 16,
  background: colors.bg,
  zIndex: 10,
}

const PROGRESS_TRACK_STYLE: CSSProperties = {
  width: 160,
  height: 3,
  borderRadius: 100,
  background: 'rgba(255,255,255,0.08)',
  overflow: 'hidden',
}

const PROGRESS_BAR_STYLE: CSSProperties = {
  height: '100%',
  borderRadius: 100,
  background: 'linear-gradient(90deg, #5E6AD2 0%, #A060FF 100%)',
}

export default function BrowserViewport({ src, isLoading, onLoad, iframeRef }: BrowserViewportProps) {
  return (
    <div style={WRAPPER_STYLE}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            style={LOADING_OVERLAY_STYLE}
          >
            <i
              className="fi fi-rr-globe"
              style={{ fontSize: 32, color: colors.accent }}
            />
            <div style={PROGRESS_TRACK_STYLE}>
              <motion.div
                style={PROGRESS_BAR_STYLE}
                initial={{ width: '0%' }}
                animate={{ width: '85%' }}
                transition={{ duration: 1.8, ease: 'easeOut' }}
              />
            </div>
            <span
              style={{
                fontFamily: font.sans,
                fontSize: 12,
                color: colors.textMuted,
                fontWeight: font.weight.regular,
              }}
            >
              Cargando…
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <iframe
        ref={iframeRef}
        src={src}
        style={IFRAME_STYLE}
        onLoad={onLoad}
        title="Navegador NOVA OS"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation-by-user-activation"
      />
    </div>
  )
}
