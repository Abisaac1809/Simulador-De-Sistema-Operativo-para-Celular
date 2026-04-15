import Message from '../entities/Message'

export default interface IMessageRepository {
  create(data: { fromId: string; toId: string; body: string }): Promise<Message>
  findThread(userAId: string, userBId: string): Promise<Message[]>
  findAllForUser(userId: string): Promise<Message[]>
}
