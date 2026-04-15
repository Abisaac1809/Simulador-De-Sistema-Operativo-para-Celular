import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/UserRouter'
import authRoutes from './routes/AuthRouter'
import messageRoutes, { messageService } from './routes/MessageRouter'
import MessageGateway from './gateways/MessageGateway'
import globalErrorHandler from './middlewares/globalErrorHandler'

const PORT = Number(process.env.PORT ?? 3000)
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://192.168.100.45:5174'

const app = express()
const httpServer = createServer(app)

export const io = new Server(httpServer, {
  cors: { origin: FRONTEND_URL, credentials: true },
})

app.use(cors({ origin: FRONTEND_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use('/users', userRoutes)
app.use('/auth', authRoutes)
app.use('/messages', messageRoutes)

app.use(globalErrorHandler)

new MessageGateway(io, messageService)

httpServer.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`)
})
