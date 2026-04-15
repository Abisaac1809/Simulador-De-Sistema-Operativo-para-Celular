import User from '../entities/User'

export default interface IUserRepository {
  findById(id: string): Promise<User | null>
  findByPhone(phone: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(data: { phone: string; email: string; name: string }): Promise<User>
  update(id: string, data: { phone?: string; email?: string; name?: string; token?: string }): Promise<User>
  delete(id: string): Promise<void>
  findByToken(token: string): Promise<User | null>
}
