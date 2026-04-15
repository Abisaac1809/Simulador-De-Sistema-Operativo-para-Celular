export default class Message {
  id: string
  fromId: string
  toId: string
  body: string
  createdAt: Date

  constructor(data: { id: string; fromId: string; toId: string; body: string; createdAt: Date }) {
    this.id = data.id
    this.fromId = data.fromId
    this.toId = data.toId
    this.body = data.body
    this.createdAt = data.createdAt
  }
}
