import { Request, Response, NextFunction } from 'express'
import IAuthService from '../interfaces/IAuthService'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export default class AuthController {
  constructor(private readonly authService: IAuthService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, phone, email } = req.body
      const user = await this.authService.registerUser({ name, phone, email })
      const token = await this.authService.getAccessToken(user.id)

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        maxAge: SEVEN_DAYS_MS,
        sameSite: 'lax' as const,
      }

      res.cookie('access_token', token, cookieOptions)
      res.cookie('user_id', user.id, cookieOptions)

      res.status(201).json({
        userId: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
      })
    } catch (err) {
      next(err)
    }
  }
}
