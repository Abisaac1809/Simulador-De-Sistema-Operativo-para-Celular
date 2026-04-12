import type { CSSProperties } from 'react'

interface ViewFinderProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  facingMode: 'user' | 'environment'
}

const WRAPPER_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  background: '#000',
}

export default function ViewFinder({ videoRef, facingMode }: ViewFinderProps) {
  const videoStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
  }

  return (
    <div style={WRAPPER_STYLE}>
      <video
        ref={videoRef}
        style={videoStyle}
        muted
        playsInline
        autoPlay
      />
    </div>
  )
}
