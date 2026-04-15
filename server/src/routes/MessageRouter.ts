import { Router } from 'express'
import authenticate from '../middlewares/authenticate'
import MessageController from '../controllers/MessageController'
import MessageService from '../services/MessageService'
import PrismaMessageRepository from '../repositories/MessageRepository'
import PrismaUserRepository from '../repositories/UserRepository'

const router = Router()
const messageRepository = new PrismaMessageRepository()
const userRepository = new PrismaUserRepository()
const messageService = new MessageService(messageRepository, userRepository)
const controller = new MessageController(messageService)

router.use(authenticate)
router.get('/conversations', controller.getConversations)
router.get('/thread/:userId', controller.getThread)

export default router
export { messageService }
