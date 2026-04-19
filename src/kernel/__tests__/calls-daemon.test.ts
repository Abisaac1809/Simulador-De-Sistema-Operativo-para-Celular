import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// ── Hoisted mocks (must be defined before vi.mock calls) ──────────────────────
const socketHandlers = new Map<string, (...args: unknown[]) => void>()

const mockSocket = vi.hoisted(() => ({
  on: vi.fn((event: string, handler: (...args: unknown[]) => void) => {
    socketHandlers.set(event, handler)
  }),
  off: vi.fn(),
  emit: vi.fn(),
  connect: vi.fn(),
  connected: false,
}))

const mockStore = vi.hoisted(() => ({
  registerDaemon: vi.fn(),
  unregisterDaemon: vi.fn(),
  setIncomingCall: vi.fn(),
  clearIncomingCall: vi.fn(),
  setActiveCall: vi.fn(),
  setActiveCallConnected: vi.fn(),
  clearActiveCall: vi.fn(),
  toggleCallMute: vi.fn(),
  activeCall: null as { startedAt: number | null } | null,
  incomingCall: null as { callId: string; fromId: string; callerName: string } | null,
}))

const mockKernelBus = vi.hoisted(() => ({
  emit: vi.fn(),
}))

// ── Module mocks ───────────────────────────────────────────────────────────────
vi.mock('../../lib/socket', () => ({
  socket: mockSocket,
}))

vi.mock('../store', () => ({
  useOSStore: {
    getState: () => mockStore,
  },
}))

vi.mock('../events', () => ({
  kernelBus: mockKernelBus,
}))

// ── Mock RTCPeerConnection + related globals ────────────────────────────────────
const mockMediaTrack = { stop: vi.fn(), enabled: true }
const mockStream = {
  getTracks: vi.fn(() => [mockMediaTrack]),
  getAudioTracks: vi.fn(() => [mockMediaTrack]),
}

const mockPc = {
  onicecandidate: null as ((ev: { candidate: { toJSON: () => RTCIceCandidateInit } | null }) => void) | null,
  ontrack: null as ((ev: { streams: MediaStream[] }) => void) | null,
  onconnectionstatechange: null as (() => void) | null,
  connectionState: 'new' as RTCPeerConnectionState,
  addTrack: vi.fn(),
  createOffer: vi.fn().mockResolvedValue({ type: 'offer', sdp: 'sdp-offer' }),
  createAnswer: vi.fn().mockResolvedValue({ type: 'answer', sdp: 'sdp-answer' }),
  setLocalDescription: vi.fn().mockResolvedValue(undefined),
  setRemoteDescription: vi.fn().mockResolvedValue(undefined),
  addIceCandidate: vi.fn().mockResolvedValue(undefined),
  close: vi.fn(),
}

const RTCPeerConnectionMock = vi.fn(function RTCPeerConnectionMock() { return mockPc })
const RTCSessionDescriptionMock = vi.fn(function RTCSessionDescriptionMock(init: RTCSessionDescriptionInit) { return init })
const RTCIceCandidateMock = vi.fn(function RTCIceCandidateMock(init: RTCIceCandidateInit) { return init })

// Assign WebRTC globals (writable in node test env)
vi.stubGlobal('RTCPeerConnection', RTCPeerConnectionMock)
vi.stubGlobal('RTCSessionDescription', RTCSessionDescriptionMock)
vi.stubGlobal('RTCIceCandidate', RTCIceCandidateMock)
vi.stubGlobal('Audio', vi.fn(() => ({ srcObject: null, play: vi.fn().mockResolvedValue(undefined) })))
vi.stubGlobal('navigator', {
  mediaDevices: {
    getUserMedia: vi.fn().mockResolvedValue(mockStream),
  },
})

// ── Import daemon (after mocks) ────────────────────────────────────────────────
import * as callsDaemon from '../services/calls'

describe('calls daemon', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    socketHandlers.clear()
    // Re-setup the socket.on to re-populate socketHandlers
    mockSocket.on.mockImplementation((event: string, handler: (...args: unknown[]) => void) => {
      socketHandlers.set(event, handler)
    })
    // Reset mock store state
    mockStore.activeCall = null
    mockStore.incomingCall = null
    // Reset mockPc mocks
    mockPc.close.mockClear()
    mockPc.addIceCandidate.mockClear()
    mockPc.setRemoteDescription.mockClear()
    mockPc.createOffer.mockResolvedValue({ type: 'offer', sdp: 'sdp-offer' })
    mockPc.createAnswer.mockResolvedValue({ type: 'answer', sdp: 'sdp-answer' })
    mockPc.setLocalDescription.mockResolvedValue(undefined)
    mockPc.setRemoteDescription.mockResolvedValue(undefined)
    // stop the daemon if running
    try { callsDaemon.stop() } catch { /* ignore */ }
  })

  afterEach(() => {
    try { callsDaemon.stop() } catch { /* ignore */ }
  })

  it('start() is idempotent — calling twice registers daemon only once', () => {
    callsDaemon.start()
    callsDaemon.start()
    expect(mockStore.registerDaemon).toHaveBeenCalledTimes(1)
    expect(mockStore.registerDaemon).toHaveBeenCalledWith('calls', 20)
  })

  it('start() registers 10 socket listeners', () => {
    callsDaemon.start()
    const expectedEvents = [
      'call-ringing', 'call-initiated', 'call-answered', 'call-rejected',
      'call-ended', 'call-missed', 'call-error',
      'webrtc-offer', 'webrtc-answer', 'webrtc-ice-candidate',
    ]
    for (const event of expectedEvents) {
      expect(mockSocket.on).toHaveBeenCalledWith(event, expect.any(Function))
    }
    expect(mockSocket.on).toHaveBeenCalledTimes(10)
  })

  it('stop() unregisters all 10 socket listeners', () => {
    callsDaemon.start()
    const registeredHandlers = new Map<string, unknown>()
    for (const call of mockSocket.on.mock.calls) {
      registeredHandlers.set(call[0] as string, call[1])
    }
    callsDaemon.stop()
    const expectedEvents = [
      'call-ringing', 'call-initiated', 'call-answered', 'call-rejected',
      'call-ended', 'call-missed', 'call-error',
      'webrtc-offer', 'webrtc-answer', 'webrtc-ice-candidate',
    ]
    for (const event of expectedEvents) {
      expect(mockSocket.off).toHaveBeenCalledWith(event, registeredHandlers.get(event))
    }
    expect(mockSocket.off).toHaveBeenCalledTimes(10)
  })

  it('receiving call-ringing calls setIncomingCall with payload', () => {
    callsDaemon.start()
    const handler = socketHandlers.get('call-ringing')
    expect(handler).toBeDefined()
    handler!({ callId: 'c', fromId: 'u', callerName: 'A' })
    expect(mockStore.setIncomingCall).toHaveBeenCalledWith({ callId: 'c', fromId: 'u', callerName: 'A' })
  })

  it('receiving call-initiated is handled without error when no activeCall', () => {
    callsDaemon.start()
    const handler = socketHandlers.get('call-initiated')
    expect(handler).toBeDefined()
    mockStore.activeCall = null
    expect(() => handler!({ callId: 'c' })).not.toThrow()
  })

  it('receiving call-error clears incomingCall and activeCall and emits notification', () => {
    callsDaemon.start()
    const handler = socketHandlers.get('call-error')
    expect(handler).toBeDefined()
    handler!({ message: 'Callee is offline' })
    expect(mockStore.clearActiveCall).toHaveBeenCalled()
    expect(mockStore.clearIncomingCall).toHaveBeenCalled()
    expect(mockKernelBus.emit).toHaveBeenCalledWith('notification:push', expect.objectContaining({
      appId: 'phone',
      title: 'Call error',
      body: 'Callee is offline',
    }))
  })

  it('early ICE candidates are buffered before setRemoteDescription and drained after', async () => {
    callsDaemon.start()
    // Receive an ICE candidate before any PC is created (no remote description set)
    const iceHandler = socketHandlers.get('webrtc-ice-candidate')
    expect(iceHandler).toBeDefined()
    await iceHandler!({ fromId: 'u1', candidate: { candidate: 'candidate1', sdpMid: '0', sdpMLineIndex: 0 } })
    // addIceCandidate should NOT have been called yet (no PC/remote description)
    expect(mockPc.addIceCandidate).not.toHaveBeenCalled()

    // Now simulate receiving a webrtc-offer which triggers setRemoteDescription and drain
    const offerHandler = socketHandlers.get('webrtc-offer')
    expect(offerHandler).toBeDefined()
    await offerHandler!({ fromId: 'u1', sdp: { type: 'offer', sdp: 'sdp' } })
    // After setRemoteDescription, buffered candidate should have been drained
    expect(mockPc.addIceCandidate).toHaveBeenCalled()
  })

  it('hangUp() stops all local tracks, closes pc, emits call-ended, and clears activeCall', async () => {
    callsDaemon.start()
    // Set up incomingCall in mock store and answer it to set peerId
    mockStore.incomingCall = { callId: 'c1', fromId: 'peer1', callerName: 'Bob' }
    await callsDaemon.answerCall()
    // Simulate a webrtc-offer to create a PC and localStream
    const offerHandler = socketHandlers.get('webrtc-offer')
    await offerHandler!({ fromId: 'peer1', sdp: { type: 'offer', sdp: 'sdp' } })
    // Set mock store active call with startedAt
    mockStore.activeCall = { startedAt: Date.now() - 5000 }

    const emitSpy = mockSocket.emit
    emitSpy.mockClear()
    mockPc.close.mockClear()
    mockMediaTrack.stop.mockClear()
    mockStore.clearActiveCall.mockClear()

    callsDaemon.hangUp()

    expect(mockMediaTrack.stop).toHaveBeenCalled()
    expect(mockPc.close).toHaveBeenCalled()
    expect(emitSpy).toHaveBeenCalledWith('call-ended', expect.objectContaining({ toId: 'peer1' }))
    expect(mockStore.clearActiveCall).toHaveBeenCalled()
  })
})
