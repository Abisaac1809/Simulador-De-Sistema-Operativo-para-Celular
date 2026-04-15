import { CreateUserInput, UpdateUserInput } from "../schemas/User.schemas";

export type CreateUserType = CreateUserInput;
export type UpdateUserType = UpdateUserInput;

export type UserType = CreateUserType & {
    id: string
    token?: string | null
    createdAt: Date
}

export type PublicUserType = {
    id: string
    name: string
    phone: string
    email: string
}