import type { CallStatus } from '../entities/Call'

export interface CallType {
  id: string
  fromId: string
  toId: string
  status: CallStatus
  duration: number
  startedAt: Date
}
