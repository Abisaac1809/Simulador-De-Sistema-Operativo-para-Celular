import { kernelBus } from '../events'
import { useOSStore } from '../store'
import type { SoundType } from '../../types'

// frequency (Hz) and duration (ms) for each sound type
const soundDefs: Record<SoundType, { freq: number; duration: number; wave?: OscillatorType }> = {
  keypress:      { freq: 1000, duration: 30,  wave: 'sine' },
  lock:          { freq: 440,  duration: 120, wave: 'sine' },
  unlock:        { freq: 880,  duration: 100, wave: 'sine' },
  notification:  { freq: 660,  duration: 200, wave: 'triangle' },
  ringtone:      { freq: 520,  duration: 400, wave: 'square' },
  shutter:       { freq: 1200, duration: 80,  wave: 'sine' },
  'message-sent':{ freq: 750,  duration: 100, wave: 'sine' },
}

let audioCtx: AudioContext | null = null
let running = false

function getAudioContext(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

export function play(type: SoundType) {
  const { doNotDisturb, volume } = useOSStore.getState()
  if (doNotDisturb) return

  const ctx = getAudioContext()
  if (!ctx) return

  const def = soundDefs[type]
  const gain = ctx.createGain()
  gain.gain.value = volume / 100
  gain.connect(ctx.destination)

  const osc = ctx.createOscillator()
  osc.type = def.wave ?? 'sine'
  osc.frequency.value = def.freq
  osc.connect(gain)

  const now = ctx.currentTime
  osc.start(now)
  osc.stop(now + def.duration / 1000)
}

function onSound({ type }: { type: SoundType }) {
  play(type)
}

export function start() {
  if (running) return
  running = true
  useOSStore.getState().registerDaemon('sound', 15)
  kernelBus.on('system:sound', onSound)
}

export function stop() {
  if (!running) return
  running = false
  kernelBus.off('system:sound', onSound)
  if (audioCtx) {
    audioCtx.close()
    audioCtx = null
  }
  useOSStore.getState().unregisterDaemon('sound')
}
