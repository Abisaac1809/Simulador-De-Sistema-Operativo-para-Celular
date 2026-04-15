import { Router } from 'express'
import AuthController from '../controllers/AuthController'
import validateSchema from '../middlewares/validateSchema'
import { CreateUserSchema } from '../schemas/User.schemas'
import PrismaUserRepository from '../repositories/UserRepository'
import AuthService from '../services/AuthService'

const router = Router()
const userRepository = new PrismaUserRepository()
const authService = new AuthService(userRepository)
const controller = new AuthController(authService)

router.post('/register', validateSchema(CreateUserSchema), controller.register)

export default router
