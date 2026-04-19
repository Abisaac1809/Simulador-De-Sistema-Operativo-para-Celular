import { Request, Response, NextFunction } from 'express'
import ICallService from '../interfaces/ICallService'

export default class CallController {
  constructor(private readonly callService: ICallService) {}

  getCallHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!
      const history = await this.callService.getCallHistory(userId)
      res.status(200).json(history)
    } catch (err) { next(err) }
  }
}
