import { z } from 'zod'

export const InitiateCallSchema = z.object({ toId: z.string().uuid() })
export const CallAnswerSchema   = z.object({ toId: z.string().uuid() })
export const CallRejectSchema   = z.object({ toId: z.string().uuid() })
export const CallEndedSchema    = z.object({ toId: z.string().uuid(), duration: z.number().int().min(0) })
export const WebRTCOfferSchema  = z.object({ toId: z.string().uuid(), sdp: z.record(z.unknown()) })
export const WebRTCAnswerSchema = z.object({ toId: z.string().uuid(), sdp: z.record(z.unknown()) })
export const WebRTCIceSchema    = z.object({ toId: z.string().uuid(), candidate: z.record(z.unknown()) })
