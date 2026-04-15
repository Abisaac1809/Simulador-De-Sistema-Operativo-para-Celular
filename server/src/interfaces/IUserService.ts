import { PublicUserType, UpdateUserType } from '../types/User.dtos'

export default interface IUserService {
  findById(id: string): Promise<PublicUserType>
  findByEmail(email: string): Promise<PublicUserType>
  findByPhone(phone: string): Promise<{ id: string; name: string; phone: string; email: string } | null>
  update(id: string, data: UpdateUserType): Promise<PublicUserType>
  delete(id: string): Promise<void>
}
