import { useCallback } from 'react'
import { files } from '../../../kernel/storage'
import { kernelBus } from '../../../kernel/events'

interface UseCaptureParams {
  videoRef: React.RefObject<HTMLVideoElement | null>
  fireFlash: () => void
}

export interface UseCaptureReturn {
  capturePhoto: () => Promise<void>
}

export function useCapture({ videoRef, fireFlash }: UseCaptureParams): UseCaptureReturn {
  const capturePhoto = useCallback(async () => {
    const video = videoRef.current
    if (!video || video.readyState < 2) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0)

    fireFlash()
    kernelBus.emit('system:sound', { type: 'shutter' })

    await new Promise<void>((resolve, reject) => {
      canvas.toBlob(
        async blob => {
          if (!blob) {
            reject(new Error('Canvas toBlob returned null'))
            return
          }
          try {
            const name = `photo-${Date.now()}.jpg`
            await files.put({
              path: name,
              name,
              mimeType: 'image/jpeg',
              blob,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              type: 'photo',
            })
            kernelBus.emit('files:changed', { action: 'put', path: name, kind: 'photo' })
            resolve()
          } catch (err) {
            console.error('[camera] failed to save photo', err)
            reject(err)
          }
        },
        'image/jpeg',
        0.9,
      )
    })
  }, [videoRef, fireFlash])

  return { capturePhoto }
}
