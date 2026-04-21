import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { colors, fadeIn } from '../../design'
import useBrowser from './hooks/useBrowser'
import AddressBar from './atoms/AddressBar'
import BrowserViewport from './molecules/BrowserViewport'

const ROOT_STYLE: CSSProperties = {
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: colors.bg,
}

export default function BrowserApp() {
  const controls = useBrowser()

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      style={ROOT_STYLE}
    >
      <AddressBar controls={controls} />
      <BrowserViewport
        src={controls.currentUrl}
        isLoading={controls.isLoading}
        onLoad={controls.onIframeLoad}
        iframeRef={controls.iframeRef}
      />
    </motion.div>
  )
}

