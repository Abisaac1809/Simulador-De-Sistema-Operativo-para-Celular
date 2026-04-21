import { useState, useRef, useCallback } from 'react'
import { files } from '../../../kernel/storage'
import { kernelBus } from '../../../kernel/events'

export interface UseRecorderReturn {
  isRecording: boolean
  elapsedMs: number
  toggleRecording: (stream: MediaStream | null) => void
}

export function useRecorder(): UseRecorderReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)

  const stopTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setElapsedMs(0)
  }, [])

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now()
    intervalRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current)
    }, 100)
  }, [])

  const startRecording = useCallback(
    (stream: MediaStream) => {
      chunksRef.current = []

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/webm')
          ? 'video/webm'
          : ''

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      recorderRef.current = recorder

      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      recorder.onstop = async () => {
        const resolvedMime = recorder.mimeType || 'video/webm'
        const blob = new Blob(chunksRef.current, { type: resolvedMime })
        const name = `video-${Date.now()}.webm`
        try {
          await files.put({
            path: name,
            name,
            mimeType: resolvedMime,
            blob,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            type: 'video',
          })
          kernelBus.emit('files:changed', { action: 'put', path: name, kind: 'video' })
        } catch (err) {
          console.error('[camera] failed to save video', err)
        }
        chunksRef.current = []
      }

      recorder.start(250)
      startTimer()
      setIsRecording(true)
    },
    [startTimer],
  )

  const stopRecording = useCallback(() => {
    recorderRef.current?.stop()
    recorderRef.current = null
    stopTimer()
    setIsRecording(false)
  }, [stopTimer])

  const toggleRecording = useCallback(
    (stream: MediaStream | null) => {
      if (!stream) return
      if (isRecording) {
        stopRecording()
      } else {
        startRecording(stream)
      }
    },
    [isRecording, startRecording, stopRecording],
  )

  return { isRecording, elapsedMs, toggleRecording }
}
