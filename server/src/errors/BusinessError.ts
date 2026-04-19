export abstract class BusinessError extends Error {
  abstract readonly status: number
  abstract readonly name: string

  constructor(message: string) {
    super(message)
  }
}

export class UserNotFoundError extends BusinessError {
  readonly status = 404
  readonly name = 'UserNotFoundError'
  constructor(id?: string) {
    super(id ? `User '${id}' not found` : 'User not found')
  }
}

export class UserAlreadyExistsError extends BusinessError {
  readonly status = 409
  readonly name = 'UserAlreadyExistsError'
  constructor(phone: string) {
    super(`User with phone '${phone}' already exists`)
  }
}

export class ValidationError extends BusinessError {
  readonly status = 400
  readonly name = 'ValidationError'
  constructor(message: string) {
    super(message)
  }
}

export class RecipientNotFoundError extends BusinessError {
  readonly status = 404
  readonly name = 'RecipientNotFoundError'
  constructor(id?: string) {
    super(id ? `Recipient '${id}' not found` : 'Recipient not found')
  }
}

export class CalleeNotFoundError extends BusinessError {
  readonly status = 404
  readonly name = 'CalleeNotFoundError'
  constructor(id?: string) { super(id ? `Callee '${id}' not found` : 'Callee not found') }
}

export class CalleeOfflineError extends BusinessError {
  readonly status = 422
  readonly name = 'CalleeOfflineError'
  constructor() { super('Callee is not connected') }
}

export class CallNotFoundError extends BusinessError {
  readonly status = 404
  readonly name = 'CallNotFoundError'
  constructor(id?: string) { super(id ? `Call '${id}' not found` : 'Call not found') }
}

export class CalleeBusyError extends BusinessError {
  readonly status = 409
  readonly name = 'CalleeBusyError'
  constructor() { super('Callee is busy') }
}
