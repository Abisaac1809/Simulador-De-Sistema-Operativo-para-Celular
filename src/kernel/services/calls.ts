import { socket } from '../../lib/socket'
import { useOSStore } from '../store'
import { kernelBus } from '../events'

const DAEMON_NAME = 'calls'
const DAEMON_RAM_MB = 20
const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }]

let running = false
let pc: RTCPeerConnection | null = null
let localStream: MediaStream | null = null
let remoteAudio: HTMLAudioElement | null = null
let peerId: string | null = null
let pendingCandidates: RTCIceCandidateInit[] = []
let remoteDescriptionSet = false

function resetWebRTCState(): void {
  pendingCandidates = []
  remoteDescriptionSet = false
  peerId = null
}

function cleanupWebRTC(): void {
  if (localStream) {
    localStream.getTracks().forEach(t => t.stop())
    localStream = null
  }
  if (pc) {
    pc.onicecandidate = null
    pc.ontrack = null
    pc.onconnectionstatechange = null
    pc.close()
    pc = null
  }
  if (remoteAudio) {
    remoteAudio.srcObject = null
    remoteAudio = null
  }
  resetWebRTCState()
}

function createPeerConnection(targetPeerId: string): RTCPeerConnection {
  peerId = targetPeerId
  const newPc = new RTCPeerConnection({ iceServers: ICE_SERVERS })

  newPc.onicecandidate = (ev) => {
    if (ev.candidate && peerId) {
      socket.emit('webrtc-ice-candidate', {
        toId: peerId,
        candidate: ev.candidate.toJSON(),
      })
    }
  }

  newPc.ontrack = (ev) => {
    remoteAudio = new Audio()
    remoteAudio.srcObject = ev.streams[0]
    remoteAudio.play().catch(() => { /* autoplay blocked — ignore */ })
  }

  newPc.onconnectionstatechange = () => {
    if (!newPc) return
    if (newPc.connectionState === 'connected') {
      useOSStore.getState().setActiveCallConnected(Date.now())
    }
    if (newPc.connectionState === 'failed' || newPc.connectionState === 'disconnected') {
      hangUp()
    }
  }

  return newPc
}

async function drainPendingCandidates(): Promise<void> {
  remoteDescriptionSet = true
  for (const c of pendingCandidates) {
    try { await pc?.addIceCandidate(new RTCIceCandidate(c)) } catch { /* ignore malformed */ }
  }
  pendingCandidates = []
}

// ── Event handlers (named module-scope refs so socket.off works) ──

function onCallRinging(payload: { callId: string; fromId: string; callerName: string }) {
  useOSStore.getState().setIncomingCall(payload)
}

function onCallInitiated(_payload: { callId: string }) {
  // At this point we called initiate-call with some toId. The caller knows peerId via app UI,
  // so activeCall was already set by startCall(). This handler confirms status='calling' is set.
  // If activeCall is not set yet, no-op here.
  const s = useOSStore.getState()
  if (!s.activeCall) return
  // noop: UI already set status='calling' via startCall. Kept for completeness.
}

async function onCallAnswered(payload: { fromId: string; callId: string }) {
  // Caller path: callee accepted. Create PC, get mic, send offer.
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    pc = createPeerConnection(payload.fromId)
    localStream.getTracks().forEach(t => pc!.addTrack(t, localStream!))
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    socket.emit('webrtc-offer', { toId: payload.fromId, sdp: offer })
  } catch (err) {
    kernelBus.emit('notification:push', {
      id: crypto.randomUUID(),
      appId: 'phone',
      title: 'Call failed',
      body: err instanceof Error ? err.message : 'Microphone unavailable',
      timestamp: Date.now(),
      read: false,
    })
    hangUp()
  }
}

function onCallRejected(_payload: { fromId: string }) {
  useOSStore.getState().clearActiveCall()
  cleanupWebRTC()
  kernelBus.emit('notification:push', {
    id: crypto.randomUUID(),
    appId: 'phone',
    title: 'Call declined',
    body: 'The other party declined your call.',
    timestamp: Date.now(),
    read: false,
  })
}

function onCallEnded(_payload: { fromId: string; duration: number }) {
  useOSStore.getState().clearActiveCall()
  useOSStore.getState().clearIncomingCall()
  cleanupWebRTC()
}

function onCallMissed(_payload: { fromId: string }) {
  useOSStore.getState().clearActiveCall()
  cleanupWebRTC()
  kernelBus.emit('notification:push', {
    id: crypto.randomUUID(),
    appId: 'phone',
    title: 'Missed call',
    body: 'The other party did not answer.',
    timestamp: Date.now(),
    read: false,
  })
}

function onCallError(payload: { message: string }) {
  useOSStore.getState().clearActiveCall()
  useOSStore.getState().clearIncomingCall()
  cleanupWebRTC()
  kernelBus.emit('notification:push', {
    id: crypto.randomUUID(),
    appId: 'phone',
    title: 'Call error',
    body: payload.message,
    timestamp: Date.now(),
    read: false,
  })
}

async function onWebRTCOffer(payload: { fromId: string; sdp: RTCSessionDescriptionInit }) {
  // Callee path: receive offer after user tapped Answer.
  try {
    if (!localStream) {
      localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    }
    if (!pc) pc = createPeerConnection(payload.fromId)
    localStream.getTracks().forEach(t => pc!.addTrack(t, localStream!))
    await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp))
    await drainPendingCandidates()
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    socket.emit('webrtc-answer', { toId: payload.fromId, sdp: answer })
  } catch (err) {
    kernelBus.emit('notification:push', {
      id: crypto.randomUUID(),
      appId: 'phone',
      title: 'Call failed',
      body: err instanceof Error ? err.message : 'Microphone unavailable',
      timestamp: Date.now(),
      read: false,
    })
    hangUp()
  }
}

async function onWebRTCAnswer(payload: { fromId: string; sdp: RTCSessionDescriptionInit }) {
  if (!pc) return
  await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp))
  await drainPendingCandidates()
}

async function onWebRTCIceCandidate(payload: { fromId: string; candidate: RTCIceCandidateInit }) {
  if (remoteDescriptionSet && pc) {
    try { await pc.addIceCandidate(new RTCIceCandidate(payload.candidate)) } catch { /* ignore */ }
  } else {
    pendingCandidates.push(payload.candidate)
  }
}

// ── Public API (invoked by UI layer via kernelBus or direct import) ──

export async function startCall(peerUserId: string, peerName: string): Promise<void> {
  if (!socket.connected) socket.connect()
  useOSStore.getState().setActiveCall({
    callId: 'pending',
    peerId: peerUserId,
    peerName,
    status: 'calling',
  })
  socket.emit('initiate-call', { toId: peerUserId })
}

export async function answerCall(): Promise<void> {
  const s = useOSStore.getState()
  const incoming = s.incomingCall
  if (!incoming) return
  peerId = incoming.fromId
  s.setActiveCall({
    callId: incoming.callId,
    peerId: incoming.fromId,
    peerName: incoming.callerName,
    status: 'calling',
  })
  s.clearIncomingCall()
  socket.emit('call-answered', { toId: incoming.fromId })
  // getUserMedia is acquired when webrtc-offer arrives (onWebRTCOffer).
}

export function rejectCall(): void {
  const s = useOSStore.getState()
  const incoming = s.incomingCall
  if (!incoming) return
  socket.emit('call-rejected', { toId: incoming.fromId })
  s.clearIncomingCall()
}

export function hangUp(): void {
  const s = useOSStore.getState()
  const active = s.activeCall
  if (active && peerId) {
    const duration = active.startedAt ? Math.floor((Date.now() - active.startedAt) / 1000) : 0
    socket.emit('call-ended', { toId: peerId, duration })
  }
  cleanupWebRTC()
  s.clearActiveCall()
}

export function toggleMute(): void {
  useOSStore.getState().toggleCallMute()
  const muted = useOSStore.getState().activeCall?.isMuted ?? false
  localStream?.getAudioTracks().forEach(t => { t.enabled = !muted })
}

export function start(): void {
  if (running) return
  running = true
  useOSStore.getState().registerDaemon(DAEMON_NAME, DAEMON_RAM_MB)
  if (!socket.connected) socket.connect()
  socket.on('call-ringing', onCallRinging)
  socket.on('call-initiated', onCallInitiated)
  socket.on('call-answered', onCallAnswered)
  socket.on('call-rejected', onCallRejected)
  socket.on('call-ended', onCallEnded)
  socket.on('call-missed', onCallMissed)
  socket.on('call-error', onCallError)
  socket.on('webrtc-offer', onWebRTCOffer)
  socket.on('webrtc-answer', onWebRTCAnswer)
  socket.on('webrtc-ice-candidate', onWebRTCIceCandidate)
}

export function stop(): void {
  if (!running) return
  running = false
  socket.off('call-ringing', onCallRinging)
  socket.off('call-initiated', onCallInitiated)
  socket.off('call-answered', onCallAnswered)
  socket.off('call-rejected', onCallRejected)
  socket.off('call-ended', onCallEnded)
  socket.off('call-missed', onCallMissed)
  socket.off('call-error', onCallError)
  socket.off('webrtc-offer', onWebRTCOffer)
  socket.off('webrtc-answer', onWebRTCAnswer)
  socket.off('webrtc-ice-candidate', onWebRTCIceCandidate)
  cleanupWebRTC()
  useOSStore.getState().unregisterDaemon(DAEMON_NAME)
}
