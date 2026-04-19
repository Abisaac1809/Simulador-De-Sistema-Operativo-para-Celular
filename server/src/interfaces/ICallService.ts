import Call from '../entities/Call'

export interface CallHistoryItem {
  id: string
  status: string
  duration: number
  startedAt: string
  peer: { id: string; name: string; phone: string }
  direction: 'incoming' | 'outgoing' | 'missed'
}

export default interface ICallService {
  initiateCall(callerId: string, calleeId: string): Promise<Call>
  answerCall(callId: string): Promise<Call>
  rejectCall(callId: string): Promise<Call>
  endCall(callId: string, duration: number): Promise<Call>
  markMissed(callId: string): Promise<Call>
  getCallHistory(userId: string): Promise<CallHistoryItem[]>
}
