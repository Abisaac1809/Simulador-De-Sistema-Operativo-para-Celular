import IMessageService, { ConversationSummary } from '../interfaces/IMessageService'
import IMessageRepository from '../interfaces/IMessageRepository'
import IUserRepository from '../interfaces/IUserRepository'
import Message from '../entities/Message'
import { RecipientNotFoundError } from '../errors/BusinessError'

export default class MessageService implements IMessageService {
  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async sendMessage(fromId: string, toId: string, body: string): Promise<Message> {
    const recipient = await this.userRepository.findById(toId)
    if (!recipient) throw new RecipientNotFoundError(toId)
    return this.messageRepository.create({ fromId, toId, body })
  }

  async getThread(userAId: string, userBId: string): Promise<Message[]> {
    return this.messageRepository.findThread(userAId, userBId)
  }

  async getConversations(userId: string): Promise<ConversationSummary[]> {
    const all = await this.messageRepository.findAllForUser(userId)
    // Group by peer — service-layer dedup per RESEARCH Pitfall 7
    const byPeer = new Map<string, Message>()
    for (const msg of all) {
      const peerId = msg.fromId === userId ? msg.toId : msg.fromId
      if (!byPeer.has(peerId)) byPeer.set(peerId, msg) // all is desc by createdAt -> first is latest
    }
    const summaries: ConversationSummary[] = []
    for (const [peerId, lastMessage] of byPeer.entries()) {
      const peer = await this.userRepository.findById(peerId)
      if (!peer) continue
      summaries.push({
        peerId,
        peerName: peer.name,
        peerPhone: peer.phone,
        lastMessage,
      })
    }
    return summaries
  }
}
