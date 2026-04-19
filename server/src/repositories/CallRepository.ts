import ICallRepository, { CallWithUsers } from '../interfaces/ICallRepository'
import Call, { CallStatus } from '../entities/Call'
import { prisma } from '../prisma'

export default class PrismaCallRepository implements ICallRepository {
  private toEntity(raw: { id: string; fromId: string; toId: string; status: string; duration: number; startedAt: Date }): Call {
    return new Call({ ...raw, status: raw.status as CallStatus })
  }

  async create(data: { fromId: string; toId: string }): Promise<Call> {
    const raw = await prisma.call.create({ data })
    return this.toEntity(raw)
  }

  async updateStatus(id: string, status: CallStatus, duration?: number): Promise<Call> {
    const raw = await prisma.call.update({
      where: { id },
      data: { status, ...(duration !== undefined && { duration }) },
    })
    return this.toEntity(raw)
  }

  async findAllForUser(userId: string): Promise<CallWithUsers[]> {
    const raws = await prisma.call.findMany({
      where: { OR: [{ fromId: userId }, { toId: userId }] },
      orderBy: { startedAt: 'desc' },
      include: {
        from: { select: { id: true, name: true, phone: true } },
        to: { select: { id: true, name: true, phone: true } },
      },
    })
    return raws.map(raw => {
      const call = this.toEntity(raw) as CallWithUsers
      call.fromUser = raw.from
      call.toUser = raw.to
      return call
    })
  }
}
