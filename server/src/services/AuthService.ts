import crypto from 'crypto'
import IUserRepository from '../interfaces/IUserRepository'
import IAuthService from '../interfaces/IAuthService'
import { UserAlreadyExistsError } from '../errors/BusinessError'
import { UserMapper } from '../mappers/UserMapper'
import { CreateUserType, PublicUserType } from '../types/User.dtos'

export default class AuthService implements IAuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  async registerUser(data: CreateUserType): Promise<PublicUserType> {
    const existingByEmail = await this.userRepository.findByEmail(data.email)
    if (existingByEmail) throw new UserAlreadyExistsError(data.email)

    const existingByPhone = await this.userRepository.findByPhone(data.phone)
    if (existingByPhone) throw new UserAlreadyExistsError(data.phone)

    const user = await this.userRepository.create(data)
    return UserMapper.toPublic(user)
  }

  async getAccessToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex')
    await this.userRepository.update(userId, { token })
    return token
  }
}
