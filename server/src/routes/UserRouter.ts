import { Router } from 'express'
import UserController from '../controllers/UserController'
import validateSchema from '../middlewares/validateSchema'
import { UpdateUserSchema } from '../schemas/User.schemas'
import PrismaUserRepository from '../repositories/UserRepository'
import UserService from '../services/UserService'
import authenticate from '../middlewares/authenticate'

const router = Router()
const userRepository = new PrismaUserRepository()
const userService = new UserService(userRepository)
const controller = new UserController(userService)

router.get('/phone/:phone', authenticate, controller.getByPhone)
router.get('/:id', controller.getById)
router.put('/:id', validateSchema(UpdateUserSchema), controller.update)
router.delete('/:id', controller.remove)

export default router
