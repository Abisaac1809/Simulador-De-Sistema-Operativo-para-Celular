import { Router } from 'express'
import authenticate from '../middlewares/authenticate'
import CallController from '../controllers/CallController'
import CallService from '../services/CallService'
import PrismaCallRepository from '../repositories/CallRepository'
import PrismaUserRepository from '../repositories/UserRepository'

const router = Router()
const callRepository = new PrismaCallRepository()
const userRepository = new PrismaUserRepository()
const callService = new CallService(callRepository, userRepository)
const controller = new CallController(callService)

router.use(authenticate)
router.get('/', controller.getCallHistory)

export default router
export { callService }
