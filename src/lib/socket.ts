import { io, Socket } from 'socket.io-client'

const SERVER_URL: string = import.meta.env.VITE_SERVER_URL ?? 'http://192.168.100.45:3000'

export const socket: Socket = io(SERVER_URL, {
  withCredentials: true,
  autoConnect: false,
})

export const SERVER_BASE_URL = SERVER_URL
