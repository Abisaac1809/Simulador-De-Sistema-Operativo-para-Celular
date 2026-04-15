export interface BackendMessage {
  id: string
  fromId: string
  toId: string
  body: string
  createdAt: string // ISO
}

export interface BackendConversationSummary {
  peerId: string
  peerName: string
  peerPhone: string
  lastMessage: BackendMessage
}
