import Message from '../entities/Message'

export interface ConversationSummary {
  peerId: string
  peerName: string
  peerPhone: string
  lastMessage: Message
}

export default interface IMessageService {
  sendMessage(fromId: string, toId: string, body: string): Promise<Message>
  getThread(userAId: string, userBId: string): Promise<Message[]>
  getConversations(userId: string): Promise<ConversationSummary[]>
}
