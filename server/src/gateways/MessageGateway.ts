import { Server, Socket } from 'socket.io'
import { parse as parseCookie } from 'cookie'
import IMessageService from '../interfaces/IMessageService'
import PrismaUserRepository from '../repositories/UserRepository'
import { SendMessageSchema } from '../schemas/Message.schemas'

const userRepository = new PrismaUserRepository()

export default class MessageGateway { 
  constructor(
    private readonly io: Server,
    private readonly messageService: IMessageService
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

    socket.on('send-message', async (payload: unknown) => {
      const parsed = SendMessageSchema.safeParse(payload)
      if (!parsed.success) {
        socket.emit('message-error', { message: 'Invalid payload' })
        return
      }
      try {
        // SECURITY: fromId ALWAYS from server-side socket.data, never from client payload (T-25-06)
        const message = await this.messageService.sendMessage(
          userId,
          parsed.data.toId,
          parsed.data.body
        )
        // Emit to BOTH rooms (Pitfall 4 — sender must see their own echo)
        this.io.to(parsed.data.toId).emit('new-message', message)
        this.io.to(userId).emit('new-message', message)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to send message'
        socket.emit('message-error', { message: msg })
      }
    })
  }
}
