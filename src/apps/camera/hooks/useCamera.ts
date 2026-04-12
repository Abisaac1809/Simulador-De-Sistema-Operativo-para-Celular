import { useState, useEffect, useRef, useCallback } from 'react'
import type { CameraError } from '../atoms/CameraErrorState'

export type FacingMode = 'user' | 'environment'

export interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>
  facingMode: FacingMode
  error: CameraError | null
  isReady: boolean
  flipCamera: () => void
  retryCamera: () => void
}

function mapError(err: unknown): CameraError {
  if (err instanceof DOMException) {
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') return 'denied'
    if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') return 'notfound'
    if (err.name === 'NotReadableError' || err.name === 'TrackStartError') return 'inuse'
  }
  return 'unknown'
}

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mountedRef = useRef(true)

  const [facingMode, setFacingMode] = useState<FacingMode>('environment')
  const [error, setError] = useState<CameraError | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [retryToken, setRetryToken] = useState(0)

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsReady(false)
  }, [])

  useEffect(() => {
    mountedRef.current = true

    async function startStream() {
      stopStream()
      setError(null)

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        })

        if (!mountedRef.current) {
          stream.getTracks().forEach(t => t.stop())
          return
        }

        streamRef.current = stream

        const video = videoRef.current
        if (video) {
          video.srcObject = stream
          video.muted = true
          video.playsInline = true
          await video.play()
          if (mountedRef.current) {
            setIsReady(true)
          }
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(mapError(err))
        }
      }
    }

    void startStream()

    return () => {
      mountedRef.current = false
      stopStream()
    }
  }, [facingMode, retryToken, stopStream])

  const flipCamera = useCallback(() => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'))
  }, [])

  const retryCamera = useCallback(() => {
    setError(null)
    setRetryToken(t => t + 1)
  }, [])

  return { videoRef, facingMode, error, isReady, flipCamera, retryCamera }
}
