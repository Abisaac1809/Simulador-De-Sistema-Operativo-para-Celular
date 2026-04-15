import { Request, Response, NextFunction } from 'express'
import IUserService from '../interfaces/IUserService'

export default class UserController {
  constructor(private readonly userService: IUserService) {}

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'User ID is required' })
        return
      }
      const user = await this.userService.findById(id)
      res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  }

  getByEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.params
      if (!email || typeof email !== 'string') {
        res.status(400).json({ error: 'User email is required' })
        return
      }
      const user = await this.userService.findByEmail(email)
      res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'User ID is required' })
        return
      }
      const user = await this.userService.update(id, req.body)
      res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  }

  getByPhone = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rawPhone = req.params.phone
      const phone = decodeURIComponent(Array.isArray(rawPhone) ? rawPhone[0] : rawPhone)
      const user = await this.userService.findByPhone(phone)
      if (!user) {
        res.status(404).json({ message: 'User not found' })
        return
      }
      res.status(200).json({ userId: user.id, name: user.name, phone: user.phone, email: user.email })
    } catch (err) {
      next(err)
    }
  }

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'User ID is required' })
        return
      }
      await this.userService.delete(id)
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  }
}
