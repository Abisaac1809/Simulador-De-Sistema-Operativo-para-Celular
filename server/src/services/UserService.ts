import IUserRepository from '../interfaces/IUserRepository'
import IUserService from '../interfaces/IUserService'
import { UserNotFoundError } from '../errors/BusinessError'
import { UserMapper } from '../mappers/UserMapper'
import { PublicUserType, UpdateUserType } from '../types/User.dtos'

export default class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async findById(id: string): Promise<PublicUserType> {
    const user = await this.userRepository.findById(id)
    if (!user) throw new UserNotFoundError(id)
    return UserMapper.toPublic(user)
  }

  async findByEmail(email: string): Promise<PublicUserType> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) throw new UserNotFoundError(email)
    return UserMapper.toPublic(user)
  }

  async update(id: string, data: UpdateUserType): Promise<PublicUserType> {
    const existing = await this.userRepository.findById(id)
    if (!existing) throw new UserNotFoundError(id)
    const updated = await this.userRepository.update(id, data)
    return UserMapper.toPublic(updated)
  }

  async findByPhone(phone: string): Promise<{ id: string; name: string; phone: string; email: string } | null> {
    const user = await this.userRepository.findByPhone(phone)
    if (!user) return null
    return UserMapper.toPublic(user)
  }

  async delete(id: string): Promise<void> {
    const existing = await this.userRepository.findById(id)
    if (!existing) throw new UserNotFoundError(id)
    return this.userRepository.delete(id)
  }
}
