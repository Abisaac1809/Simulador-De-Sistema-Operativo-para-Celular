import ICallService, { CallHistoryItem } from '../interfaces/ICallService'
import ICallRepository from '../interfaces/ICallRepository'
import IUserRepository from '../interfaces/IUserRepository'
import Call, { CallStatus } from '../entities/Call'
import { CalleeNotFoundError } from '../errors/BusinessError'

export default class CallService implements ICallService {
  constructor(
    private readonly callRepository: ICallRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async initiateCall(callerId: string, calleeId: string): Promise<Call> {
    const callee = await this.userRepository.findById(calleeId)
    if (!callee) throw new CalleeNotFoundError(calleeId)
    return this.callRepository.create({ fromId: callerId, toId: calleeId })
  }

  async answerCall(callId: string): Promise<Call> {
    return this.callRepository.updateStatus(callId, CallStatus.ANSWERED)
  }

  async rejectCall(callId: string): Promise<Call> {
    return this.callRepository.updateStatus(callId, CallStatus.REJECTED, 0)
  }

  async endCall(callId: string, duration: number): Promise<Call> {
    return this.callRepository.updateStatus(callId, CallStatus.ENDED, duration)
  }

  async markMissed(callId: string): Promise<Call> {
    return this.callRepository.updateStatus(callId, CallStatus.MISSED)
  }

  async getCallHistory(userId: string): Promise<CallHistoryItem[]> {
    const calls = await this.callRepository.findAllForUser(userId)
    return calls.map(call => {
      const isOutgoing = call.fromId === userId
      const peer = isOutgoing ? call.toUser : call.fromUser
      return {
        id: call.id,
        status: call.status,
        duration: call.duration,
        startedAt: call.startedAt.toISOString(),
        peer: { id: peer.id, name: peer.name, phone: peer.phone },
      }
    })
  }
}
