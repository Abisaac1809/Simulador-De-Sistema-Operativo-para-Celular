import User from '../entities/User'
import { PublicUserType } from '../types/User.dtos'

export class UserMapper {
  static toPublic(user: User): PublicUserType {
    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
    }
  }
}
