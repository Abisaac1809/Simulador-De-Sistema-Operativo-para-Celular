import { UserType } from "../types/User.dtos"

export default class User {
  id: string
  phone: string
  email: string
  name: string
  token: string | null
  createdAt: Date

  constructor(data: UserType) {
    this.id = data.id
    this.phone = data.phone
    this.email = data.email
    this.name = data.name
    this.token = data.token ?? null
    this.createdAt = data.createdAt
  }
}
