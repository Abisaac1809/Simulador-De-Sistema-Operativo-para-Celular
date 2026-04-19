import Call, { CallStatus } from '../entities/Call'

export interface CallWithUsers extends Call {
  fromUser: { id: string; name: string; phone: string }
  toUser: { id: string; name: string; phone: string }
}

export default interface ICallRepository {
  create(data: { fromId: string; toId: string }): Promise<Call>
  updateStatus(id: string, status: CallStatus, duration?: number): Promise<Call>
  findAllForUser(userId: string): Promise<CallWithUsers[]>
}
