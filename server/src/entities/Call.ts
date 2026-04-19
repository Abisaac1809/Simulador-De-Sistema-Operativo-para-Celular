import type { CallType } from '../types/Call.dtos'

export enum CallStatus {
  CALLING = 'calling',
  ANSWERED = 'answered',
  REJECTED = 'rejected',
  MISSED = 'missed',
  ENDED = 'ended'
}

export default class Call {
  id: string
  fromId: string
  toId: string
  status: CallStatus
  duration: number
  startedAt: Date

  constructor(data: CallType) {
    this.id = data.id
    this.fromId = data.fromId
    this.toId = data.toId
    this.status = data.status
    this.duration = data.duration
    this.startedAt = data.startedAt
  }
}
