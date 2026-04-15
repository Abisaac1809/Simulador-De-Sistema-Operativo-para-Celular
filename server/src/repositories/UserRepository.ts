import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import IUserRepository from '../interfaces/IUserRepository'
import User from '../entities/User'
import { CreateUserType, UpdateUserType, UserType } from '../types/User.dtos'
import { UserAlreadyExistsError } from '../errors/BusinessError'
import { prisma } from "../prisma";
import { PrismaClient } from '@prisma/client'

export default class PrismaUserRepository implements IUserRepository {
  prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = prisma
  }

  private toEntity(raw: UserType): User {
    return new User(raw)
  }

  async findById(id: string): Promise<User | null> {
    const raw = await prisma.user.findUnique({ where: { id } })
    return raw ? this.toEntity(raw) : null
  }

  async findByPhone(phone: string): Promise<User | null> {
    const raw = await prisma.user.findUnique({ where: { phone } })
    return raw ? this.toEntity(raw) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const raw = await prisma.user.findUnique({ where: { email } })
    return raw ? this.toEntity(raw) : null
  }
  
  async create(data: CreateUserType): Promise<User> {
    try {
      const raw = await prisma.user.create({ data })
      return this.toEntity(raw)
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new UserAlreadyExistsError(data.phone)
      }
      throw err
    }
  }

  async update(id: string, data: UpdateUserType): Promise<User> {
    try {
      const raw = await prisma.user.update({ where: { id }, data })
      return this.toEntity(raw)
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new UserAlreadyExistsError(data.phone ?? data.email ?? '')
      }
      throw err
    }
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } })
  }

  async findByToken(token: string): Promise<User | null> {
    const raw = await prisma.user.findFirst({ where: { token } })
    return raw ? this.toEntity(raw) : null
  }
}
