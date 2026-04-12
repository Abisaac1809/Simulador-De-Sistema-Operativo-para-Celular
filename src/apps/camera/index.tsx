import type { CSSProperties } from 'react'
import { useState } from 'react'
import { useCamera } from './hooks/useCamera'
import { useCapture } from './hooks/useCapture'
import { useRecorder } from './hooks/useRecorder'
import { useFlash } from './hooks/useFlash'
import ViewFinder from './molecules/ViewFinder'
import ControlRow from './molecules/ControlRow'
import ModeNavBar from './molecules/ModeNavBar'
import type { CameraMode } from './molecules/ModeNavBar'
import FlashOverlay from './atoms/FlashOverlay'
import RecordingIndicator from './atoms/RecordingIndicator'
import CameraErrorState from './atoms/CameraErrorState'
import { spacing } from '../../design'

const ROOT_STYLE: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  background: '#000',
}

const BOTTOM_HUD_STYLE: CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: spacing[5],
  paddingBottom: spacing[8],
  paddingTop: spacing[5],
  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
}

const RECORDING_INDICATOR_WRAPPER: CSSProperties = {
  position: 'absolute',
  top: spacing[4],
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10,
}

export default function CameraApp() {
  const [mode, setMode] = useState<CameraMode>('photo')

  const { videoRef, facingMode, error, isReady, flipCamera, retryCamera } = useCamera()
  const { flashMode, cycleFlash, fireFlash, overlayRef } = useFlash()
  const { capturePhoto } = useCapture({ videoRef, fireFlash })
  const { isRecording, elapsedMs, toggleRecording } = useRecorder()

  const getStream = (): MediaStream | null => {
    const video = videoRef.current
    if (!video || !video.srcObject) return null
    return video.srcObject as MediaStream
  }

  const handleShutter = () => {
    if (mode === 'photo') {
      void capturePhoto()
    } else {
      if (!isRecording) fireFlash()
      toggleRecording(getStream())
    }
  }

  const handleModeChange = (next: CameraMode) => {
    if (mode === 'video' && isRecording) {
      toggleRecording(getStream())
    }
    setMode(next)
  }

  return (
    <div style={ROOT_STYLE}>
      <FlashOverlay ref={overlayRef} />

      {error ? (
        <CameraErrorState error={error} onRetry={retryCamera} />
      ) : (
        <>
          <ViewFinder videoRef={videoRef} facingMode={facingMode} />

          {isRecording && (
            <div style={RECORDING_INDICATOR_WRAPPER}>
              <RecordingIndicator elapsedMs={elapsedMs} />
            </div>
          )}

          {isReady && (
            <div style={BOTTOM_HUD_STYLE}>
              <ModeNavBar mode={mode} onChange={handleModeChange} />
              <ControlRow
                mode={mode}
                isRecording={isRecording}
                flashMode={flashMode}
                onShutter={handleShutter}
                onFlip={flipCamera}
                onCycleFlash={cycleFlash}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
