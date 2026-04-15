import { Request, Response, NextFunction } from 'express'
import { BusinessError } from '../errors/BusinessError'

export default function globalErrorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof BusinessError) {
    res.status(err.status).json({
      status: err.status,
      name: err.name,
      message: err.message,
    })
    return
  }
  console.error('[errorHandler] Unexpected error:', err)
  res.status(500).json({
    status: 500,
    name: 'InternalServerError',
    message: 'Unexpected error',
  })
}