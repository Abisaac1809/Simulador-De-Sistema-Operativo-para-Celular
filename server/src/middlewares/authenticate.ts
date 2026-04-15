import { Request, Response, NextFunction } from 'express'
import PrismaUserRepository from '../repositories/UserRepository'

const userRepository = new PrismaUserRepository()

export default async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.cookies?.access_token
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  const user = await userRepository.findByToken(token)
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  req.userId = user.id
  next()
}
