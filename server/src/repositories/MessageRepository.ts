import IMessageRepository from '../interfaces/IMessageRepository'
import Message from '../entities/Message'
import { prisma } from '../prisma'

export default class PrismaMessageRepository implements IMessageRepository {
  private toEntity(raw: { id: string; fromId: string; toId: string; body: string; createdAt: Date }): Message {
    return new Message(raw)
  }

  async create(data: { fromId: string; toId: string; body: string }): Promise<Message> {
    const raw = await prisma.message.create({ data })
    return this.toEntity(raw)
  }

  async findThread(userAId: string, userBId: string): Promise<Message[]> {
    const raws = await prisma.message.findMany({
      where: {
        OR: [
          { fromId: userAId, toId: userBId },
          { fromId: userBId, toId: userAId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    })
    return raws.map(r => this.toEntity(r))
  }

  async findAllForUser(userId: string): Promise<Message[]> {
    const raws = await prisma.message.findMany({
      where: { OR: [{ fromId: userId }, { toId: userId }] },
      orderBy: { createdAt: 'desc' },
    })
    return raws.map(r => this.toEntity(r))
  }
}
