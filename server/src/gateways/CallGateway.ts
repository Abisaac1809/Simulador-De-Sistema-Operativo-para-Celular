import { Server, Socket } from 'socket.io'
import { parse as parseCookie } from 'cookie'
import ICallService from '../interfaces/ICallService'
import PrismaUserRepository from '../repositories/UserRepository'
import {
  InitiateCallSchema, CallAnswerSchema, CallRejectSchema,
  CallEndedSchema, WebRTCOfferSchema, WebRTCAnswerSchema, WebRTCIceSchema,
  VideoToggleSchema,
} from '../schemas/Call.schemas'

const userRepository = new PrismaUserRepository()

const RING_TIMEOUT_MS = 30_000

type PendingCall = {
  callId: string
  callerId: string
  timer: ReturnType<typeof setTimeout>
}

export default class CallGateway {
  private pendingCalls = new Map<string, PendingCall>()
  private activeCalls = new Map<string, string>()

  constructor(
    private readonly io: Server,
    private readonly callService: ICallService
  ) {
    this.io.use(this.authHandshake)
    this.io.on('connection', this.handleConnection)
  }

  private authHandshake = async (
    socket: Socket,
    next: (err?: Error) => void
  ): Promise<void> => {
    try {
      const rawCookie = socket.handshake.headers.cookie
      if (!rawCookie) return next(new Error('Unauthorized'))
      const cookies = parseCookie(rawCookie)
      const token = cookies['access_token']
      if (!token) return next(new Error('Unauthorized'))
      const user = await userRepository.findByToken(token)
      if (!user) return next(new Error('Unauthorized'))
      socket.data.userId = user.id
      next()
    } catch {
      next(new Error('Unauthorized'))
    }
  }

  private handleConnection = (socket: Socket): void => {
    const userId: string = socket.data.userId
    socket.join(userId)

    socket.on('initiate-call', async (payload: unknown) => {
      const parsed = InitiateCallSchema.safeParse(payload)
      if (!parsed.success) {
        socket.emit('call-error', { message: 'Invalid payload' })
        return
      }
      const calleeId = parsed.data.toId
      try {
        if (this.pendingCalls.has(calleeId)) {
          socket.emit('call-error', { message: 'Callee is busy' })
          return
        }

        const calleeRooms = this.io.sockets.adapter.rooms.get(calleeId)
        if (!calleeRooms || calleeRooms.size === 0) {
          socket.emit('call-error', { message: 'Callee is offline' })
          return
        }

        const call = await this.callService.initiateCall(userId, calleeId)

        const callerUser = await userRepository.findById(userId)
        const callerName = callerUser?.name ?? 'Unknown'
        const callerPhone = callerUser?.phone ?? ''

        this.io.to(calleeId).emit('call-ringing', {
          callId: call.id,
          fromId: userId,
          callerName,
          callerPhone,
        })

        socket.emit('call-initiated', { callId: call.id })

        const timer = setTimeout(async () => {
          this.pendingCalls.delete(calleeId)
          try {
            await this.callService.markMissed(call.id)
          } catch { /* DB update failure is non-critical */ }
          this.io.to(userId).emit('call-missed', { fromId: calleeId })
        }, RING_TIMEOUT_MS)

        this.pendingCalls.set(calleeId, { callId: call.id, callerId: userId, timer })
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to initiate call'
        socket.emit('call-error', { message: msg })
      }
    })

    socket.on('call-answered', async (payload: unknown) => {
      const parsed = CallAnswerSchema.safeParse(payload)
      if (!parsed.success) {
        socket.emit('call-error', { message: 'Invalid payload' })
        return
      }
      const callerId = parsed.data.toId
      const pending = this.pendingCalls.get(userId)
      if (pending && pending.callerId === callerId) {
        clearTimeout(pending.timer)
        this.pendingCalls.delete(userId)
        this.activeCalls.set(userId, pending.callId)
        this.activeCalls.set(callerId, pending.callId)
        try {
          await this.callService.answerCall(pending.callId)
        } catch { /* non-critical */ }
        this.io.to(callerId).emit('call-answered', { fromId: userId, callId: pending.callId })
      }
    })

    socket.on('call-rejected', async (payload: unknown) => {
      const parsed = CallRejectSchema.safeParse(payload)
      if (!parsed.success) {
        socket.emit('call-error', { message: 'Invalid payload' })
        return
      }
      const callerId = parsed.data.toId
      const pending = this.pendingCalls.get(userId)
      if (pending && pending.callerId === callerId) {
        clearTimeout(pending.timer)
        this.pendingCalls.delete(userId)
        try {
          await this.callService.rejectCall(pending.callId)
        } catch { /* non-critical */ }
        this.io.to(callerId).emit('call-rejected', { fromId: userId })
      }
    })

    socket.on('call-ended', async (payload: unknown) => {
      const parsed = CallEndedSchema.safeParse(payload)
      if (!parsed.success) {
        socket.emit('call-error', { message: 'Invalid payload' })
        return
      }
      const { toId, duration } = parsed.data
      this.io.to(toId).emit('call-ended', { fromId: userId, duration })

      const callId = this.activeCalls.get(userId)
      if (callId) {
        this.activeCalls.delete(userId)
        this.activeCalls.delete(toId)
        try {
          await this.callService.endCall(callId, duration)
        } catch { /* non-critical */ }
      }
    })

    socket.on('webrtc-offer', (payload: unknown) => {
      const parsed = WebRTCOfferSchema.safeParse(payload)
      if (!parsed.success) {
        socket.emit('call-error', { message: 'Invalid WebRTC offer payload' })
        return
      }
      this.io.to(parsed.data.toId).emit('webrtc-offer', { fromId: userId, sdp: parsed.data.sdp })
    })

    socket.on('webrtc-answer', (payload: unknown) => {
      const parsed = WebRTCAnswerSchema.safeParse(payload)
      if (!parsed.success) {
        socket.emit('call-error', { message: 'Invalid WebRTC answer payload' })
        return
      }
      this.io.to(parsed.data.toId).emit('webrtc-answer', { fromId: userId, sdp: parsed.data.sdp })
    })

    socket.on('webrtc-ice-candidate', (payload: unknown) => {
      const parsed = WebRTCIceSchema.safeParse(payload)
      if (!parsed.success) {
        socket.emit('call-error', { message: 'Invalid ICE candidate payload' })
        return
      }
      this.io.to(parsed.data.toId).emit('webrtc-ice-candidate', { fromId: userId, candidate: parsed.data.candidate })
    })

    socket.on('video-toggle', (payload: unknown) => {
      const parsed = VideoToggleSchema.safeParse(payload)
      if (!parsed.success) return
      this.io.to(parsed.data.toId).emit('video-toggle', { fromId: userId, enabled: parsed.data.enabled })
    })

    socket.on('disconnect', () => {
      for (const [calleeId, pending] of this.pendingCalls) {
        if (pending.callerId === userId) {
          clearTimeout(pending.timer)
          this.pendingCalls.delete(calleeId)
          this.callService.markMissed(pending.callId).catch(() => {})
          this.io.to(calleeId).emit('call-ended', { fromId: userId, duration: 0 })
        }
      }
      const myPending = this.pendingCalls.get(userId)
      if (myPending) {
        clearTimeout(myPending.timer)
        this.pendingCalls.delete(userId)
        this.callService.markMissed(myPending.callId).catch(() => {})
        this.io.to(myPending.callerId).emit('call-missed', { fromId: userId })
      }
      const activeCallId = this.activeCalls.get(userId)
      if (activeCallId) {
        this.activeCalls.delete(userId)
        for (const [pid, cid] of this.activeCalls) {
          if (cid === activeCallId) {
            this.activeCalls.delete(pid)
            this.io.to(pid).emit('call-ended', { fromId: userId, duration: 0 })
            break
          }
        }
        this.callService.endCall(activeCallId, 0).catch(() => {})
      }
    })
  }
}
