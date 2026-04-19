import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/UserRouter'
import authRoutes from './routes/AuthRouter'
import messageRoutes, { messageService } from './routes/MessageRouter'
import callRoutes, { callService } from './routes/CallRouter'
import MessageGateway from './gateways/MessageGateway'
import CallGateway from './gateways/CallGateway'
import globalErrorHandler from './middlewares/globalErrorHandler'

const PORT = Number(process.env.PORT ?? 3000)

// Accept requests from any host on the local network (192.168.x.x / 10.x.x.x / 172.16-31.x.x)
// plus localhost. In production, set FRONTEND_URL to a specific origin.
const LOCAL_NETWORK_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|192\.168\.\d+\.\d+)(:\d+)?$/

const corsOrigin = process.env.FRONTEND_URL ?? LOCAL_NETWORK_ORIGIN

const app = express()
const httpServer = createServer(app)

export const io = new Server(httpServer, {
  cors: { origin: corsOrigin, credentials: true },
})

app.use(cors({ origin: corsOrigin, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use('/users', userRoutes)
app.use('/auth', authRoutes)
app.use('/messages', messageRoutes)
app.use('/calls', callRoutes)

app.use(globalErrorHandler)

new MessageGateway(io, messageService)
new CallGateway(io, callService)

httpServer.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`)
})
