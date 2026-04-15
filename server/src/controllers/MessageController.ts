import { Request, Response, NextFunction } from 'express'
import IMessageService from '../interfaces/IMessageService'

export default class MessageController {
  constructor(private readonly messageService: IMessageService) {}

  getConversations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!
      const conversations = await this.messageService.getConversations(userId)
      res.status(200).json(conversations)
    } catch (err) { next(err) }
  }

  getThread = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!
      const peerId = req.params.userId as string
      const thread = await this.messageService.getThread(userId, peerId)
      res.status(200).json(thread)
    } catch (err) { next(err) }
  }
}
