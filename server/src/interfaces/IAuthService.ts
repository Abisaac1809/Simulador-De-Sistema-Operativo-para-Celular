import { CreateUserType, PublicUserType } from '../types/User.dtos'

export default interface IAuthService {
  registerUser(data: CreateUserType): Promise<PublicUserType>
  getAccessToken(userId: string): Promise<string>
}
