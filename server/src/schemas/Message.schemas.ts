import { z } from 'zod'

export const SendMessageSchema = z.object({
  toId: z.string().uuid(),
  body: z.string().min(1).max(4000),
})

export type SendMessageInput = z.infer<typeof SendMessageSchema>
